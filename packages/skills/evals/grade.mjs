/*
  The deterministic part of an eval: what can be decided by reading the files an agent wrote. The
  type-check and the build run in run-evals.mjs. Every check returns the problems it found, so a
  result says why it failed, and a clean check returns an empty list.

  Wideset's code is in the project once it is installed, so an agent without skills can read any
  prop. These checks therefore target what the source does not teach: choices the type-checker
  accepts (hand-built controls, more than one primary action, nested cards, placeholder content)
  and mistakes that compile and then silently break (a Sidebar.Trigger inside a mode wrapper loses
  focus on toggle; a Modal.Trigger without asChild nests a button in a button).
*/
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const PALETTE =
  /(?<![\w-])(?:bg|text|border|ring|fill|stroke|divide|from|to|via)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
const HEX = /(?:className|class|style)[^\n]*#[0-9a-fA-F]{3,8}\b/g;
const UNPREFIXED =
  /(?<![\w-])(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\d+(?:\.\d+)?(?![\w.-])/g;
const SCALE =
  /(?<![\w-])(?:text-(?:xs|sm|base|lg|xl|\dxl)|rounded(?:-(?:sm|md|lg|xl|\dxl))?|shadow(?:-(?:sm|md|lg|xl|\dxl))?|font-(?:normal|medium|semibold|bold)|z-\d+)(?![\w-])/g;
const FOREIGN_ICONS =
  /from\s+['"](?:lucide-react|@heroicons\/[^'"]+|react-icons[^'"]*|@tabler\/[^'"]+)['"]/g;

/** A component's value prop handler, and the wrong handler agents write for it. */
const WRONG_HANDLERS = [
  ['Select', 'onChange'],
  ['MultiSelect', 'onChange'],
  ['Switch', 'onChange'],
  ['Checkbox', 'onChange'],
  ['Tabs', 'onChange'],
  ['SegmentedControl', 'onChange'],
  ['RadioButton.Group', 'onChange'],
  ['Modal', 'onClose'],
];

const classStrings = (source) =>
  [...source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{cn\(([^)]*)\)\})/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  );

const hits = (text, pattern) => [...text.matchAll(pattern)].map((match) => match[0]);

export function checkTokens(source) {
  const classes = classStrings(source).join(' ');
  return [
    ...hits(classes, PALETTE).map((cls) => `palette class ${cls}`),
    ...hits(classes, UNPREFIXED).map((cls) => `unprefixed spacing ${cls}`),
    ...hits(classes, SCALE).map((cls) => `Tailwind scale class ${cls}`),
    ...hits(source, HEX).map(() => 'raw hex colour in styling'),
    ...(/(?<![\w-])dark:/.test(classes) ? ['dark: variant'] : []),
  ];
}

export function checkIcons(source) {
  return [
    ...hits(source, FOREIGN_ICONS).map((found) => `foreign icon library: ${found}`),
    ...(/<svg\b/.test(source) ? ['inline <svg>'] : []),
  ];
}

export function checkHandlers(source) {
  const problems = [];
  for (const [component, handler] of WRONG_HANDLERS) {
    const tag = new RegExp(`<${component.replace('.', '\\.')}\\b([^>]*?)/?>`, 'gs');
    for (const [, props] of source.matchAll(tag))
      if (new RegExp(`\\b${handler}=`).test(props))
        problems.push(`${component} takes no ${handler}`);
  }
  return problems;
}

const OVERLAY_CONTENT = /^(Modal|StatusModal|Sidepanel|Popup)\.?(Content|Panel)$/;
const TRIGGER = /^(Modal|StatusModal|Sidepanel|Popup|DropdownMenu)\.?(Trigger|Close)$/;
const NATIVE_CONTROLS = {
  button: 'Button',
  input: 'TextInput',
  select: 'Select',
  textarea: 'Textarea',
  table: 'Table',
  dialog: 'Modal',
};
const PLACEHOLDER = /lorem ipsum|john doe|jane doe|\bitem \d\b|\btest \d\b|\bfoo\b|\bbar\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const GRADIENT = /(?<![\w-])(?:bg-gradient-|bg-linear-|bg-radial|bg-conic|bg-clip-text)/;
const GREETING = /welcome back|at a glance/i;

/** One JSX element's tag, attributes and children, whichever form it was written in. */
function elementOf(node) {
  const opening = ts.isJsxElement(node) ? node.openingElement : node;
  const attributes = new Map();
  for (const attribute of opening.attributes.properties) {
    if (!ts.isJsxAttribute(attribute)) continue;
    const { initializer } = attribute;
    let value = true; // A bare attribute, or an expression whose value is not known here.
    if (initializer && ts.isStringLiteral(initializer)) value = initializer.text;
    else if (
      initializer &&
      ts.isJsxExpression(initializer) &&
      initializer.expression &&
      ts.isStringLiteralLike(initializer.expression)
    )
      value = initializer.expression.text;
    attributes.set(attribute.name.getText(), value);
  }
  const spreads = opening.attributes.properties.some(ts.isJsxSpreadAttribute);
  return { tag: opening.tagName.getText(), attributes, spreads };
}

const isElement = (node) => ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
const childElements = (node) =>
  ts.isJsxElement(node) ? node.children.filter(isElement).map((child) => elementOf(child)) : [];

/** A filled primary Button: no preset or `filled`, and no variant or `primary`. */
const isFilledPrimary = ({ tag, attributes }) => {
  if (tag !== 'Button') return false;
  const preset = attributes.get('preset');
  const variant = attributes.get('variant');
  return (
    (preset === undefined || preset === 'filled') &&
    (variant === undefined || variant === 'primary')
  );
};

/** An overlay and a tab panel are views of their own: only one is open at a time. */
const OWN_VIEW = /^(?:(?:Modal|StatusModal|Sidepanel|Popup)\.?(?:Content|Panel)|Tabs\.?Content)$/;

/** A component declared at the top of a file, with its function, through memo() or forwardRef(). */
function componentFunction(statement) {
  if (ts.isFunctionDeclaration(statement) && /^[A-Z]/.test(statement.name?.text ?? ''))
    return [statement.name.text, statement];
  if (!ts.isVariableStatement(statement)) return undefined;
  const [declaration] = statement.declarationList.declarations;
  if (!ts.isIdentifier(declaration.name) || !/^[A-Z]/.test(declaration.name.text)) return undefined;
  let value = declaration.initializer;
  while (value && ts.isCallExpression(value)) [value] = value.arguments;
  return value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))
    ? [declaration.name.text, value]
    : undefined;
}

const alwaysReturns = (statement) =>
  ts.isReturnStatement(statement) ||
  (ts.isBlock(statement) && statement.statements.some(ts.isReturnStatement));

/**
 * How many views in one file hold more than one filled primary Button. What renders together adds
 * up: a component rendered here counts here, so two stacked sections are still one view. Only what
 * cannot show at once stays apart: the branches of a ternary, an `if` that returns and the code
 * after it, a tab panel, an overlay. A `&&` adds up, since the Button beside it can show as well.
 * Each file is read alone: a component imported from another file is not counted.
 */
function viewsWithManyPrimaries(file) {
  const components = new Map(file.statements.map(componentFunction).filter(Boolean));
  const declared = new Set(components.values());
  const seenOwnViews = new Set();
  let many = 0;

  const inside = (node, rendering) => {
    let total = 0;
    ts.forEachChild(node, (child) => {
      total += count(child, rendering);
    });
    return total;
  };

  const inStatements = (statements, rendering) => {
    let total = 0;
    for (const [index, statement] of statements.entries()) {
      if (!ts.isIfStatement(statement)) {
        total += count(statement, rendering);
        continue;
      }
      const then = count(statement.thenStatement, rendering);
      if (alwaysReturns(statement.thenStatement) && !statement.elseStatement)
        return total + Math.max(then, inStatements(statements.slice(index + 1), rendering));
      const otherwise = statement.elseStatement ? count(statement.elseStatement, rendering) : 0;
      total += Math.max(then, otherwise);
    }
    return total;
  };

  const count = (node, rendering) => {
    if (ts.isConditionalExpression(node))
      return Math.max(count(node.whenTrue, rendering), count(node.whenFalse, rendering));
    if (ts.isBlock(node) || ts.isSourceFile(node))
      return inStatements([...node.statements], rendering);
    if (declared.has(node)) return 0; // Counted where it is rendered, and on its own below.
    if (!isElement(node)) return inside(node, rendering);
    const element = elementOf(node);
    if (OWN_VIEW.test(element.tag)) {
      if (!seenOwnViews.has(node) && inside(node, rendering) > 1) many += 1;
      seenOwnViews.add(node);
      return 0;
    }
    const component = components.get(element.tag);
    const rendered =
      component && !rendering.includes(element.tag)
        ? inside(component, [...rendering, element.tag])
        : 0;
    return (isFilledPrimary(element) ? 1 : 0) + rendered + inside(node, rendering);
  };

  // A component is a view of its own, and part of the page that renders it.
  for (const [name, component] of components) if (inside(component, [name]) > 1) many += 1;
  if (count(file, []) > 1) many += 1;
  return many;
}

/** Choices and silent mistakes in one file, read from its syntax tree. */
export function checkCraft(source) {
  const problems = [];
  const file = ts.createSourceFile(
    'agent.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  for (let view = viewsWithManyPrimaries(file); view > 0; view -= 1)
    problems.push('more than one filled primary Button in a view');

  const visit = (node, cards) => {
    let nextCards = cards;
    if (isElement(node)) {
      const element = elementOf(node);
      const { tag, attributes, spreads } = element;
      const children = childElements(node);

      if (OVERLAY_CONTENT.test(tag) && /^(Modal|StatusModal)/.test(tag) && !spreads) {
        const title = new RegExp(`${tag.split(/\.|Content/)[0]}\\.?Title`);
        if (!node.getText().match(title)) problems.push(`${tag} has no title`);
      }
      if (tag === 'Card' || tag === 'Tile') {
        if (cards > 0) problems.push(`${tag} nested inside a card`);
        nextCards = cards + 1;
      }
      if (NATIVE_CONTROLS[tag])
        problems.push(`hand-built <${tag}> where Wideset has ${NATIVE_CONTROLS[tag]}`);
      if (/^(Sidebar\.(Expanded|Collapsed)|Sidebar(Expanded|Collapsed))$/.test(tag)) {
        if (/<(Sidebar\.Trigger|SidebarTrigger)\b/.test(node.getText()))
          problems.push(`Sidebar.Trigger inside ${tag} loses focus on toggle`);
      }
      if (TRIGGER.test(tag) && !attributes.has('asChild')) {
        if (children.some((child) => /(^|\.)(Icon)?Button$/.test(child.tag)))
          problems.push(`${tag} wraps a button without asChild`);
      }
      if (tag === 'IconButton' && !spreads && !attributes.has('aria-label'))
        problems.push('IconButton without aria-label');
      if (tag === 'FormField' && attributes.has('errorText') && !spreads) {
        const invalid = children.some((child) => child.attributes.has('variant'));
        if (children.length === 1 && !invalid)
          problems.push('FormField errorText without variant on its control');
      }
    }
    if (ts.isJsxText(node) || ts.isStringLiteralLike(node)) {
      const text = node.text;
      if (ts.isJsxText(node) || ts.isJsxAttribute(node.parent)) {
        const isClass =
          ts.isJsxAttribute(node.parent) && node.parent.name.getText() === 'className';
        if (!isClass) {
          if (EMOJI.test(text)) problems.push('emoji in the interface');
          if (PLACEHOLDER.test(text))
            problems.push(`placeholder content: ${text.trim().slice(0, 40)}`);
          if (GREETING.test(text)) problems.push(`filler heading: ${text.trim().slice(0, 40)}`);
        }
      }
      if (GRADIENT.test(text)) problems.push('gradient');
    }
    ts.forEachChild(node, (child) => visit(child, nextCards));
  };
  visit(file, 0);
  return problems;
}

/** Each required name is imported from Wideset. `A|B` accepts either; a hook (`useToast`) counts. */
export function checkRequired(sources, required) {
  const imported = new Set();
  for (const source of sources)
    for (const [, names] of source.matchAll(
      /import\s+\{([^}]*)\}\s+from\s+['"](?:@wideset\/react|@\/components\/ui\/wideset[^'"]*)['"]/g,
    ))
      for (const name of names.split(','))
        imported.add(
          name
            .trim()
            .replace(/^type\s+/, '')
            .split(/\s+as\s+/)[0],
        );
  const used = (name) => imported.has(name) || imported.has(`use${name}`);
  return required
    .filter((entry) => !entry.split('|').some(used))
    .map((entry) => `does not use ${entry.replace('|', ' or ')}`);
}

/*
  Traps: tasks whose natural implementation compiles and builds but is wrong, where the right
  answer is in packages/design-system/specs and not in one component's source. A trap fires only in
  a case that arms it (`traps:` in the case frontmatter): choosing Select is wrong for three plans
  compared at a glance, not everywhere. Each check reads the syntax tree and returns problems.
*/

const normTag = (tag) => tag.replace(/\./g, '');

/** Every JSX element in a file, with its attributes, direct child elements and ancestors. */
function elementsOf(file) {
  const found = [];
  const visit = (node) => {
    if (isElement(node)) {
      const base = elementOf(node);
      const ancestors = [];
      for (let up = node.parent; up; up = up.parent) if (isElement(up)) ancestors.push(up);
      found.push({
        ...base,
        node,
        norm: normTag(base.tag),
        ancestors,
        kids: ts.isJsxElement(node) ? node.children.filter(isElement) : [],
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

const has = (list, pattern) => list.filter((element) => pattern.test(element.norm));
const within = (element, container) => element.ancestors.includes(container.node);
const tagOf = (node) => normTag(elementOf(node).tag);

const INTERACTIVE =
  /^(Switch|Checkbox|RadioButton|Button|IconButton|LinkButton|TextInput|Select|MultiSelect|ComboBox|a|button|input)$/;

/** id -> what the trap is, and the check over every file the agent wrote. */
export const TRAPS = {
  'choice-plan-radio': {
    summary: 'three plans compared at a glance belong in a radio group, not a Select',
    check: ({ els }) =>
      has(els, /^(Select|ComboBox)$/).map((e) => `<${e.tag}> hides the options the user compares`),
  },
  'choice-status-badge': {
    summary: 'the status of a record is a StatusBadge, not a Tag or Chip',
    check: ({ els }) =>
      has(els, /^(Tag|Chip)$/).map((e) => `<${e.tag}> used where the state of a record is shown`),
  },
  'choice-save-checkbox': {
    summary: 'a choice saved with a form is a Checkbox; Switch applies immediately',
    check: ({ els }) =>
      has(els, /^Switch$/).map(() => '<Switch> in a form that is submitted with a button'),
  },
  'choice-sidepanel-long-form': {
    summary: 'a long edit form beside its list is a Sidepanel, not a Modal',
    check: ({ els }) =>
      has(els, /^(Modal|ModalContent|StatusModal)$/).map(
        (e) => `<${e.tag}> for a long form opened from a list`,
      ),
  },
  'choice-row-menu': {
    summary: 'a row action menu is a DropdownMenu, not a Select or Popup',
    check: ({ els }) =>
      has(els, /^(Select|ComboBox|Popup|PopupContent)$/).map(
        (e) => `<${e.tag}> for a menu of actions`,
      ),
  },
  'menu-modal-trigger': {
    summary: 'a dialog opened from a menu item is controlled outside the menu',
    check: ({ els }) => {
      const problems = [];
      for (const menu of has(els, /^DropdownMenuContent$/))
        for (const inner of els)
          if (
            within(inner, menu) &&
            /^(Modal|StatusModal|Sidepanel)(Trigger|Content|Panel)?$/.test(inner.norm)
          )
            problems.push(`<${inner.tag}> inside DropdownMenu.Content closes with the menu`);
      return problems;
    },
  },
  'modal-close-async': {
    summary: 'an action that can fail must not sit inside Modal.Close asChild',
    check: ({ els }) =>
      has(els, /^(Modal|StatusModal)Close$/)
        .filter((close) => close.attributes.has('asChild'))
        .flatMap((close) =>
          els.filter(
            (inner) =>
              within(inner, close) &&
              inner.norm === 'Button' &&
              inner.attributes.has('onClick') &&
              inner.attributes.get('variant') !== 'secondary',
          ),
        )
        .map(() => 'Modal.Close asChild around an action: the dialog closes before it finishes'),
  },
  'toast-provider': {
    summary: 'toasts come from useToast under one ToastProvider',
    check: ({ els, text }) => {
      const problems = has(els, /^Toast$/).map(() => '<Toast> rendered by hand');
      if (/\buseToast\s*\(/.test(text) && !has(els, /^ToastProvider$/).length)
        problems.push('useToast without a ToastProvider anywhere');
      return problems;
    },
  },
  'optional-select-empty': {
    summary: 'a Select option cannot have an empty value',
    check: ({ files, els }) => {
      const problems = has(els, /^SelectOption$/)
        .filter((e) => e.attributes.get('value') === '')
        .map(() => '<Select.Option value="">');
      const visit = (node) => {
        if (ts.isObjectLiteralExpression(node)) {
          const named = (name) =>
            node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name);
          const value = named('value');
          if (
            value &&
            named('label') &&
            ts.isStringLiteralLike(value.initializer) &&
            value.initializer.text === ''
          )
            problems.push('an option with value: ""');
        }
        ts.forEachChild(node, visit);
      };
      for (const file of files) visit(file);
      return problems;
    },
  },
  'checkbox-group-field': {
    summary: 'a labelled set of checkboxes is one FormField around one CheckboxGroup',
    check: ({ els }) => {
      const problems = [];
      for (const field of has(els, /^FormField$/)) {
        if (field.kids.length >= 2)
          problems.push('FormField around several controls: only a single child is wired');
        for (const kid of field.kids.map(tagOf))
          if (/^(Checkbox|Switch|RadioButton)$/.test(kid))
            problems.push(`FormField around a single <${kid}>, which has its own label`);
      }
      for (const group of has(els, /^CheckboxGroup$/))
        if (
          !group.spreads &&
          !group.attributes.has('aria-label') &&
          !group.attributes.has('aria-labelledby')
        )
          problems.push('CheckboxGroup has no accessible name');
      return problems;
    },
  },
  'composed-select-field': {
    summary: 'on a composed Select, id and aria-describedby go on Select.Trigger',
    check: ({ els }) => {
      const problems = [];
      const composed = has(els, /^Select$/).filter((select) =>
        select.kids.some((kid) => /^Select(Trigger|Content)$/.test(tagOf(kid))),
      );
      const DROPPED = [
        'id',
        'size',
        'preset',
        'variant',
        'className',
        'placeholder',
        'options',
        'clearable',
        'hasSearch',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
      ];
      for (const select of composed)
        for (const name of DROPPED)
          if (select.attributes.has(name))
            problems.push(`${name} on a composed Select root is dropped; put it on Select.Trigger`);
      for (const field of has(els, /^FormField$/)) {
        for (const select of composed.filter((s) => within(s, field))) {
          const trigger = els.find((e) => e.norm === 'SelectTrigger' && within(e, select));
          if (!trigger || trigger.spreads || field.spreads) continue;
          const hasText = field.attributes.has('helperText') || field.attributes.has('errorText');
          if (hasText && !trigger.attributes.has('aria-describedby'))
            problems.push('FormField text not linked: aria-describedby missing on Select.Trigger');
          if (trigger.attributes.has('aria-describedby') && !field.attributes.has('helperTextId'))
            problems.push('Select.Trigger aria-describedby without helperTextId on FormField');
          if (field.attributes.has('htmlFor') && !trigger.attributes.has('id'))
            problems.push('FormField htmlFor without a matching id on Select.Trigger');
          if (
            !field.attributes.has('htmlFor') &&
            !trigger.attributes.has('aria-label') &&
            !trigger.attributes.has('aria-labelledby')
          )
            problems.push('composed Select has no accessible name');
        }
      }
      return problems;
    },
  },
  'tile-selectable': {
    summary: 'selectable tiles hold no controls and Tile.Radio sits in a Tile.RadioGroup',
    check: ({ els }) => {
      const problems = [];
      for (const tile of has(els, /^Tile(Checkbox|Radio)$/))
        for (const inner of els)
          if (within(inner, tile) && INTERACTIVE.test(inner.norm))
            problems.push(`<${inner.tag}> inside a selectable tile (nested interactive)`);
      if (has(els, /^TileRadio$/).length && !has(els, /^TileRadioGroup$/).length)
        problems.push('Tile.Radio without a Tile.RadioGroup');
      for (const tile of has(els, /^Tile$/))
        if (tile.attributes.has('onClick'))
          problems.push('Tile with onClick: use Tile.Checkbox or ActionTile');
      return problems;
    },
  },
  'search-deprecated': {
    summary: 'Search is deprecated: compose a TextInput',
    check: ({ els }) => has(els, /^Search$/).map(() => '<Search> is deprecated'),
  },
};

const CASES_DIR = join(dirname(fileURLToPath(import.meta.url)), 'cases');

/**
 * The traps a case arms, checked over the files an agent wrote.
 * @param {string | string[]} sources one file or all of them
 * @param {string | string[]} traps trap ids, or the name of a case whose `traps:` to use
 * @returns {string[]} problems, each prefixed with its trap id
 */
export function checkTraps(sources, traps) {
  const list = Array.isArray(sources) ? sources : [sources];
  let ids = Array.isArray(traps) ? traps : [traps];
  if (ids.length === 1 && !TRAPS[ids[0]]) {
    const path = join(CASES_DIR, `${ids[0]}.md`);
    if (!existsSync(path)) throw new Error(`unknown trap or case: ${ids[0]}`);
    ids = parseCase(readFileSync(path, 'utf8')).traps;
  }
  const files = list.map((source) =>
    ts.createSourceFile('agent.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
  );
  const context = { files, els: files.flatMap(elementsOf), text: list.join('\n') };
  return ids.flatMap((id) => {
    if (!TRAPS[id]) throw new Error(`unknown trap: ${id}`);
    return [...new Set(TRAPS[id].check(context))].map((problem) => `${id}: ${problem}`);
  });
}

/**
 * @param {string[]} sources the files the agent wrote
 * @param {string[]} required
 * @param {string[]} traps the trap ids the case arms; reported apart from `checks`
 */
export function grade(sources, required = [], traps = []) {
  const joined = sources.join('\n');
  const checks = {
    tokens: checkTokens(joined),
    icons: checkIcons(joined),
    handlers: checkHandlers(joined),
    required: checkRequired(sources, required),
    craft: sources.flatMap((source) => checkCraft(source)),
  };
  if (!sources.length) checks.required = ['the agent wrote no source files'];
  const pass = Object.values(checks).every((problems) => problems.length === 0);
  if (!traps.length) return { pass, checks };
  const fired = checkTraps(sources, traps);
  return { pass: pass && fired.length === 0, checks, traps: { armed: traps, fired } };
}

/**
 * What an agent actually used, from `claude -p --output-format stream-json`. A tie between the two
 * arms means little if the agent with skills never opened one, and a win means little if the agent
 * without them read every component's source.
 */
export function toolUsage(stream) {
  const usage = {
    skillsInvoked: [],
    skillFilesRead: 0,
    specsRead: [],
    agentsFileRead: false,
    librarySourceReads: 0,
    skillFilesBySkill: {},
    subagents: [],
  };
  for (const line of stream.split('\n')) {
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event?.type !== 'assistant') continue;
    for (const block of event.message?.content ?? []) {
      if (block.type !== 'tool_use') continue;
      if (block.name === 'Skill' && block.input?.skill) usage.skillsInvoked.push(block.input.skill);
      const path = String(block.input?.file_path ?? block.input?.path ?? '').replace(/\\/g, '/');
      if (block.name === 'Task' && block.input?.subagent_type)
        usage.subagents.push(block.input.subagent_type);
      if (/\/skills\/wideset-[^/]+\//.test(path)) usage.skillFilesRead += 1;
      // A skill can be used without a Skill call: the agent reads its files straight through Read.
      const skillFile = block.name === 'Read' && path.match(/\/skills\/([^/]+)\//);
      if (skillFile)
        usage.skillFilesBySkill[skillFile[1]] = (usage.skillFilesBySkill[skillFile[1]] ?? 0) + 1;
      const spec = path.match(/\/references\/specs\/(.+)\.md$/);
      if (spec) usage.specsRead.push(spec[1]);
      if (path.endsWith('AGENTS.wideset.md')) usage.agentsFileRead = true;
      if (/components\/ui\/wideset/.test(path)) usage.librarySourceReads += 1;
    }
  }
  return usage;
}

/** An eval case: frontmatter (`name`, `requires`, optional `traps`) and the prompt. */
export function parseCase(text) {
  const match = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('an eval case needs frontmatter');
  const field = (key) => match[1].match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';
  return {
    name: field('name'),
    requires: field('requires')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    traps: field('traps')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    prompt: match[2].trim(),
  };
}
