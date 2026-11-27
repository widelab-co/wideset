import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { cn } from '../../../../packages/design-system/src/lib/utils';
import { resolveUtility, type TokenClassData } from '../../scripts/token-classes.mjs';
import generatedControls from '../generated/controls.json';
import tokenClassData from '../generated/token-classes.json';
import { entries, type Entry, entryById, partsOf } from './catalog';
import { kebab } from './kebab';
import { PLAYGROUNDS, type Values } from './playground';
import { classify, segments } from './tokenClasses';
import { type ClassSource, PORTALLED, type PortalledPart } from './tokenUsagePortals';
import { stateOf, unknownPrefix } from './tokenUsageStates';

/**
 * Which design tokens each component paints with, in which part, variant and state: the token
 * half of the knowledge graph (component → part → condition → token → primitive in light and
 * dark, and back from a token to every component it would change). Served as `/graph.json` and
 * as each component's `## Tokens` section.
 *
 * Read from what the component renders, never from its source text: each playground's stage is
 * rendered on the server for every combination of its controls (variants and state switches),
 * plus its `anatomy()` composition, and every element with a `data-slot` gives its classes. A
 * class is then filed under the smallest set of control values it appears with, so a compound
 * variant reads `{ variant: 'primary', preset: 'filled' }` and a class a part adds only when
 * disabled reads `{ disabled: true }`.
 *
 * The docs build and `tokenUsage.test.ts` (part of `pnpm test`) fail when something would
 * otherwise drop out of the graph without a word: a `ws` class with no variable, a class the
 * classifier does not know, a state prefix with no key, a public part that is never rendered, a
 * component with no token at all. Each message names the file to change. Size is never a
 * failure: past `MAX_RENDERS` the graph renders every pair of controls instead (`sampled`).
 */

const DATA = tokenClassData as TokenClassData;

/** Renders per component; past it the graph renders pairs of controls rather than take minutes. */
export const MAX_RENDERS = 4096;

const playgroundFile = (id: string) => `apps/docs/src/playgrounds/${id}.tsx`;

export type Use = {
  /** The part, as its named export (`ButtonIcon`), or the building block's name when `internal`. */
  part: string;
  /** Not a public part: a building block the component renders (`FieldLabel` in `FormField`). */
  internal?: true;
  /**
   * On an element inside the part that has no `data-slot` of its own: the part's inner markup
   * (Slider's track) or content the playground composed into it.
   */
  nested?: true;
  /** The class as rendered, state prefixes included. */
  className: string;
  /** Machine key: `default`, `hover`, `pressed`, `focus`, `disabled`, `state:open`, … joined by `+`. */
  state: string;
  /** What the class sets, as the Anatomy tab names it: `Background`, `Gap`. */
  property: string;
  /** The token variables it reads: one, or a `typography-*` style's four. */
  tokens: string[];
  group: string;
  /**
   * The values the class appears with, as alternatives: `[{}]` always, `[{ variant: 'primary',
   * preset: 'filled' }]` only there. Keys are the playground's controls; for a part read from
   * its variants (a portalled part), that part's own props (`side`, `size`).
   */
  when: Values[];
};

export type ComponentTokens = {
  defaults: Values;
  uses: Use[];
  /**
   * More control combinations than `MAX_RENDERS`: every pair of controls was rendered, the
   * others at their defaults, so a class only three or more values together add is missing.
   */
  sampled?: true;
};
export type TokenEntry = {
  alias: string | null;
  light: string;
  dark: string;
  usedBy: string[];
};

// --- rendering ------------------------------------------------------------------------------

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
};
const unescape = (text: string) => text.replace(/&(amp|quot|#x27|#39|lt|gt);/g, (m) => ENTITIES[m]);

const VOID = new Set([
  'area',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);

/**
 * Every element's slot and classes. An element without a `data-slot` belongs to the nearest
 * ancestor that has one (`nested`): a part's own inner elements (Slider's Radix track) or the
 * content the composition put in it. React escapes attribute values, so a regex is safe.
 */
export const slotsIn = (html: string) => {
  const out: { slot: string; classes: string[]; nested: boolean }[] = [];
  const stack: (string | undefined)[] = [];
  for (const [, close, tag, attributes = '', selfClosing] of html.matchAll(
    /<(\/)?([a-zA-Z][\w-]*)(\s[^>]*?)?(\/)?>/g,
  )) {
    if (close) {
      stack.pop();
      continue;
    }
    const own = /\sdata-slot="([^"]*)"/.exec(attributes)?.[1];
    const slot = own ?? stack.at(-1);
    if (!selfClosing && !VOID.has(tag.toLowerCase())) stack.push(slot);
    const classes = /\sclass="([^"]*)"/.exec(attributes)?.[1];
    // A part with no class still counts as rendered.
    if (own || (slot && classes))
      out.push({
        slot: slot!,
        classes: classes ? unescape(classes).split(/\s+/).filter(Boolean) : [],
        nested: !own,
      });
  }
  return out;
};

type Axis = { key: string; values: (string | boolean)[]; content?: boolean };

/**
 * Every combination of the axes' values, or, past `MAX_RENDERS`, every pair of axes with the
 * others at `base`: a compound variant rarely joins more than two props, and the full product
 * of a large component would take minutes.
 */
export const valueSets = (axes: Axis[], base: Values) => {
  const size = axes.reduce((total, axis) => total * axis.values.length, 1);
  if (size <= MAX_RENDERS) {
    let product: Values[] = [{ ...base }];
    for (const axis of axes)
      product = product.flatMap((values) =>
        axis.values.map((value) => ({ ...values, [axis.key]: value })),
      );
    return { sets: product, sampled: false };
  }
  const sets = new Map<string, Values>();
  const put = (values: Values) => sets.set(JSON.stringify(values), values);
  put({ ...base });
  axes.forEach((first, i) =>
    axes.slice(i + 1).forEach((second) => {
      for (const a of first.values)
        for (const b of second.values) put({ ...base, [first.key]: a, [second.key]: b });
    }),
  );
  return { sets: [...sets.values()], sampled: true };
};

/** The playground's controls as axes; content controls vary one at a time, not in the product. */
const axesOf = (id: string): Axis[] =>
  PLAYGROUNDS[id].groups.flatMap((group) =>
    group.controls.map((control) => ({
      key: control.key,
      values:
        control.type === 'switch' ? [false, true] : control.options.map((option) => option.value),
      content: group.title === 'Content',
    })),
  );

/**
 * Every value set to render: the product of the look and state axes, then each content value
 * on its own at the defaults (content changes what is drawn, rarely how, and its product would
 * multiply the renders for nothing).
 */
const combinations = (id: string, axes: Axis[]) => {
  const defaults = PLAYGROUNDS[id].defaults;
  const { sets: product, sampled } = valueSets(
    axes.filter((item) => !item.content),
    defaults,
  );
  const content = axes
    .filter((item) => item.content)
    .flatMap((axis) =>
      axis.values
        .filter((value) => value !== defaults[axis.key])
        .map((value) => ({ ...defaults, [axis.key]: value })),
    );
  return { product, content, sampled };
};

/**
 * The smallest sets of control values a class appears with: each one a condition under which
 * every render has the class, together covering every render that has it.
 */
const conditions = (axes: string[], renders: Values[], present: Set<number>): Values[] => {
  if (present.size === renders.length) return [{}];
  const chosen: Values[] = [];
  const covered = new Set<number>();
  const subsets = (size: number, start = 0): string[][] =>
    size === 0
      ? [[]]
      : axes
          .slice(start)
          .flatMap((axis, index) =>
            subsets(size - 1, start + index + 1).map((rest) => [axis, ...rest]),
          );
  for (let size = 1; size <= axes.length && covered.size < present.size; size++) {
    for (const keys of subsets(size)) {
      const seen = new Set<string>();
      for (const index of present) {
        const condition = Object.fromEntries(keys.map((key) => [key, renders[index][key]]));
        const id = JSON.stringify(condition);
        if (seen.has(id)) continue;
        seen.add(id);
        // Implied by a smaller condition already chosen: nothing new.
        if (chosen.some((other) => Object.entries(other).every(([k, v]) => condition[k] === v)))
          continue;
        const matching = renders
          .map((values, i) => (keys.every((key) => values[key] === condition[key]) ? i : -1))
          .filter((i) => i >= 0);
        if (!matching.every((i) => present.has(i))) continue;
        chosen.push(condition);
        for (const i of matching) covered.add(i);
      }
    }
  }
  return chosen;
};

// --- guards ---------------------------------------------------------------------------------

/**
 * `ws` classes that set nothing a reader would match a surface by, so the classifier does not
 * list them on purpose. Anything else with `-ws-` that it does not know is a build error, so a
 * new property is added here or to `PROPERTIES` in tokenClasses.ts, never lost.
 */
const NOT_LISTED = [
  /^(fill|stroke)-/,
  /^z-/,
  /^-?(inset|top|right|bottom|left|start|end)(-[xy])?-/,
  /^-?(m|mx|my|mt|mr|mb|ml|ms|me)-/,
  /^-?(space-[xy]|translate-[xy]|border-spacing(-[xy])?)-/,
  /^(ws-)?slide-(in|out)-/,
  /^(duration|delay|ease|scale|zoom-in|zoom-out|animate)-/,
  /^-?z-/,
  /^(inset-)?ring-/,
  /^from-|^via-|^to-/,
  /^wds-disabled$/,
];

/** A class's property, or a name from its utility when the classifier leaves it out on purpose. */
const propertyOf = (utility: string, className: string, problems: string[], where: string) => {
  const classified = classify(className);
  if (classified) return classified.property;
  if (NOT_LISTED.some((pattern) => pattern.test(utility.replace(/^!/, ''))))
    return utility.replace(/^-/, '').replace(/-(ws-|\(|\[).*$/, '');
  problems.push(
    `${where}: the token graph does not know what ${className} sets; add its property to PROPERTIES in apps/docs/src/lib/tokenClasses.ts, or to NOT_LISTED in apps/docs/src/lib/tokenUsage.ts if nobody would match a surface by it`,
  );
  return 'unknown';
};

// --- the graph ------------------------------------------------------------------------------

/** Every public component's slot names, to tell its own parts from another component's. */
const publicSlots = new Map<string, string>();
for (const entry of entries)
  for (const name of [...entry.exports, ...partsOf(entry).map((part) => part.exportName)])
    publicSlots.set(kebab(name), entry.id);
const pascal = (slot: string) =>
  slot.replace(/(^|-)([a-z0-9])/g, (_, __, char: string) => char.toUpperCase());

const PLAYGROUND_SOURCES = import.meta.glob<string>('../playgrounds/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
});
/** The `data-slot`s a playground writes itself: stand-ins for parts it cannot render. */
const copiedSlots = (id: string) => {
  const source = PLAYGROUND_SOURCES[`../playgrounds/${id}.tsx`] ?? '';
  return new Set(
    [...source.matchAll(/data-slot[^'"\n]{0,40}['"]([a-z][a-z0-9-]*)['"]/g)].map(
      ([, slot]) => slot,
    ),
  );
};

const GENERATED_CONTROLS = generatedControls as Record<
  string,
  { name: string; type: 'select' | 'switch'; values?: string[] }[]
>;

/** A portalled part's classes over every combination of its props' selects and switches. */
const variantsOf = (source: PortalledPart) => {
  const axes = (source.from ? (GENERATED_CONTROLS[source.from] ?? []) : []).map((row) => ({
    key: row.name,
    values: row.type === 'switch' ? [false, true] : row.values!,
  }));
  const { sets: combinations, sampled } = valueSets(axes, {});
  const found = new Map<string, { className: string; nested: boolean; present: Set<number> }>();
  combinations.forEach((values, index) => {
    const call = (list: ClassSource[] = [], nested: boolean) => {
      // Merged as the component merges them, so a class another one overrides is not a use.
      const classes = cn(
        ...list.map((item) =>
          typeof item === 'string' ? item : item({ ...source.args, ...values }),
        ),
      )
        .split(/\s+/)
        .filter(Boolean);
      for (const className of classes) {
        const key = `${nested} ${className}`;
        if (!found.has(key)) found.set(key, { className, nested, present: new Set() });
        found.get(key)!.present.add(index);
      }
    };
    call(source.classes, false);
    call(source.inner, true);
  });
  return {
    keys: axes.map((axis) => axis.key),
    combinations,
    sampled,
    classes: [...found.values()],
  };
};

const usesOf = (entry: Entry, problems: string[]) => {
  const definition = PLAYGROUNDS[entry.id];
  const axes = axesOf(entry.id);
  const { product, content, sampled: stageSampled } = combinations(entry.id, axes);
  const renders = [...product, ...content];
  let sampled = stageSampled;

  // (part, class) → the renders it appears in: the product, then the content renders, then the
  // anatomy picture, so parts the stage never shows still count.
  const seen = new Map<
    string,
    { slot: string; className: string; nested: boolean; renders: Set<number> }
  >();
  const slots = new Set<string>();
  const add = (html: string, index: number) => {
    for (const { slot, classes, nested } of slotsIn(html)) {
      if (!nested) slots.add(slot);
      for (const className of classes) {
        const key = `${slot} ${nested} ${className}`;
        if (!seen.has(key)) seen.set(key, { slot, className, nested, renders: new Set() });
        seen.get(key)!.renders.add(index);
      }
    }
  };
  // A `clientOnly` stage is rendered here too: its markup only has to carry the classes, not
  // match what the browser draws later.
  const render = (draw: () => ReactNode, index: number, what: string) => {
    try {
      add(renderToStaticMarkup(draw()), index);
    } catch (error) {
      problems.push(
        `${entry.id}: ${playgroundFile(entry.id)} throws when rendered on the server with ${what}: ${(error as Error).message}`,
      );
    }
  };
  renders.forEach((values, index) =>
    render(() => definition.render(values), index, JSON.stringify(values)),
  );
  const { anatomy } = definition;
  if (typeof anatomy === 'function') render(anatomy, renders.length, 'anatomy()');

  // A part that is another component's part under this one's name (`IconButton.Icon` is
  // `ButtonIcon`, so it renders `button-icon`): the same member after a different root.
  const root = entry.exports[0];
  const names = [...new Set([...entry.exports, ...partsOf(entry).map((part) => part.exportName)])];
  const partOf = new Map(names.map((name) => [kebab(name), name]));
  for (const slot of slots) {
    const other = publicSlots.get(slot);
    if (!other || other === entry.id || partOf.has(slot)) continue;
    const otherRoot = entryById(other)!.exports[0];
    const member = pascal(slot).slice(otherRoot.length);
    if (member && pascal(slot).startsWith(otherRoot) && names.includes(root + member))
      partOf.set(slot, root + member);
  }
  const keys = axes.filter((axis) => !axis.content).map((axis) => axis.key);
  const defaults = definition.defaults;
  /** Conditions from the product; a class only content brings in reads that content value. */
  const whenOf = (present: Set<number>): Values[] => {
    const inProduct = new Set([...present].filter((index) => index < product.length));
    if (inProduct.size) return conditions(keys, product, inProduct);
    const fromContent = [...present]
      .filter((index) => index < renders.length)
      .map((index) =>
        Object.fromEntries(
          Object.entries(renders[index]).filter(([key, value]) => defaults[key] !== value),
        ),
      );
    return fromContent.length ? fromContent : [{}];
  };
  const uses: Use[] = [];
  /** One class on one part, read: its tokens, state and property, or a problem. */
  const file = (slot: string, className: string, nested: boolean, when: () => Values[]) => {
    // Another public component's part is that component's business, not this one's.
    const part = partOf.get(slot);
    if (!part && publicSlots.has(slot)) return;
    const parts = segments(className);
    const utility = parts.pop()!;
    const tokens = resolveUtility(DATA, utility);
    // `undefined`: not a token class; `[]`: a Wideset utility that reads no token (wds-disabled).
    if (tokens === undefined || tokens?.length === 0) return;
    const where = `${entry.id} (${slot})`;
    if (tokens === null) {
      problems.push(
        `${where}: ${className} reads a variable no theme declares, so it styles nothing; fix the class in the component or add the token`,
      );
      return;
    }
    const state = stateOf(parts);
    if (state === undefined) {
      problems.push(
        `${where}: the token graph does not know the prefix ${unknownPrefix(parts)}: in ${className}; add it to STATE_KEYS (a state) or LAYOUT (only where the class lands) in apps/docs/src/lib/tokenUsageStates.ts`,
      );
      return;
    }
    uses.push({
      part: part ?? pascal(slot),
      ...(part ? {} : { internal: true as const }),
      ...(nested ? { nested: true as const } : {}),
      className,
      state,
      property: propertyOf(utility, className, problems, where),
      tokens: tokens.map((token) => token.name),
      group: tokens[0]?.group ?? 'other',
      when: when(),
    });
  };

  // Portalled parts come from their variants; the playground's stand-ins only draw the picture.
  const portalled = PORTALLED[entry.id] ?? {};
  for (const slot of copiedSlots(entry.id))
    if (!portalled[slot])
      problems.push(
        `${entry.id}: ${playgroundFile(entry.id)} draws ${slot} by hand; add the variants it renders with to PORTALLED in apps/docs/src/lib/tokenUsagePortals.ts`,
      );
  for (const [slot, source] of Object.entries(portalled)) {
    if (!partOf.has(slot)) {
      problems.push(
        `${entry.id}: PORTALLED names ${slot}, which is no longer one of its parts; rename or remove it in apps/docs/src/lib/tokenUsagePortals.ts`,
      );
      continue;
    }
    slots.add(slot);
    const read = variantsOf(source);
    if (read.sampled) sampled = true;
    for (const { className, nested, present } of read.classes)
      file(slot, className, nested, () => conditions(read.keys, read.combinations, present));
  }

  for (const { slot, className, nested, renders: present } of seen.values())
    if (!portalled[slot]) file(slot, className, nested, () => whenOf(present));
  return {
    uses,
    sampled,
    parts: new Set([...slots].flatMap((slot) => partOf.get(slot) ?? [])),
  };
};

/**
 * Roots, providers and portals: no element of their own (state, context, a mount point), so no
 * render can show them. A new one is added here deliberately; any other part that never renders
 * is a build error.
 */
const NO_ELEMENT = new Set([
  'ComboBox',
  'DropdownMenu',
  'DropdownMenuPortal',
  'Modal',
  'Popup',
  'Select',
  'SelectRoot',
  'Sidepanel',
  'StatusModal',
  'ToastProvider',
  'Tooltip',
  'TooltipPortal',
]);

const build = () => {
  const problems: string[] = [];
  const components: Record<string, ComponentTokens> = {};
  for (const entry of entries) {
    const definition = PLAYGROUNDS[entry.id];
    if (!definition) {
      problems.push(`${entry.id}: no playground; add ${playgroundFile(entry.id)}`);
      continue;
    }
    const { uses, parts, sampled } = usesOf(entry, problems);
    if (!uses.length)
      problems.push(
        `${entry.id}: no render of ${playgroundFile(entry.id)} carries a token class; check that its stage renders the component`,
      );
    for (const part of partsOf(entry)) {
      const name = part.exportName;
      if (parts.has(name) || definition.absent?.[name] || NO_ELEMENT.has(name)) continue;
      problems.push(
        `${entry.id}: part ${name} is never rendered; draw it in anatomy() in ${playgroundFile(entry.id)}, or say why in its absent`,
      );
    }
    components[entry.id] = {
      defaults: definition.defaults,
      uses,
      ...(sampled ? { sampled: true as const } : {}),
    };
  }

  const tokens: Record<string, TokenEntry> = {};
  for (const [id, { uses }] of Object.entries(components))
    for (const use of uses)
      for (const name of use.tokens) {
        tokens[name] ??= { ...DATA.variables[name], usedBy: [] };
        if (!tokens[name].usedBy.includes(id)) tokens[name].usedBy.push(id);
      }
  for (const token of Object.values(tokens)) token.usedBy.sort();
  return { components, tokens, problems };
};

let cache: ReturnType<typeof build> | undefined;
/** The token graph, built once per build. Throws with every problem the guards found. */
export const tokenUsage = (options: { strict?: boolean } = {}) => {
  cache ??= build();
  if (options.strict !== false && cache.problems.length)
    throw new Error(
      `tokenUsage: ${cache.problems.length} problem(s)\n  ${cache.problems.join('\n  ')}`,
    );
  return cache;
};
