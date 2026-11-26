/**
 * The state a class's variant prefixes put it in, for the token graph (src/lib/tokenUsage.ts):
 * `hover:` → `hover`, `data-[state=open]:` → `state:open`, a breakpoint or a child selector →
 * nothing (the default). A prefix that matches neither list is unknown, and the build fails.
 */

/** A prefix that only narrows where a class lands (breakpoints, children, pseudo elements). */
const LAYOUT = [
  /^(sm|md|lg|xl|2xl|@[\w-]+)$/,
  /^(first|last|only|odd|even|first-of-type|last-of-type|empty|before|after|\*)$/,
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
];

/**
 * `group-*` and `peer-*` apply another variant to an ancestor or a sibling, named or not
 * (`group-has-[[data-slot=chip-action]]/chip:`, `peer-hover/field:`): the inner variant decides.
 */
const RELATIVE = /^(?:group|peer)-(.+?)(?:\/[\w-]+)?$/;

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
