/**
 * What a class on a rendered part says about its look: which property it sets, in which state,
 * and whether the value is a design token. The Anatomy tab reads a part's own class list with
 * this (src/components/PartTokens.tsx), so what it shows is what the component renders.
 */
export type TokenClass = {
  /** `Default`, or the state the class applies in: `Hover`, `Disabled`, `State: open`, `sm`. */
  state: string;
  property: string;
  /** The class without its state prefixes: `bg-ws-dynamic-primary-default`. */
  utility: string;
  /**
   * `token`: a `ws` class. `raw`: a value with no token (an arbitrary one like `w-[16rem]`, or
   * Tailwind's own scale). `keyword`: a plain value with nothing to bind (`border`, `w-fit`).
   */
  kind: 'token' | 'raw' | 'keyword';
};

/** Splits on `:` outside brackets: `data-[state=on]:bg-x` → ['data-[state=on]', 'bg-x']. */
const segments = (cls: string) => {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of cls) {
    if (char === '[' || char === '(') depth++;
    if (char === ']' || char === ')') depth--;
    if (char === ':' && depth === 0) {
      out.push(current);
      current = '';
    } else current += char;
  }
  out.push(current);
  return out;
};

const STATES: [RegExp, string][] = [
  [/^hover$/, 'Hover'],
  [/^(active|pressed)$/, 'Pressed'],
  [/^(focus-visible|focus|focus-within)$/, 'Focus'],
  [/^(disabled|radix-disabled|aria-disabled|data-disabled)$/, 'Disabled'],
];
const stateOf = (prefixes: string[]) => {
  if (!prefixes.length) return 'Default';
  for (const prefix of prefixes)
    for (const [match, label] of STATES) if (match.test(prefix)) return label;
  const data = prefixes.map((prefix) => prefix.match(/^data-\[state=(\w+)\]$/)?.[1]).find(Boolean);
  if (data) return `State: ${data}`;
  return prefixes.join(':');
};

const KEYWORD =
  /-(none|transparent|current|inherit|full|fit|auto|lh|px|0|\d+\/\d+)$|^outline-offset-\d+$/;
const BORDER_WIDTH = /^border(-[xytrbl])?(-\d+)?$/;
const SIDES: Record<string, string> = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
/** An arbitrary value that is a length, not a colour: `[0.75rem]`, `[2px]`, `[length:…]`. */
const LENGTH = String.raw`\[(length:[^\]]+|-?[\d.]+[a-z%]*)\]$`;
/** Tailwind's palette (`bg-red-500`, `text-gray-900/50`, `border-black`): never a token. */
const PALETTE = /^(bg|text|border)-([a-z]+-\d{2,3}|black|white)(\/\d+)?$/;
const PALETTE_PROPERTY: Record<string, string> = {
  bg: 'Background',
  text: 'Text',
  border: 'Border colour',
};
/** Property by utility prefix, most specific first. Layout classes match nothing and drop out. */
const PROPERTIES: [RegExp, string | ((utility: string) => string)][] = [
  [/^typography-/, 'Type style'],
  [/^wds-focus(-visible)?$/, 'Focus ring'],
  [/^outline-offset-/, 'Focus ring offset'],
  [/^outline-(ws-|\[)/, 'Focus ring colour'],
  [/^(drop-)?shadow-/, 'Shadow'],
  [/^bg-(ws-|\[|\(|none|transparent)/, 'Background'],
  [new RegExp(`^text-${LENGTH}`), 'Font size'],
  [new RegExp(`^border(-[xytrbl])?-${LENGTH}`), 'Border width'],
  [/^text-ws-\d+$/, 'Font size'],
  [/^text-(ws-|\[|\()/, 'Text'],
  [/^font-ws-/, 'Font weight'],
  [/^leading-ws-/, 'Line height'],
  [/^tracking-ws-/, 'Letter spacing'],
  [/^border-(ws-|\[|transparent)/, 'Border colour'],
  // Tailwind's own palette and type scale: no token, listed so the popup can say so.
  [PALETTE, (utility) => PALETTE_PROPERTY[utility.split('-')[0]]],
  [/^text-(xs|sm|base|lg|\d?xl)$/, 'Font size'],
  [/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/, 'Font weight'],
  [/^leading-(none|tight|snug|normal|relaxed|loose|\d+)$/, 'Line height'],
  [/^tracking-(tighter|tight|normal|wide|wider|widest)$/, 'Letter spacing'],
  [BORDER_WIDTH, 'Border width'],
  [/^rounded(-[a-z]{1,2})?-/, 'Radius'],
  [/^min-h-/, 'Min height'],
  [/^h-/, 'Height'],
  [/^min-w-/, 'Min width'],
  [/^max-w-/, 'Max width'],
  [/^max-h-/, 'Max height'],
  [/^w-/, 'Width'],
  [/^size-/, 'Size'],
  [/^px-/, 'Padding x'],
  [/^py-/, 'Padding y'],
  [/^p[trbl]-/, (utility) => `Padding ${SIDES[utility[1]]}`],
  [/^p-/, 'Padding'],
  [/^gap-x-/, 'Gap x'],
  [/^gap-y-/, 'Gap y'],
  [/^gap-/, 'Gap'],
];

/** One class, read; `null` for a class that sets nothing the list shows (layout, behaviour). */
export const classify = (cls: string): TokenClass | null => {
  const parts = segments(cls.trim());
  const utility = parts.pop()!.replace(/^!|!$/g, '');
  const match = PROPERTIES.find(([test]) => test.test(utility));
  if (!match) return null;
  const property = typeof match[1] === 'function' ? match[1](utility) : match[1];
  const token = /-ws-|^wds-|^typography-/.test(utility);
  const arbitrary = /\[[^\]]+\]|\(--/.test(utility);
  // A plain class that is not a keyword is Tailwind's own scale (`h-10`), which component code
  // must not use: no token, like an arbitrary value.
  const plain = PALETTE.test(utility) || (!KEYWORD.test(utility) && !BORDER_WIDTH.test(utility));
  return {
    state: stateOf(parts),
    property,
    utility,
    kind: token ? 'token' : arbitrary || plain ? 'raw' : 'keyword',
  };
};

/** The classes of an element that the list shows, in the order they are written. */
export const tokenClasses = (el: Element) =>
  [...el.classList].flatMap((cls) => classify(cls) ?? []);
