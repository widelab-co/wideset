/**
 * Which design tokens each component paints with, and in which variant and state, read out of
 * the source so the answer is never a hand-kept list. With graph.json (component ↔ component)
 * this is the token half of the knowledge graph: component → variant → state → token → primitive,
 * and back from a token to everything it would change.
 *
 * Read: every `ws` class in a component's source files. In `*.variants.ts` each class string
 * carries the CVA condition it sits under (`{ variant: 'primary', style: 'border' }`, compound
 * variants and `*SizeVariants` maps included); a Tailwind state prefix (`hover:`, `radix-disabled:`,
 * `data-[state=on]:`) becomes the state. A class resolves through the `@theme` variable it reads to
 * the first `--ws-` token in the var() chain, then on to the primitive in light and in dark.
 *
 * Output: src/generated/token-usage.json
 *   components  { [catalogId]: { defaults: { axis: value }, uses: [{ class, token, group, state, when }] } }
 *   tokens      { [token]: { light, dark, lightValue, darkValue, usedBy: [catalogId] } }
 *   unresolved  { [catalogId]: [class] }   ws classes that point at no variable (a typo or a gone token)
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { generatedDir, library } from './paths.mjs';

const catalog = JSON.parse(readFileSync(join(generatedDir, 'catalog.json'), 'utf8'));

// --- variables: light (:root, @theme) and dark (.dark), @utility bodies ----------------------
const ROOT = {};
const DARK = {};
const UTILITIES = {};
const cssFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return name.endsWith('.css') && !name.includes('tokens_figma') ? [path] : [];
  });
for (const path of cssFiles(join(library, 'src/styles'))) {
  const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const stack = [];
  let buf = '';
  for (const ch of css) {
    if (ch === '{') {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      const decl = buf.trim();
      buf = '';
      // `@utility z-ws-sticky { … }` and plain `.drop-shadow-ws-medium { … }` rules are classes too.
      const utility = stack.find((selector) => /^(@utility\s+|\.)[\w-]+-ws-[\w-]+$/.test(selector));
      if (utility) {
        const name = utility.replace(/^@utility\s+|^\./, '');
        (UTILITIES[name] ??= []).push(
          ...[...decl.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]),
        );
      }
      const m = decl.match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/);
      if (m) {
        const dark = stack.some((selector) => /(^|[\s,])\.dark\b/.test(selector));
        (dark ? DARK : ROOT)[m[1]] = m[2].trim();
      }
    } else buf += ch;
  }
}
const refOf = (value) => value?.match(/^var\(\s*(--[\w-]+)/)?.[1];
/** The var() chain from a variable down to its value, in one theme. */
const chain = (name, theme) => {
  const steps = [name];
  let value = (theme === 'dark' && DARK[name]) || ROOT[name];
  for (let i = 0; i < 12 && refOf(value); i++) {
    const next = refOf(value);
    steps.push(next);
    value = (theme === 'dark' && DARK[next]) || ROOT[next];
  }
  return { steps, value: value ?? '' };
};

// --- class → @theme variable → token ---------------------------------------------------------
const SPACING =
  /^(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|inset|inset-x|inset-y|top|right|bottom|left|start|end|translate-x|translate-y|basis|scroll-m|scroll-p|indent)$/;
const NAMESPACES = [
  [/^(bg|from|via|to)$/, ['--background-color-ws-'], 'background'],
  [/^text$/, ['--text-color-ws-', '--text-ws-'], 'text'],
  [/^border(-[trblxy])?$|^divide(-[xy])?$/, ['--border-color-ws-', '--border-width-ws-'], 'border'],
  [/^outline$/, ['--outline-color-ws-'], 'focus'],
  [/^(fill|stroke)$/, ['--fill-ws-', '--stroke-ws-'], 'icon'],
  [/^decoration$/, ['--decoration-ws-'], 'text'],
  [SPACING, ['--spacing-ws-'], 'spacing'],
  [/^rounded(-[trblse]{1,2})?$/, ['--radius-ws-'], 'radius'],
  [/^shadow$/, ['--shadow-ws-'], 'shadow'],
  [/^drop-shadow$/, ['--drop-shadow-ws-'], 'shadow'],
  [
    /^(leading|tracking|font)$/,
    ['--leading-ws-', '--tracking-ws-', '--font-weight-ws-', '--font-ws-'],
    'type',
  ],
  [/^z$/, ['--z-index-ws-'], 'layer'],
  [/^slide-(in|out)-(from|to)-(top|bottom|left|right|start|end)$/, ['--spacing-ws-'], 'motion'],
];
const ARBITRARY = [
  [/^bg$/, 'background'],
  [/^text$/, 'text'],
  [/ring|border|stroke|divide/, 'border'],
  [/outline/, 'focus'],
  [/fill/, 'icon'],
  [/shadow/, 'shadow'],
];
const groupOfVariable = (name) =>
  /background/.test(name)
    ? 'background'
    : /text-color|--ws-.*-text-/.test(name)
      ? 'text'
      : /stroke|border/.test(name)
        ? 'border'
        : /radius/.test(name)
          ? 'radius'
          : /spacing|size/.test(name)
            ? 'spacing'
            : /shadow|elevation/.test(name)
              ? 'shadow'
              : /font|leading|tracking/.test(name)
                ? 'type'
                : 'other';

/** `{ variable, group }` for a utility, `undefined` when it is not a token class, `null` when it should be one and resolves to nothing. */
const resolve = (utility) => {
  const u = utility
    .replace(/^!|!$/g, '')
    .replace(/^-/, '')
    .replace(/\/\d+$/, '');
  if (UTILITIES[u]) {
    const variable = UTILITIES[u].find((name) => name.startsWith('--ws-')) ?? `@${u}`;
    return {
      variable,
      group: /typography/.test(u) ? 'type' : /^z-/.test(u) ? 'layer' : groupOfVariable(u),
    };
  }
  let m = u.match(/^([a-z-]+?)-\[var\((--[\w-]+)\)\]$/) || u.match(/^([a-z-]+?)-\((--[\w-]+)\)$/);
  if (m) {
    const group = ARBITRARY.find(([re]) => re.test(m[1]))?.[1] ?? groupOfVariable(m[2]);
    return ROOT[m[2]] !== undefined ? { variable: m[2], group } : null;
  }
  m = u.match(/^([a-z-]+?)-ws-([\w-]+)$/);
  if (m) {
    for (const [re, prefixes, group] of NAMESPACES) {
      if (!re.test(m[1])) continue;
      for (const prefix of prefixes)
        if (ROOT[prefix + m[2]] !== undefined) return { variable: prefix + m[2], group };
    }
    return null;
  }
  return undefined;
};
/** A utility stands for the first `--ws-` variable in its chain: the alias, else the primitive. */
const tokenOf = (variable) =>
  variable.startsWith('@')
    ? variable
    : (chain(variable, 'light').steps.find((step) => step.startsWith('--ws-')) ?? variable);

const STATES = [
  [/^hover$|group-hover|highlighted/, 'hover'],
  [/^active$|group-active|has-active/, 'pressed'],
  [/focus/, 'focus'],
  [/disabled/, 'disabled'],
  [/state-checked|state=checked|aria-checked/, 'checked'],
  [/state-unchecked|state=unchecked/, 'unchecked'],
  [/indeterminate/, 'indeterminate'],
  [/state=on|state-on|aria-selected|state=active|state-active/, 'selected'],
  [/state=open|state-open|aria-expanded/, 'open'],
  [/state=closed|state-closed/, 'closed'],
  [/placeholder/, 'placeholder'],
  [/invalid|danger/, 'invalid'],
];
const stateOf = (prefix) => {
  if (!prefix) return 'default';
  // `not-aria-disabled:` and `enabled:` only guard the state they sit beside; they name none.
  const parts = prefix.split(':').filter((part) => part && !/^(not-|enabled$)/.test(part));
  if (!parts.length) return 'default';
  const named = parts.map((part) => STATES.find(([re]) => re.test(part))?.[1]).filter(Boolean);
  return named.length ? [...new Set(named)].join('+') : parts.join(':');
};

const CLASS =
  /(?:[\w-]+(?:\[[^\]\s'"`]*\])?(?:\/[\w-]+)?:)*!?-?(?:[a-z][a-z-]*-ws-[\w-]+(?:\/\d+)?|[a-z][a-z-]*-\[var\(--ws-[\w-]+\)\]|[a-z][a-z-]*-\(--ws-[\w-]+\)|typography-[\w-]+)!?/g;

// --- CVA: every string literal with the variant condition it sits under ----------------------
const SKIP_AXES = new Set(['enabled', 'animate', 'motion']);
export function variantStrings(src) {
  const out = [];
  const defaults = {};
  const stack = [];
  let pending = null;
  let lastIdent = null;
  const clean = (pairs) =>
    Object.fromEntries(
      Object.entries(pairs).filter(
        ([k]) => !SKIP_AXES.has(k) && k !== 'className' && k !== 'class',
      ),
    );
  const context = (inline) => {
    for (let d = stack.length - 1; d > 0; d--)
      if (
        stack[d].open === '{' &&
        stack[d - 1].open === '[' &&
        /compoundVariants$/i.test(stack[d - 1].key ?? '')
      )
        return clean(stack[d].pairs);
    const path = [...stack.map((frame) => frame.key), inline];
    for (let j = path.length - 1; j >= 1; j--) {
      const value = path[j];
      const axis = path[j - 1];
      if (!value || !axis) continue;
      if (j - 1 === 0 && /SizeVariants$/.test(axis)) return clean({ size: value });
      const container = j >= 2 ? path[j - 2] : null;
      if (['className', 'class', 'variants', 'compoundVariants', 'defaultVariants'].includes(axis))
        continue;
      if (container === 'variants' || (j - 2 === 0 && container && /Variants$/.test(container)))
        return clean({ [axis]: value });
    }
    return {};
  };
  const skipSpace = (k) => {
    while (k < src.length && /\s/.test(src[k])) k++;
    return k;
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
    } else if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
    } else if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\\') j++;
        j++;
      }
      const text = src.slice(i + 1, j);
      i = j + 1;
      const k = skipSpace(i);
      if (src[k] === ':') {
        pending = text;
        i = k + 1;
        continue;
      }
      const top = stack[stack.length - 1];
      if (pending && top?.open === '{' && /^[\w-]+$/.test(text)) {
        top.pairs[pending] = text;
        if (/defaultVariants$/i.test(top.key ?? '') && !SKIP_AXES.has(pending))
          defaults[pending] = text;
      }
      out.push({ text, when: context(pending) });
      pending = null;
    } else if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[\w$]/.test(src[j])) j++;
      const ident = src.slice(i, j);
      i = j;
      const k = skipSpace(i);
      if (src[k] === ':' && src[k + 1] !== ':') {
        pending = ident;
        i = k + 1;
      } else {
        const top = stack[stack.length - 1];
        if (pending && top?.open === '{' && (ident === 'true' || ident === 'false')) {
          top.pairs[pending] = ident;
          if (/defaultVariants$/i.test(top.key ?? '') && !SKIP_AXES.has(pending))
            defaults[pending] = ident;
        }
        lastIdent = ident;
      }
    } else if (c === '=' && !'=>'.includes(src[i + 1]) && !'=!<>'.includes(src[i - 1])) {
      pending = lastIdent;
      i++;
    } else if ('{[('.includes(c)) {
      stack.push({ key: pending, open: c, pairs: {} });
      pending = null;
      i++;
    } else if ('}])'.includes(c)) {
      stack.pop();
      i++;
    } else {
      if (c === ',' || c === ';') pending = null;
      i++;
    }
  }
  return { out, defaults };
}

// --- per component ---------------------------------------------------------------------------
const components = {};
const unresolved = {};
const usedBy = new Map();
for (const entry of catalog) {
  const uses = new Map();
  const defaults = {};
  const add = (text, when) => {
    for (const { 0: cls, index } of text.matchAll(CLASS)) {
      // Inside an arbitrary value (`[--x:var(--spacing-ws-5)]`): the var() pass below reads it.
      if (index > 0 && '-('.includes(text[index - 1])) continue;
      let depth = 0;
      let at = -1;
      for (let k = 0; k < cls.length; k++) {
        if ('[('.includes(cls[k])) depth++;
        else if ('])'.includes(cls[k])) depth--;
        else if (cls[k] === ':' && depth === 0) at = k;
      }
      const prefix = at >= 0 ? cls.slice(0, at) : '';
      const utility = at >= 0 ? cls.slice(at + 1) : cls;
      const hit = resolve(utility);
      if (hit === undefined) continue;
      if (hit === null) {
        (unresolved[entry.id] ??= new Set()).add(utility);
        continue;
      }
      const token = tokenOf(hit.variable);
      const row = { class: utility, token, group: hit.group, state: stateOf(prefix), when };
      record(row);
    }
    // A variable read in an arbitrary value or a style prop: `[--thumb:var(--spacing-ws-5)]`.
    for (const [, name] of text.matchAll(/var\(\s*(--(?:ws-|[\w-]+-ws-)[\w-]+)\s*[,)]/g)) {
      if (ROOT[name] === undefined) continue; // a component's own variable, set inline
      record({
        class: `var(${name})`,
        token: tokenOf(name),
        group: groupOfVariable(name),
        state: 'default',
        when,
      });
    }
  };
  const record = (row) => {
    uses.set(JSON.stringify(row), row);
    if (!usedBy.has(row.token)) usedBy.set(row.token, new Set());
    usedBy.get(row.token).add(entry.id);
  };
  for (const file of entry.sourceFiles) {
    if (/\.(stories|test)\.tsx?$/.test(file)) continue;
    const src = readFileSync(join(library, file), 'utf8');
    if (/\.variants\.ts$/.test(file)) {
      const parsed = variantStrings(src);
      Object.assign(defaults, parsed.defaults);
      for (const { text, when } of parsed.out) add(text, when);
    } else {
      for (const line of src.split('\n')) if (!/^\s*(\/\/|\*|\/\*)/.test(line)) add(line, {});
    }
  }
  if (uses.size) components[entry.id] = { defaults, uses: [...uses.values()] };
}

const tokens = {};
for (const [token, ids] of [...usedBy].sort(([a], [b]) => a.localeCompare(b))) {
  if (token.startsWith('@')) {
    tokens[token] = { usedBy: [...ids].sort() };
    continue;
  }
  const light = chain(token, 'light');
  const dark = chain(token, 'dark');
  tokens[token] = {
    light: light.steps.at(-1),
    dark: dark.steps.at(-1),
    lightValue: light.value,
    darkValue: dark.value,
    usedBy: [...ids].sort(),
  };
}

writeFileSync(
  join(generatedDir, 'token-usage.json'),
  JSON.stringify(
    {
      components,
      tokens,
      unresolved: Object.fromEntries(
        Object.entries(unresolved).map(([id, set]) => [id, [...set].sort()]),
      ),
    },
    null,
    2,
  ) + '\n',
);
const total = Object.values(components).reduce((sum, c) => sum + c.uses.length, 0);
console.log(
  `token-usage: ${Object.keys(components).length} components, ${Object.keys(tokens).length} tokens, ${total} uses, ${Object.keys(unresolved).length} with unresolved classes`,
);
