/**
 * The state a class's variant prefixes put it in, for the token graph (src/lib/tokenUsage.ts):
 * `hover:` → `hover`, `data-[state=open]:` → `state:open`, a breakpoint or a child selector →
 * nothing (the default). The lists name Tailwind's own variant families, not single classes, so
 * a component that uses a new variant of a known family needs no change here. A prefix that
 * matches neither list is unknown, and the token graph test and the docs build fail.
 */

/** A prefix that only narrows where a class lands (breakpoints, children, pseudo elements). */
const LAYOUT = [
  /^(max-|min-)?(sm|md|lg|xl|2xl)$/,
  /^(min|max)-\[/,
  /^@/,
  /^(first|last|only|odd|even|first-of-type|last-of-type|only-of-type|empty|before|after|\*|\*\*)$/,
  /^nth-/,
  /^(marker|selection|file|backdrop|first-letter|first-line|details-content)$/,
  /^supports-/,
  /^not-/,
  /^\[/,
  /^has-\[/,
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
  // A boolean data attribute, also on a descendant: `has-data-[shake=true]:` (a field's shake).
  [/data-\[(\w+)=true\]/, (m) => m[1]],
  // Families: any ARIA or data attribute, a form or element state, a user setting. They come after
  // the rules above, so a prefix those already read keeps its key.
  [/^aria-([\w-]+)$/, (m) => m[1]],
  [/^aria-\[([\w-]+)=["']?([\w-]+)["']?\]$/, (m) => `${m[1]}:${m[2]}`],
  [/^data-\[([\w-]+)=["']?([\w-]+)["']?\]$/, (m) => `${m[1]}:${m[2]}`],
  [/^data-\[([\w-]+)\]$/, (m) => m[1]],
  [/^data-([\w-]+)$/, (m) => m[1]],
  [
    /^(checked|indeterminate|invalid|user-invalid|valid|user-valid|required|optional|open|read-only|enabled|autofill|target|visited|placeholder-shown|in-range|out-of-range)$/,
    (m) => m[1],
  ],
  [
    /^(motion-safe|motion-reduce|dark|print|rtl|ltr|forced-colors|contrast-more|contrast-less|portrait|landscape|starting|inverted-colors|pointer-fine|pointer-coarse|pointer-none|any-pointer-fine|any-pointer-coarse|noscript)$/,
    (m) => m[1],
  ],
];

/**
 * `group-*`, `peer-*`, `in-*` and `has-*` apply another variant to an ancestor, a sibling or a
 * descendant, named or not (`group-has-[[data-slot=chip-action]]/chip:`, `peer-hover/field:`,
 * `has-data-[shake=true]:`): the inner variant decides.
 */
const RELATIVE = /^(?:group|peer|in|has)-(?!range$)(.+?)(?:\/[\w-]+)?$/;

/** `not-` turns a state into its absence, which is the default for the graph. */
const keyOf = (prefix: string): string | null | undefined => {
  if (/^not-/.test(prefix)) return null;
  const relative = RELATIVE.exec(prefix);
  if (relative) return keyOf(relative[1]);
  for (const [pattern, key] of STATE_KEYS) {
    const match = pattern.exec(prefix);
    if (match) return typeof key === 'function' ? key(match) : key;
  }
  return LAYOUT.some((pattern) => pattern.test(prefix)) ? null : undefined;
};

/** The first of a class's prefixes the lists do not know, for the error message. */
export const unknownPrefix = (prefixes: string[]) =>
  prefixes.find((prefix) => keyOf(prefix) === undefined);

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
