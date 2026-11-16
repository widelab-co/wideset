/**
 * What a playground definition is made of, and the small helpers every definition in
 * src/examples/<id>/playground.tsx shares. Kept apart from src/lib/playground.tsx, which imports every
 * definition, so a definition can import this without a cycle.
 */
import { createElement } from 'react';

import generatedControls from '../generated/controls.json';

export type Values = Record<string, string | boolean>;
export type Control =
  | { key: string; label: string; type: 'select'; options: { label: string; value: string }[] }
  | { key: string; label: string; type: 'switch' };
export type PlaygroundDefinition = {
  defaults: Values;
  groups: { title: string; controls: Control[] }[];
  render: (values: Values) => React.ReactNode;
  code: (values: Values) => string;
  /**
   * What the gallery card shows instead of `render(defaults)`. For overlays: the stage is
   * the closed trigger (the real overlay portals to the body), the card draws it open.
   */
  preview?: () => React.ReactNode;
  /**
   * The composition the Anatomy section draws, with every part present so each one can be
   * named. Parts are found by their `data-slot` attribute. Rules: the
   * `wideset-component-anatomy` skill (`.agents/skills/`). `false` leaves the section out: the
   * parts are kinds of the same thing rather than pieces of one (Pagination's Numbers and
   * Overflow are two layouts, never drawn together).
   */
  anatomy?: false | (() => React.ReactNode);
  /**
   * What the parts table says, by named export, for a part the picture cannot draw because it
   * only exists in another state (`SelectItemText: 'Only when open'`). Others read "Renders no
   * element": a root, provider or portal with no element of its own.
   */
  absent?: Record<string, string>;
  /** Extra classes for the whole stage: the inverse variant paints it dark. */
  stage?: (values: Values) => string | undefined;
  /**
   * Draw the stage only in the browser. The stage is in the page's HTML by default, so it shows
   * before any JavaScript; a component that reads `document` while rendering, or whose first
   * render depends on the day (a calendar opens on today), would not match it.
   */
  clientOnly?: boolean;
  /**
   * The component's `examples/default.tsx`, set by src/lib/playground.tsx. A definition
   * without its own `render` and `code` shows this example with the generated props.
   */
  example?: { Component: React.ComponentType<Record<string, unknown>>; source: string };
};

const SIZE_NAMES: Record<string, string> = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra large',
};

/** Select options from values: size keys get their names, the rest is capitalised. */
export const options = (...values: string[]) =>
  values.map((value) => ({
    label: SIZE_NAMES[value] ?? value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }));

/** Props that equal the component's own default are left out of the snippet. */
export const attrs = (pairs: [string, string | boolean, string | boolean][]) =>
  pairs
    .filter(([, value, fallback]) => value !== fallback)
    .map(([name, value]) => (typeof value === 'boolean' ? name : `${name}="${value}"`))
    .join(' ');

/** `attrs()` output with its leading space, or nothing. */
export const withSpace = (text: string) => (text ? ` ${text}` : '');

// --- controls generated from the types ---------------------------------------

type GeneratedControl =
  | { name: string; type: 'select'; values: string[]; default?: string }
  | { name: string; type: 'switch'; default?: boolean };
const GENERATED = generatedControls as Record<string, GeneratedControl[]>;

/** Never a control: plumbing, not something a reader compares on the stage. */
const ALWAYS_HIDDEN = new Set(['asChild', 'className', 'children', 'defaultMotion']);
const SIZE_ORDER = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '2xl'];
/** Names the reader knows from Figma; a playground can still rename them. */
const FRIENDLY: Record<string, string> = { preset: 'Style' };
/** Booleans that are a state of the component rather than a look. */
const STATES = new Set([
  'disabled',
  'readOnly',
  'required',
  'invalid',
  'hasError',
  'isLoading',
  'loading',
  'selected',
  'active',
  'collapsed',
  'dismissed',
]);
/** Appearance selects in reading order; the rest follow alphabetically. */
const PRIORITY = ['variant', 'type', 'preset', 'color', 'status', 'emphasis', 'shape', 'size'];
const GROUP_ORDER = ['Appearance', 'Content', 'State', 'Behavior'];

/** `showCloseButton` → `Show close button`; `fullWidth` → `Full width`. */
const sentence = (name: string) => {
  const words = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};
const optionLabel = (value: string) => SIZE_NAMES[value] ?? sentence(value);

/** A content control written by hand: realistic labels, an icon, a count. */
export type ContentControl = Control & { default: string | boolean; group?: string };

export type PlaygroundConfig = {
  /**
   * The props types in src/generated/controls.json whose unions and booleans become
   * controls, root first (`'ButtonProps'`, or `['ModalContentProps', 'ModalFooterProps']`).
   * A new variant in the types appears in the playground without touching this file.
   */
  from: string | string[];
  /** Props to leave out (`type`, `open`, internals). `asChild`, `className`, … always are. */
  hide?: string[];
  /** Only these props, in this order; for parts with many props. Keys as in `rename`. */
  only?: string[];
  /** A second table's prop under its own key, when two parts share a name: `{ 'ModalFooterProps.variant': 'footer' }`. */
  rename?: Record<string, string>;
  /** Rail labels: `{ preset: 'Style' }` is the default; anything else is sentence case. */
  labels?: Record<string, string>;
  /** Group per key when the default (unions → Appearance, booleans → State) is wrong. */
  group?: Record<string, string>;
  /** Option order or a subset, when the union's own order reads badly. */
  order?: Record<string, string[]>;
  /**
   * An optional union whose absence means something (no separator, colour from the initials):
   * its label for the "not set" option, listed first. Not set leaves the prop out entirely.
   */
  optional?: Record<string, string>;
  /** Initial values that differ from the component's default (the stage looks better with them). */
  defaults?: Values;
  /** Hand-written controls for content the types do not have. */
  content?: ContentControl[];
};

/** What `render` and `code` get besides the values: the generated props, by table. */
export type PlaygroundProps = {
  /** The generated props of a table (the first by default), keyed by their real names. */
  props: (table?: string) => Record<string, string | boolean>;
  /** The same as JSX attributes with a leading space, without the ones at their default. */
  attrs: (table?: string) => string;
};

/** The value of an `optional` select's "not set" option. */
const UNSET = '';

type Generated = { key: string; prop: string; table: string; baseline: string | boolean };

/** Does the props type have anything a playground can switch? */
export const hasControls = (table: string | undefined) => Boolean(table && GENERATED[table]);

/**
 * The code of `examples/default.tsx` as the Code tab prints it: the JSX it returns, with
 * `{...props}` replaced by the attributes the rail chose.
 */
const exampleCode = (source: string, attributes: string) => {
  // The last `return` of the file: `return (\n  <X …>\n);` or a one-line `return <X … />;`.
  const body =
    source.match(/return \(\n([\s\S]*?)\n\s*\);\n\}\s*$/)?.[1] ??
    source.match(/return (<[\s\S]*>);\n\}\s*$/)?.[1] ??
    source.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');
  const lines = body.replace(/\s*\{\.\.\.props\}/, attributes).split('\n');
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length),
  );
  return lines
    .map((line) => line.slice(indent))
    .join('\n')
    .trim();
};

/**
 * A playground whose controls come from the types. Without `render` and `code` it shows the
 * component's `examples/default.tsx`; a `playground.tsx` next to it only adds what the types
 * cannot say (names, hidden props, content, the stage), and a component without one still
 * gets a playground from its default example.
 */
export const playground = (
  config: PlaygroundConfig & {
    render?: (values: Values, kit: PlaygroundProps) => React.ReactNode;
    code?: (values: Values, kit: PlaygroundProps) => string;
  } & Pick<PlaygroundDefinition, 'preview' | 'anatomy' | 'absent' | 'stage' | 'clientOnly'>,
): PlaygroundDefinition => {
  const tables = Array.isArray(config.from) ? config.from : [config.from];
  const hidden = new Set(config.hide ?? []);
  const generated: Generated[] = [];
  const controls: { control: Control; group: string; rank: number }[] = [];
  const defaults: Values = {};

  tables.forEach((table, tableIndex) => {
    const rows = GENERATED[table];
    if (!rows) throw new Error(`playground: no generated controls for ${table}`);
    for (const row of rows) {
      const key = config.rename?.[`${table}.${row.name}`] ?? row.name;
      if (ALWAYS_HIDDEN.has(row.name) || row.name.startsWith('default')) continue;
      if (row.name.startsWith('on') && /^on[A-Z]/.test(row.name)) continue;
      if (hidden.has(key) || hidden.has(row.name)) continue;
      if (config.only && !config.only.includes(key)) continue;
      if (generated.some((item) => item.key === key)) continue;
      // A native `<button type>` changes nothing on the stage.
      if (row.type === 'select' && row.values.join() === 'button,submit,reset') continue;

      const label = config.labels?.[key] ?? FRIENDLY[row.name] ?? sentence(row.name);
      let control: Control;
      let initial: string | boolean;
      if (row.type === 'switch') {
        control = { key, label, type: 'switch' };
        initial = row.default ?? false;
      } else {
        const values = config.order?.[key] ?? orderValues(row.values, row.default);
        control = {
          key,
          label,
          type: 'select',
          options: [
            ...(config.optional?.[key] ? [{ label: config.optional[key], value: UNSET }] : []),
            ...values.map((value) => ({ label: optionLabel(value), value })),
          ],
        };
        initial = row.default ?? (config.optional?.[key] ? UNSET : values[0]);
      }
      // The component's own default when the types know it; otherwise what the stage starts at.
      const value = config.defaults?.[key] ?? initial;
      defaults[key] = value;
      // Unset is the baseline of an optional prop: any value it has is printed.
      const baseline = row.default ?? (config.optional?.[key] ? UNSET : value);
      generated.push({ key, prop: row.name, table, baseline });
      const priority = PRIORITY.indexOf(row.name);
      controls.push({
        control,
        group:
          config.group?.[key] ??
          (row.type === 'select' || !STATES.has(row.name) ? 'Appearance' : 'State'),
        rank:
          config.only?.indexOf(key) ??
          tableIndex * 1000 +
            (priority === -1 ? 100 : priority) +
            (row.type === 'switch' ? 200 : 0),
      });
    }
  });

  for (const control of config.content ?? []) {
    const { default: initial, group, ...rest } = control;
    defaults[control.key] = config.defaults?.[control.key] ?? initial;
    controls.push({ control: rest as Control, group: group ?? 'Content', rank: 500 });
  }

  const titles = [...new Set(controls.map((item) => item.group))].sort(
    (a, b) =>
      (GROUP_ORDER.indexOf(a) + 1 || 99) - (GROUP_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b),
  );
  const groups = titles.map((title) => ({
    title,
    controls: controls
      .filter((item) => item.group === title)
      .sort((a, b) => a.rank - b.rank)
      .map((item) => item.control),
  }));

  const kitFor = (values: Values): PlaygroundProps => {
    const of = (table = tables[0]) => generated.filter((item) => item.table === table);
    return {
      props: (table) =>
        Object.fromEntries(
          of(table)
            .filter((item) => values[item.key] !== UNSET)
            .map((item) => [item.prop, values[item.key]]),
        ),
      attrs: (table) =>
        of(table)
          .filter((item) => values[item.key] !== item.baseline && values[item.key] !== UNSET)
          .map((item) => {
            const value = values[item.key];
            if (value === true) return ` ${item.prop}`;
            if (value === false) return ` ${item.prop}={false}`;
            return ` ${item.prop}="${value}"`;
          })
          .join(''),
    };
  };

  const definition: PlaygroundDefinition = {
    defaults,
    groups,
    render: (values) => {
      if (config.render) return config.render(values, kitFor(values));
      const example = definition.example;
      return example ? createElement(example.Component, kitFor(values).props()) : null;
    },
    code: (values) => {
      if (config.code) return config.code(values, kitFor(values));
      const example = definition.example;
      return example ? exampleCode(example.source, kitFor(values).attrs()) : '';
    },
    preview: config.preview,
    anatomy: config.anatomy,
    absent: config.absent,
    stage: config.stage,
    clientOnly: config.clientOnly,
  };
  return definition;
};

/** Sizes by scale; anything else with the default first, then in the order the type declares. */
const orderValues = (values: string[], fallback?: string) => {
  if (values.every((value) => SIZE_ORDER.includes(value)))
    return [...values].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (!fallback || !values.includes(fallback)) return values;
  return [fallback, ...values.filter((value) => value !== fallback)];
};
