import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { resolveUtility, type TokenClassData } from '../../scripts/token-classes.mjs';
import tokenClassData from '../generated/token-classes.json';
import { entries, type Entry, entryById, partsOf } from './catalog';
import { kebab } from './kebab';
import { PLAYGROUNDS, type Values } from './playground';
import { classify, segments } from './tokenClasses';

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
 * The build fails (see `GUARDS`) when something would otherwise drop out of the graph without a
 * word: a `ws` class with no variable, a class the classifier does not know, a state prefix with
 * no key, a public part that is never rendered, a component with no token at all.
 */

const DATA = tokenClassData as TokenClassData;

/** Renders per component; past it the build fails rather than take minutes. */
export const MAX_RENDERS = 4096;

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
   * The control values the class appears with, as alternatives: `[{}]` always, `[{ variant:
   * 'primary', preset: 'filled' }]` only there. Keys are the playground's controls.
   */
  when: Values[];
};

export type ComponentTokens = { defaults: Values; uses: Use[] };
export type TokenEntry = {
  alias: string | null;
  light: string;
  dark: string;
  usedBy: string[];
};

// --- state prefixes ------------------------------------------------------------------------

/** A prefix that only narrows where a class lands (breakpoints, children, pseudo elements). */
const LAYOUT = [
  /^(sm|md|lg|xl|2xl|@[\w-]+)$/,
  /^(first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|\*)$/,
  /^not-/,
  /^\[/,
  /^has-\[/,
  /^group-\[/,
  /^peer-\[/,
];

/** Machine keys for a state, from a prefix or the selector inside an arbitrary one. */
const STATE_KEYS: [RegExp, string | ((match: RegExpExecArray) => string)][] = [
  [/(^|[-:.[&])disabled\b|aria-disabled|is-disabled/, 'disabled'],
  [/(^|-)(?:radix-state-|data-\[state=)(\w+)/, (m) => `state:${m[2]}`],
  [/data-state=(\w+)/, (m) => `state:${m[1]}`],
  [/(^|-)(active|pressed)\b|:active|data-\[pressed=true\]/, 'pressed'],
  [/(^|-)hover\b|:hover/, 'hover'],
  [/(^|-)focus(-visible|-within)?\b|:focus/, 'focus'],
  [/(^|-)(aria-selected|data-\[selected\]|radix-selected)/, 'selected'],
  [/(^|-)(data-\[highlighted\]|radix-highlighted)/, 'highlighted'],
  [/^(data-\[placeholder\]|placeholder)$/, 'placeholder'],
  [/data-\[?side=(\w+)\]?/, (m) => `side:${m[1]}`],
  [/^data-(active|sticky)$/, (m) => m[1]],
];

/** `not-` turns a state into its absence, which is the default for the graph. */
const keyOf = (prefix: string): string | null | undefined => {
  if (/^not-/.test(prefix)) return null;
  for (const [pattern, key] of STATE_KEYS) {
    const match = pattern.exec(prefix);
    if (match) return typeof key === 'function' ? key(match) : key;
  }
  return LAYOUT.some((pattern) => pattern.test(prefix)) ? null : undefined;
};

/** The state key of a class's prefixes; `undefined` when one of them is unknown. */
export const stateOf = (prefixes: string[]) => {
  const keys = new Set<string>();
  for (const prefix of prefixes) {
    const key = keyOf(prefix);
    if (key === undefined) return undefined;
    if (key) keys.add(key);
  }
  return keys.size ? [...keys].sort().join('+') : 'default';
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

type Axis = { key: string; values: (string | boolean)[]; content: boolean };

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
  let product: Values[] = [{ ...defaults }];
  for (const axis of axes.filter((item) => !item.content))
    product = product.flatMap((values) =>
      axis.values.map((value) => ({ ...values, [axis.key]: value })),
    );
  const content = axes
    .filter((item) => item.content)
    .flatMap((axis) =>
      axis.values
        .filter((value) => value !== defaults[axis.key])
        .map((value) => ({ ...defaults, [axis.key]: value })),
    );
  return { product, content };
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
  /^(duration|delay|ease|scale|zoom-in|zoom-out)-/,
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
  problems.push(`${where}: ${className} is a token class the classifier does not know`);
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

const usesOf = (entry: Entry, problems: string[]) => {
  const definition = PLAYGROUNDS[entry.id];
  const axes = axesOf(entry.id);
  const { product, content } = combinations(entry.id, axes);
  const renders = [...product, ...content];
  if (renders.length > MAX_RENDERS) {
    problems.push(
      `${entry.id}: ${renders.length} control combinations, more than ${MAX_RENDERS}; hide controls that do not change the look in its playground`,
    );
    return { uses: [], parts: new Set<string>() };
  }

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
  const render = (node: ReactNode, index: number) => {
    try {
      add(renderToStaticMarkup(node), index);
    } catch (error) {
      problems.push(`${entry.id}: render ${index} failed: ${(error as Error).message}`);
    }
  };
  renders.forEach((values, index) => render(definition.render(values), index));
  if (typeof definition.anatomy === 'function') render(definition.anatomy(), renders.length);

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
  for (const { slot, className, nested, renders: present } of seen.values()) {
    // Another public component's part is that component's business, not this one's.
    const part = partOf.get(slot);
    if (!part && publicSlots.has(slot)) continue;
    const parts = segments(className);
    const utility = parts.pop()!;
    const tokens = resolveUtility(DATA, utility);
    // `undefined`: not a token class; `[]`: a Wideset utility that reads no token (wds-disabled).
    if (tokens === undefined || tokens?.length === 0) continue;
    const where = `${entry.id} (${slot})`;
    if (tokens === null) {
      problems.push(`${where}: ${className} reads no declared token variable`);
      continue;
    }
    const state = stateOf(parts);
    if (state === undefined) {
      problems.push(
        `${where}: ${className} has a state prefix with no key; add it to STATE_KEYS or LAYOUT in src/lib/tokenUsage.ts`,
      );
      continue;
    }
    const property = propertyOf(utility, className, problems, where);
    uses.push({
      part: part ?? pascal(slot),
      ...(part ? {} : { internal: true as const }),
      ...(nested ? { nested: true as const } : {}),
      className,
      state,
      property,
      tokens: tokens.map((token) => token.name),
      group: tokens[0]?.group ?? 'other',
      when: whenOf(present),
    });
  }
  return { uses, parts: new Set([...slots].flatMap((slot) => partOf.get(slot) ?? [])) };
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
      problems.push(`${entry.id}: no playground`);
      continue;
    }
    const { uses, parts } = usesOf(entry, problems);
    if (!uses.length) problems.push(`${entry.id}: no token classes found in any render`);
    for (const part of partsOf(entry)) {
      const name = part.exportName;
      if (parts.has(name) || definition.absent?.[name] || NO_ELEMENT.has(name)) continue;
      problems.push(
        `${entry.id}: part ${name} is never rendered; draw it in the playground's anatomy(), or say why in absent`,
      );
    }
    components[entry.id] = { defaults: definition.defaults, uses };
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
