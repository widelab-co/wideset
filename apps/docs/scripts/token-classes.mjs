/**
 * Which design tokens a utility class reads: `gap-ws-4` → `--spacing-ws-4`, `typography-label-md`
 * → its size, leading, tracking and weight, `bg-(--ws-static-stroke-base)` → that variable.
 *
 * Pure: it works on the data gen-token-scales.mjs writes to src/generated/token-classes.json, so
 * the generators (Node) and the docs build (Astro, src/lib/tokenUsage.ts) resolve a class the
 * same way. Tailwind v4 reads a class's value from the theme namespace of its property
 * (`gap-*` from `--spacing-*`, `bg-*` from `--background-color-*`), so a class is resolved by
 * its prefix, not looked up by name.
 *
 * @typedef {{ alias: string | null, light: string, dark: string }} TokenValue
 *   alias: the first `--ws-` variable the token points at; light and dark: what the `var()`
 *   chain ends on in each theme (a colour primitive name, or the literal value).
 * @typedef {{
 *   variables: Record<string, TokenValue>,
 *   utilities: Record<string, { group: string, reads: string[] }>,
 *   functional: Record<string, string>,
 * }} TokenClassData
 *   variables: every `ws` variable; utilities: named `@utility` classes (and plain `.x-ws-*`
 *   rules) with the variables they read, `@apply` expanded; functional: `@utility x-*` prefix →
 *   the namespace its `--value()` reads.
 * @typedef {{ name: string, group: string }} TokenRead
 */

const SPACING =
  /^(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|inset|inset-x|inset-y|top|right|bottom|left|start|end|translate-x|translate-y|basis|scroll-m|scroll-p|indent|border-spacing|border-spacing-x|border-spacing-y)$/;

/** Class prefix → the theme namespaces it reads, in Tailwind's order, each with its token group. */
export const NAMESPACES = [
  [/^(bg|from|via|to)$/, [['--background-color-ws-', 'background']]],
  // `text-ws-400` is a size, `text-ws-static-strong` a colour; Tailwind tries both namespaces.
  [
    /^text$/,
    [
      ['--text-color-ws-', 'text'],
      ['--text-ws-', 'type'],
    ],
  ],
  [
    /^border(-[trblxyse])?$|^divide(-[xy])?$/,
    [
      ['--border-color-ws-', 'border'],
      ['--border-width-ws-', 'border'],
    ],
  ],
  [/^outline$/, [['--outline-color-ws-', 'focus']]],
  [/^fill$/, [['--fill-ws-', 'icon']]],
  [/^stroke$/, [['--stroke-ws-', 'icon']]],
  [SPACING, [['--spacing-ws-', 'spacing']]],
  // tailwindcss-animate's slide-in-from-bottom-ws-2: a spacing length.
  [/^slide-(in|out)-(from|to)-(top|bottom|left|right|start|end)$/, [['--spacing-ws-', 'motion']]],
  [/^rounded(-[trblse]{1,2})?$/, [['--radius-ws-', 'radius']]],
  [/^shadow$/, [['--shadow-ws-', 'shadow']]],
  [/^leading$/, [['--leading-ws-', 'type']]],
  [/^tracking$/, [['--tracking-ws-', 'type']]],
  [
    /^font$/,
    [
      ['--font-weight-ws-', 'type'],
      ['--font-ws-', 'type'],
    ],
  ],
];

/** For `x-(--var)` and `x-[var(--var)]`: the group by the class prefix. */
const ARBITRARY = [
  [/^(bg|from|via|to)$/, 'background'],
  [/^text$/, 'text'],
  [/^(border|divide|ring|inset-ring)(-[trblxyse])?$/, 'border'],
  [/^outline$/, 'focus'],
  [/^(fill|stroke)$/, 'icon'],
  [/shadow/, 'shadow'],
  [/^rounded/, 'radius'],
  [/^z$/, 'layer'],
  [/^(duration|delay|ease|scale|zoom-in|zoom-out|animate)$/, 'motion'],
  [SPACING, 'spacing'],
];

/** A variable a design token is made of: `--ws-…` or a `ws` theme key (`--spacing-ws-4`). */
export const isTokenVariable = (name) => /^--ws-|^--[a-z-]+-ws-/.test(name);

/**
 * The tokens a utility reads (state prefixes already removed: `bg-ws-x`, not `hover:bg-ws-x`).
 *
 * @param {TokenClassData} data
 * @param {string} utility
 * @returns {TokenRead[] | null | undefined} the tokens; `[]` for a Wideset utility that reads
 *   none (`wds-disabled`); `undefined` for a class that is not a token class (`flex`, `w-[16rem]`,
 *   `bg-(--radix-…)`); `null` for a class that should be one and reads no declared variable (a
 *   typo, a removed token, a namespace this table does not know).
 */
export const resolveUtility = (data, utility) => {
  const u = utility
    .replace(/^!|!$/g, '')
    .replace(/^-/, '')
    .replace(/\/\d+$/, '');
  const named = data.utilities[u];
  if (named) return named.reads.map((name) => ({ name, group: named.group }));

  for (const [prefix, namespace] of Object.entries(data.functional)) {
    if (!u.startsWith(`${prefix}-`)) continue;
    const name = namespace + u.slice(prefix.length + 1);
    return data.variables[name] ? [{ name, group: 'motion' }] : null;
  }

  // `p-(--x)`, `p-[var(--x)]`, or an expression with several reads:
  // `min-w-[max(var(--radix-select-trigger-width),var(--spacing-ws-28))]`.
  const variable = /^([a-z-]+?)-\((--[\w-]+)\)$/.exec(u);
  const arbitrary = /^([a-z-]+?)-\[(.*\bvar\(.*)\]$/.exec(u);
  if (variable || arbitrary) {
    const prefix = (variable ?? arbitrary)[1];
    const names = variable
      ? [variable[2]]
      : [...arbitrary[2].matchAll(/\bvar\((--[\w-]+)/g)].map(([, name]) => name);
    const tokens = names.filter(isTokenVariable);
    if (tokens.length === 0) return undefined;
    if (tokens.some((name) => !data.variables[name])) return null;
    const group = ARBITRARY.find(([re]) => re.test(prefix))?.[1] ?? 'other';
    return tokens.map((name) => ({ name, group }));
  }

  const theme = /^([a-z-]+?)-ws-([\w.-]+)$/.exec(u);
  if (theme) {
    const [, prefix, key] = theme;
    for (const [re, namespaces] of NAMESPACES) {
      if (!re.test(prefix)) continue;
      for (const [namespace, group] of namespaces)
        if (data.variables[namespace + key]) return [{ name: namespace + key, group }];
    }
    return null;
  }
  return undefined;
};
