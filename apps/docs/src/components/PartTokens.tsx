import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { type TokenClass, tokenClasses } from '../lib/tokenClasses';

/** The most telling first: colour, radius, size, padding, type; the rest after. */
const ORDER = [
  'Background',
  'Text',
  'Border colour',
  'Shadow',
  'Radius',
  'Height',
  'Width',
  'Size',
  'Min height',
  'Max height',
  'Min width',
  'Max width',
  'Padding',
  'Padding x',
  'Padding y',
  'Padding top',
  'Padding right',
  'Padding bottom',
  'Padding left',
  'Gap',
  'Gap x',
  'Gap y',
  'Type style',
  'Font size',
  'Font weight',
  'Line height',
  'Letter spacing',
  'Border width',
];
const rank = (row: TokenClass) =>
  ORDER.indexOf(row.property) < 0 ? ORDER.length : ORDER.indexOf(row.property);
/** How many rows show before "+N more". */
const SHOWN = 8;

/** The side a border utility sets (`border-b` → bottom); `x` reads its left, `y` and all their top. */
const SIDE: Record<string, string> = { r: 'right', b: 'bottom', l: 'left', x: 'left' };
const borderSide = (utility: string) =>
  SIDE[utility.match(/^border-([xytrbl])\b/)?.[1] ?? ''] ?? 'top';

/** How a property reads off the part's own computed style (and, for a border, its utility). */
const READ: Record<string, (style: CSSStyleDeclaration, utility: string) => string> = {
  Background: (s) => (s.backgroundImage !== 'none' ? s.backgroundImage : s.backgroundColor),
  Text: (s) => s.color,
  'Border colour': (s) => s.borderTopColor,
  'Border width': (s, utility) => s.getPropertyValue(`border-${borderSide(utility)}-width`),
  Shadow: (s) => shadow(s.boxShadow),
  Radius: (s) => s.borderTopLeftRadius,
  Height: (s) => s.height,
  'Min height': (s) => s.minHeight,
  'Max height': (s) => s.maxHeight,
  Width: (s) => s.width,
  'Min width': (s) => s.minWidth,
  'Max width': (s) => s.maxWidth,
  Size: (s) => `${s.width} × ${s.height}`,
  Padding: (s) => s.paddingTop,
  'Padding x': (s) => s.paddingLeft,
  'Padding y': (s) => s.paddingTop,
  'Padding top': (s) => s.paddingTop,
  'Padding right': (s) => s.paddingRight,
  'Padding bottom': (s) => s.paddingBottom,
  'Padding left': (s) => s.paddingLeft,
  Gap: (s) => s.columnGap,
  'Gap x': (s) => s.columnGap,
  'Gap y': (s) => s.rowGap,
  'Type style': (s) =>
    `${parseFloat(s.fontSize)}/${parseFloat(s.lineHeight) || s.lineHeight} · ${s.fontWeight}`,
  'Font size': (s) => s.fontSize,
  'Font weight': (s) => s.fontWeight,
  'Line height': (s) => s.lineHeight,
  'Letter spacing': (s) => s.letterSpacing,
  'Focus ring colour': (s) => s.outlineColor,
  'Focus ring offset': (s) => s.outlineOffset,
};
const COLOURS = new Set(['Background', 'Text', 'Border colour', 'Focus ring colour']);

/** `rgb(…)` / `rgba(…)` as `#rrggbb` plus its opacity; anything else as the browser gives it. */
const hex = (value: string) => {
  const match = value.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
  if (!match) return value;
  const [, r, g, b, a] = match;
  const code = `#${[r, g, b].map((n) => Math.round(Number(n)).toString(16).padStart(2, '0')).join('')}`;
  const alpha = a === undefined ? 1 : Number(a);
  if (alpha === 0) return 'transparent';
  return alpha < 1 ? `${code} · ${Math.round(alpha * 100)}%` : code;
};

/** A shadow's visible layers only (Tailwind pads it with empty ones). */
const shadow = (value: string) => {
  if (value === 'none') return 'none';
  const layers = value
    .split(/,(?![^(]*\))/)
    .map((layer) => layer.trim())
    .filter((layer) => !/rgba\([^)]*,\s*0\)/.test(layer));
  return (
    layers
      .map((layer) => {
        const colour = layer.match(/rgba?\([^)]*\)/)?.[0] ?? '';
        const lengths = layer
          .replace(colour, '')
          .trim()
          .replace(/(^|\s)0px\b/g, '$10');
        return `${lengths} ${hex(colour)}`.trim();
      })
      .join(', ') || 'none'
  );
};

/**
 * The element whose classes style the part: the part itself, or, when it carries none the list
 * shows (a wrapper), its first child that does.
 */
const styledBy = (el: Element) => {
  const own = tokenClasses(el);
  if (own.length) return { el, classes: own };
  for (const child of el.children) {
    const inner = tokenClasses(child);
    if (inner.length) return { el: child, classes: inner };
  }
  return { el, classes: own };
};

type Value = { text: string; colour?: string };

/**
 * What a part's popup lists, read from the part as it is rendered in the picture: its name and
 * element, then one line per class that sets a visual property: the property, the class, and
 * the value from the part's own computed style, so it is the current theme's. A click copies
 * the class. A value with no token says so; layout classes are left out. Eight lines at most,
 * the most telling first; "+N more" opens the rest, and the classes that apply only in a state
 * (hover, disabled, open…), which have no value here: the part is not in that state.
 */
const PartTokens = ({ part, element, el }: { part: string; element?: string; el: Element }) => {
  const source = useMemo(() => styledBy(el), [el]);
  const rows = useMemo(
    () => source.classes.filter((row) => row.state === 'Default').sort((a, b) => rank(a) - rank(b)),
    [source],
  );
  const states = useMemo(() => source.classes.filter((row) => row.state !== 'Default'), [source]);
  const hidden = Math.max(rows.length - SHOWN, 0) + states.length;
  const [all, setAll] = useState(false);
  // Another part: folded again, unless it has nothing but states to show.
  useEffect(() => setAll(rows.length === 0 && states.length > 0), [rows, states]);
  const listed = all ? [...rows, ...states] : rows.slice(0, SHOWN);

  // Read again when the theme flips.
  const [theme, setTheme] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme((n) => n + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const [values, setValues] = useState<Record<string, Value>>({});
  useLayoutEffect(() => {
    const style = getComputedStyle(source.el);
    const next: Record<string, Value> = {};
    for (const { property, utility } of rows) {
      const raw = READ[property]?.(style, utility);
      if (raw === undefined) continue;
      next[utility] = COLOURS.has(property)
        ? { text: hex(raw), colour: raw }
        : { text: raw.replace(/(\d+\.\d{2})\d+px/g, '$1px') };
    }
    setValues(next);
  }, [source, rows, theme]);

  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (utility: string) => {
    try {
      await navigator.clipboard.writeText(utility);
      setCopied(utility);
      setTimeout(() => setCopied((was) => (was === utility ? null : was)), 1200);
    } catch {
      // clipboard unavailable
    }
  };
  const quiet = 'typography-caption-md text-ws-static-subtle';
  return (
    <div className="flex max-h-[22rem] w-max max-w-[18.75rem] min-w-[15rem] flex-col gap-ws-4 overflow-y-auto px-ws-7 py-ws-6">
      <div className="flex items-baseline justify-between gap-ws-7">
        <span className="typography-label-strong-sm text-ws-static-strong">{part}</span>
        {element && (
          <span className="truncate typography-label-sm text-ws-static-subtle">{element}</span>
        )}
      </div>
      {source.classes.length === 0 ? (
        <p className={quiet}>No design tokens on this part.</p>
      ) : (
        <div>
          {listed.map((row) => {
            const state = row.state !== 'Default';
            const value = state ? undefined : values[row.utility];
            return (
              <button
                key={`${row.state} ${row.utility}`}
                type="button"
                onClick={() => copy(row.utility)}
                title={state ? `${row.property}, ${row.state}: ${row.utility}` : row.utility}
                className="-mx-ws-3 grid h-ws-12 w-[calc(100%+0.5rem)] grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-x-ws-5 rounded-ws-control-sm px-ws-3 text-left outline-ws-dynamic-primary-strong-default transition-colors hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible"
              >
                <span className={`truncate ${quiet}`}>{state ? row.state : row.property}</span>
                <span className="flex min-w-0 items-center gap-ws-3">
                  <span className="truncate font-mono text-ws-300 leading-ws-400 text-ws-static-strong">
                    {copied === row.utility ? 'Copied' : row.utility}
                  </span>
                  {row.kind === 'raw' && (
                    <span
                      className={`shrink-0 rounded-ws-control-sm bg-ws-static-alpha-base px-ws-2 ${quiet}`}
                    >
                      no token
                    </span>
                  )}
                </span>
                <span
                  className={`flex max-w-ws-24 min-w-0 items-center justify-end gap-ws-3 tabular-nums ${quiet}`}
                >
                  {value?.colour && (
                    <span
                      aria-hidden="true"
                      className="size-ws-6 shrink-0 rounded-[0.125rem] border border-ws-static-subtle"
                      style={{ background: value.colour }}
                    />
                  )}
                  <span className="truncate">{value?.text}</span>
                </span>
              </button>
            );
          })}
          {hidden > 0 && !all && (
            <button
              type="button"
              onClick={() => setAll(true)}
              className={`h-ws-12 rounded-ws-control-sm outline-ws-dynamic-primary-strong-default hover:text-ws-static-strong focus-visible:wds-focus-visible ${quiet}`}
            >
              +{hidden} more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PartTokens;
