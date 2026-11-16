import * as Wideset from '@wideset/react';
import { Popup } from '@wideset/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { PLAYGROUNDS, withPlayground } from '../lib/playground';
import PartTokens from './PartTokens';

/** A part: its named export (`TabsLabel`) and the `data-slot` it renders (`tabs-label`). */
export type AnatomyPart = {
  n: number;
  slot: string;
  exportName: string;
  /** The part as the page writes it (`Button.Icon`), and what it renders. */
  part: string;
  element?: string;
};

/** A rect in the drawing's own space: unscaled CSS pixels from its top left corner. */
type Rect = { left: number; top: number; width: number; height: number };
/** A part as the drawing renders it, measured once, in the drawing's own space. */
type Measured = {
  n: number;
  label: string;
  /** The label's width as the frame draws it. */
  width: number;
  rect: Rect;
  /** The part's corners, as a `border-radius`: the wash around it is cut to them. */
  radius: string;
  /** The middle of the part's first line, from the drawing's top. */
  anchor: number;
  /** Where the part comes in the rendered component, and how many parts it sits inside. */
  order: number;
  depth: number;
  /** The part's element in the drawing: its classes are the tokens the popup lists. */
  el: Element;
};
/** The drawing measured: its parts in the order they render, and its own size. */
type Drawing = { parts: Measured[]; width: number; height: number };
type Side = 'left' | 'right' | 'above';
/**
 * A part with its name placed: `x` is the name's right end on the left, its left end on the
 * right, its centre in the row above; `y` is its middle.
 */
type Mark = Measured & { side: Side; x: number; y: number };
type Layout = { marks: Mark[]; zoom: number; left: number; top: number; height: number };

/**
 * A drawing on one line (a button, a chip, tabs: at most LINE tall) is a control whose parts
 * sit side by side, so their names go in a row above it; anything taller is named in columns
 * beside it. Every drawing is the component at its real size, 1:1, scaled down only when the
 * frame cannot hold it next to its names.
 */
const LINE = 48;
/** A label's height, which is also the step between stacked labels. */
const LABEL = 22;
/** The gap between the names and the drawing, and the frame's margin around the picture. */
const GAP = 24;
const MARGIN = 16;
/** The frame's height when the picture fits (17rem), and the room above and below it. */
const MIN_HEIGHT = 320;
const GUTTER_Y = 32;

/** A label's box, the same at rest and as a badge on hover, so a label never shifts. */
const LABEL_BOX =
  'rounded-ws-control-sm px-ws-4 py-[0.1875rem] typography-caption-md whitespace-nowrap';

/** Each label's width as the frame draws it: a hidden probe with the labels' own classes. */
const widthsOf = (frame: HTMLElement, labels: string[]) => {
  const probe = document.createElement('span');
  probe.className = `${LABEL_BOX} invisible absolute`;
  frame.append(probe);
  const widths = new Map(
    labels.map((label) => {
      probe.textContent = label;
      return [label, probe.offsetWidth] as const;
    }),
  );
  probe.remove();
  return widths;
};

/** `ButtonIcon` → `button-icon`, the library's `data-slot` convention. */
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * The slots a part can be found by: its own, then the slot of any other export that is the
 * very same component (`IconButtonIcon` is `ButtonIcon`, so it renders `button-icon`). Read
 * from the package's exports, never from React's internals.
 */
const slotsOf = ({ slot, exportName }: AnatomyPart) => {
  const exports = Wideset as Record<string, unknown>;
  const component = exports[exportName];
  const aliases = component
    ? Object.keys(exports).filter((name) => name !== exportName && exports[name] === component)
    : [];
  return [slot, ...aliases.map(kebab)];
};

/** The label a part goes by in the picture: `CardHeader` → `Header`, the root by its own name. */
const labelsOf = (parts: AnatomyPart[], root: string) =>
  new Map(
    parts.map(({ n, exportName }) => [
      n,
      exportName !== root && exportName.startsWith(root)
        ? exportName.slice(root.length)
        : exportName,
    ]),
  );

const CORNERS = [
  ['borderTopLeftRadius', 'left', 'top'],
  ['borderTopRightRadius', 'right', 'top'],
  ['borderBottomRightRadius', 'right', 'bottom'],
  ['borderBottomLeftRadius', 'left', 'bottom'],
] as const;

/**
 * A part's corners as the eye sees them: its own radius, a rounded ancestor's where their
 * corners meet (a card's media in its top corners), or the only child's that fills it (an
 * action around its badge). In CSS pixels, the drawing's own unit.
 */
const radiusOf = (el: Element, rect: Rect) => {
  const r = el.getBoundingClientRect();
  return CORNERS.map(([property, x, y]) => {
    let corner = 0;
    const meet = (node: Element) => {
      const a = node.getBoundingClientRect();
      if (Math.abs(a[x] - r[x]) > 1 || Math.abs(a[y] - r[y]) > 1) return;
      corner = Math.max(corner, parseFloat(getComputedStyle(node)[property]) || 0);
    };
    for (let node: Element | null = el; node?.parentElement; node = node.parentElement) meet(node);
    for (let node = el.firstElementChild; node; node = node.firstElementChild) {
      if (node.parentElement!.childElementCount !== 1) break;
      meet(node);
    }
    return `${Math.min(corner, rect.width / 2, rect.height / 2)}px`;
  }).join(' ');
};

/**
 * Find and measure every part in the drawing, once, in its own unscaled space, so placing the
 * labels is plain arithmetic for any frame width. Parts are found by `data-slot` (the
 * library's convention, as in shadcn); one portalled out of the drawing is not this picture's.
 */
const measure = (
  frame: HTMLElement,
  drawing: HTMLElement,
  parts: AnatomyPart[],
  root: string,
): Drawing => {
  const area = drawing.getBoundingClientRect();
  const scale = drawing.offsetWidth ? area.width / drawing.offsetWidth : 1;
  const labels = labelsOf(parts, root);
  const widths = widthsOf(frame, [...labels.values()]);
  const found = parts.flatMap(({ n, ...part }) => {
    const el = slotsOf({ n, ...part })
      .map((slot) => drawing.querySelector(`[data-slot="${slot}"]`))
      .find(Boolean);
    if (!el) return [];
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return [];
    if (r.right < area.left || r.left > area.right || r.bottom < area.top || r.top > area.bottom)
      return [];
    const rect = {
      left: (r.left - area.left) / scale,
      top: (r.top - area.top) / scale,
      width: r.width / scale,
      height: r.height / scale,
    };
    // Aim at the middle of the part's first line: a single line's middle, a paragraph's first
    // line rather than the gap between its lines, a container's top padding above its contents.
    const line = parseFloat(getComputedStyle(el).lineHeight) || rect.height;
    const label = labels.get(n)!;
    const anchor = rect.top + Math.min(rect.height, line) / 2;
    return [{ n, label, width: widths.get(label)!, rect, radius: radiusOf(el, rect), anchor, el }];
  });
  // In the order the component is built: a parent before its first child, though they start level.
  found.sort((a, b) =>
    a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  return {
    parts: found.map(({ el, ...part }, order) => ({
      ...part,
      el,
      order,
      depth: found.filter((other) => other.el !== el && other.el.contains(el)).length,
    })),
    width: drawing.offsetWidth,
    height: drawing.offsetHeight,
  };
};

/**
 * Where the drawing and each name go in a frame `frameWidth` wide. The root is named on the
 * left; on a one-line drawing every other part is named in a row above, over its part; on a
 * taller one a part is named on the left, or on the right when it sits in the drawing's right
 * third. In a column, names keep the order the component is built in, each level with its
 * part's first line or pushed down just enough not to touch the one above; a name pushed past
 * its part moves to the row above when its part starts at the top, else to the right column.
 * The drawing stays centred unless its names need the room.
 */
const arrange = ({ parts, width, height }: Drawing, frameWidth: number): Layout => {
  const oneLine = height <= LINE;
  const root = parts.find((part) => part.depth === 0 && part.order === 0)?.n;
  const sides = new Map<number, Side>(
    parts.map((part) => [
      part.n,
      part.n === root
        ? 'left'
        : oneLine
          ? 'above'
          : part.rect.left + part.rect.width / 2 > (width * 2) / 3
            ? 'right'
            : 'left',
    ]),
  );

  const place = () => {
    const room = (side: Side) => {
      const widest = Math.max(
        0,
        ...parts.filter((p) => sides.get(p.n) === side).map((p) => p.width),
      );
      return widest && widest + GAP;
    };
    const fit = (frameWidth - MARGIN * 2 - room('left') - room('right')) / width;
    const zoom = Math.max(0.2, Math.min(1, fit));
    // Each column, top to bottom, from the drawing's top.
    const ys = new Map<number, number>();
    for (const side of ['left', 'right'] as const) {
      let next = -Infinity;
      for (const part of parts) {
        if (sides.get(part.n) !== side) continue;
        const y = Math.max(part.anchor * zoom, next);
        ys.set(part.n, y);
        next = y + LABEL;
      }
    }
    return { zoom, room, ys };
  };

  let { zoom, room, ys } = place();
  // A name pushed off its part is no longer level with it: move it where it can be, until none
  // is (a move changes the zoom, which can push another). The right column can be as crowded
  // (a header's close button): a move there that lands the name further off its part, or
  // pushes a name already there off its own, is undone, and the name stays on the left.
  const off = (part: Measured) => ys.get(part.n)! - part.anchor * zoom;
  const pushed = (part: Measured) => ys.get(part.n)! > (part.rect.top + part.rect.height) * zoom;
  const kept = new Set<number>();
  for (let pass = 0; pass < 3; pass++) {
    const moved = parts.filter(
      (part) =>
        part.n !== root && !kept.has(part.n) && sides.get(part.n) === 'left' && pushed(part),
    );
    if (!moved.length) break;
    const before = new Map(moved.map((part) => [part.n, off(part)]));
    const level = parts.filter((part) => sides.get(part.n) === 'right' && !pushed(part));
    for (const part of moved) sides.set(part.n, part.rect.top * zoom < LABEL ? 'above' : 'right');
    ({ zoom, room, ys } = place());
    const crowded = level.some(pushed);
    const back = moved.filter(
      (part) => sides.get(part.n) === 'right' && (crowded || off(part) > before.get(part.n)!),
    );
    if (!back.length) continue;
    for (const part of back) {
      sides.set(part.n, 'left');
      kept.add(part.n);
    }
    ({ zoom, room, ys } = place());
  }

  const rowed = parts.filter((part) => sides.get(part.n) === 'above');
  const row = rowed.length ? LABEL + 12 : 0;
  const lowest = Math.max(height * zoom, ...[...ys.values()].map((y) => y + LABEL / 2));
  const frameHeight = Math.max(MIN_HEIGHT, row + lowest + GUTTER_Y * 2);
  const top = row + GUTTER_Y + (frameHeight - row - lowest - GUTTER_Y * 2) / 2;
  const centred = (frameWidth - width * zoom) / 2;
  const left = Math.min(
    Math.max(centred, MARGIN + room('left')),
    frameWidth - MARGIN - room('right') - width * zoom,
  );

  // The row above: each name over its part, nudged right off its neighbour, then back inside.
  // Names go in the order of their parts' centres, not left edges: an icon at an item's start
  // keeps its name, and the item's wider span takes the nudge.
  const centre = (part: (typeof rowed)[number]) => part.rect.left + part.rect.width / 2;
  const xs = new Map<number, number>();
  let end = -Infinity;
  for (const part of [...rowed].sort((a, b) => centre(a) - centre(b))) {
    const x = Math.max(left + centre(part) * zoom, end + 8 + part.width / 2);
    xs.set(part.n, x);
    end = x + part.width / 2;
  }
  const overshoot = Math.max(0, end - (frameWidth - MARGIN));
  for (const [n, x] of xs) xs.set(n, x - overshoot);

  const marks = parts.map((part): Mark => {
    const side = sides.get(part.n)!;
    if (side === 'above') return { ...part, side, x: xs.get(part.n)!, y: top - 12 - LABEL / 2 };
    const x = side === 'left' ? left - GAP : left + width * zoom + GAP;
    return { ...part, side, x, y: top + ys.get(part.n)! };
  });
  return { marks, zoom, left, top, height: frameHeight };
};

/** The table's part column as a tree: each row indented by its depth (`--anatomy-depth`). */
const indent = (rows: { row: HTMLElement; depth: number }[]) =>
  rows.forEach(({ row, depth }) => row.style.setProperty('--anatomy-depth', String(depth)));

const TRANSLATE: Record<Side, string> = {
  left: 'translate(-100%, -50%)',
  right: 'translate(0, -50%)',
  above: 'translate(-50%, -50%)',
};

/**
 * The Anatomy picture: the component at its real size with each part named beside it, level
 * with it. Hovering a name, or its row in the table below, turns the name into a badge and
 * outlines the part and opens a popup with the tokens the part binds, read from its classes
 * (also on keyboard focus of a name, and on a tap). Parts are found by their `data-slot`, so the
 * picture follows the component's real DOM rather than a drawing of it.
 */
const AnatomyDiagram = ({
  component,
  root,
  parts,
}: {
  component: string;
  /** The component's own export (`Card`): its parts are named by member (`Header`). */
  root: string;
  parts: AnatomyPart[];
}) => {
  const definition = PLAYGROUNDS[component];
  const frame = useRef<HTMLDivElement>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [drawn, setDrawn] = useState<Drawing | null>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  /** The part last highlighted: the scrim fades out around it instead of jumping away. */
  const [shown, setShown] = useState<number | null>(null);
  useEffect(() => setMounted(true), []);

  // Measure the drawing when it renders or changes size (fonts, a narrower frame rewrapping
  // it); follow the frame's width. A transform changes neither, so this never loops.
  useLayoutEffect(() => {
    if (!mounted || !frame.current || !drawing.current) return;
    const el = frame.current;
    const content = drawing.current;
    const read = () => setDrawn(measure(el, content, parts, root));
    const follow = () => setFrameWidth(el.clientWidth);
    follow();
    read();
    document.fonts?.ready.then(read);
    const contentObserver = new ResizeObserver(read);
    const frameObserver = new ResizeObserver(follow);
    contentObserver.observe(content);
    frameObserver.observe(el);
    return () => {
      contentObserver.disconnect();
      frameObserver.disconnect();
    };
  }, [mounted, parts, root]);

  const view = useMemo(
    () => (drawn?.parts.length && frameWidth ? arrange(drawn, frameWidth) : null),
    [drawn, frameWidth],
  );

  // Leaving a name waits a beat: moving straight onto the next one cuts the spotlight across
  // without fading it out and in again.
  const leaving = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(leaving.current), []);
  const highlight = (n: number | null) => {
    window.clearTimeout(leaving.current);
    if (n === null) {
      // Long enough to cross from a part to its popup.
      leaving.current = window.setTimeout(() => setActive(null), 160);
      return;
    }
    setShown(n);
    setActive(n);
  };

  // The table under the picture: a part the picture cannot draw says so in its row; hovering a
  // row highlights its part, as hovering a name does.
  useEffect(() => {
    if (!drawn) return;
    const pictured = new Set(drawn.parts.map((part) => part.n));
    // Rows follow the component like a file tree: in rendered order, nested parts indented.
    // A root with nothing to draw (a provider) still heads the tree; other parts the picture
    // cannot draw go last.
    const rowOf = (n: number) =>
      document.querySelector<HTMLElement>(
        `[data-anatomy-row="${parts.find((part) => part.n === n)?.slot}"]`,
      );
    const head = (parts.find((part) => part.exportName === root) ?? parts[0])?.n;
    const under = head !== undefined && !pictured.has(head) ? 1 : 0;
    const tree = [
      ...(under ? [{ n: head, depth: 0 }] : []),
      ...drawn.parts.map(({ n, depth }) => ({ n, depth: depth + under })),
      ...parts.filter(({ n }) => n !== head && !pictured.has(n)).map(({ n }) => ({ n, depth: 1 })),
    ].flatMap(({ n, depth }) => {
      const row = rowOf(n);
      return row ? [{ row, depth }] : [];
    });
    tree.forEach(({ row }) => row.parentElement?.append(row));
    indent(tree);
    const cleanups = parts.map(({ n }) => {
      const row = rowOf(n);
      if (!row) return () => {};
      row
        .querySelector<HTMLElement>('[data-anatomy-absent]')
        ?.toggleAttribute('hidden', pictured.has(n));
      if (!pictured.has(n)) return () => {};
      const enter = () => highlight(n);
      const leave = () => highlight(null);
      row.addEventListener('pointerenter', enter);
      row.addEventListener('pointerleave', leave);
      return () => {
        row.removeEventListener('pointerenter', enter);
        row.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [drawn, parts, root]);

  // The active part's row lights up too, whichever side the hover started on.
  useEffect(() => {
    parts.forEach(({ n, slot }) =>
      document
        .querySelector(`[data-anatomy-row="${slot}"]`)
        ?.toggleAttribute('data-anatomy-active', active === n),
    );
  }, [active, parts]);

  if (!definition) return null;
  // Mounted from the start (on the first part, unseen), so the first hover fades it in.
  const focus = drawn?.parts.find((part) => part.n === shown) ?? drawn?.parts[0];
  const on = active !== null;
  const info = parts.find((part) => part.n === shown);
  /** The part in view holds every other drawn part (the root): then nothing fades. */
  const whole =
    !focus ||
    (drawn?.parts ?? []).every(
      (part) =>
        part.rect.left >= focus.rect.left - 1 &&
        part.rect.top >= focus.rect.top - 1 &&
        part.rect.left + part.rect.width <= focus.rect.left + focus.rect.width + 1 &&
        part.rect.top + part.rect.height <= focus.rect.top + focus.rect.height + 1,
    );
  const fading = on && !whole;
  // Room for the popup (300px and its gap) beside the drawing, in the window.
  const beside = (() => {
    const el = frame.current;
    if (!el || !view || !drawn) return true;
    const left = el.getBoundingClientRect().left + view.left;
    const right = left + drawn.width * view.zoom;
    return Math.max(left, document.documentElement.clientWidth - right) >= 316;
  })();
  /** A mouse hovers; a finger taps to open and taps again to close. */
  const hover = (n: number) => ({
    onPointerEnter: (event: React.PointerEvent) => event.pointerType === 'mouse' && highlight(n),
    onPointerLeave: (event: React.PointerEvent) => event.pointerType === 'mouse' && highlight(null),
    onPointerDown: (event: React.PointerEvent) =>
      event.pointerType !== 'mouse' && highlight(active === n ? null : n),
  });
  /** A part's box in the frame: the drawing's rect, moved and scaled as the drawing is. */
  const boxOf = (rect: Rect) =>
    view && {
      left: view.left + rect.left * view.zoom,
      top: view.top + rect.top * view.zoom,
      width: rect.width * view.zoom,
      height: rect.height * view.zoom,
    };

  return (
    <div
      ref={frame}
      className="docs-frame relative overflow-hidden rounded-ws-container-lg border border-ws-static-base"
      style={{ height: view?.height ?? MIN_HEIGHT }}
    >
      {mounted && (
        <div
          ref={drawing}
          inert
          className="absolute top-0 left-0 w-max origin-top-left"
          style={{
            // Wraps where the frame would, whatever the scale: its size never depends on where
            // it is drawn.
            maxWidth: frameWidth ? frameWidth - MARGIN * 2 : undefined,
            transform: view
              ? `translate(${view.left}px, ${view.top}px) scale(${view.zoom})`
              : undefined,
            visibility: view ? undefined : 'hidden',
          }}
        >
          {(definition.anatomy || undefined)?.() ??
            definition.preview?.() ??
            definition.render(definition.defaults)}
          {/* The part under the pointer stays as it is and everything else in the drawing fades
              to about 38%: a box the part's exact shape whose shadow is a wash of the stage's
              own fill (the soft fill over the page's ground) at 62%, so the stage itself does
              not change. Drawn inside the drawing so it shares the part's scale and pixel
              edges. Nothing fades for a part that holds all the others (the root). */}
          {focus && (
            <div
              className="pointer-events-none absolute z-[100] transition-opacity duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out) motion-reduce:transition-none"
              style={{
                ...focus.rect,
                borderRadius: focus.radius,
                boxShadow:
                  '0 0 0 100vmax color-mix(in srgb, var(--background-color-ws-static-alpha-subtle) 62%, transparent), 0 0 0 100vmax color-mix(in srgb, var(--background-color-ws-static-foreground) 62%, transparent)',
                opacity: fading ? 1 : 0,
              }}
            />
          )}
        </div>
      )}
      {view?.marks.map(({ n, label, side, x, y }) => (
        <span
          key={n}
          role="button"
          tabIndex={0}
          aria-label={`${parts.find((part) => part.n === n)?.part ?? label}: tokens`}
          onFocus={() => highlight(n)}
          // Focus moving into the popup (a click on one of its rows) keeps it open.
          onBlur={(event) =>
            !event.relatedTarget?.closest('[data-anatomy-tokens]') && highlight(null)
          }
          {...hover(n)}
          className={`${LABEL_BOX} absolute cursor-default outline-ws-dynamic-primary-strong-default transition-[color,background-color,opacity,font-weight] ease-out focus-visible:wds-focus-visible motion-reduce:transition-opacity ${active === n ? 'bg-ws-static-foreground text-ws-static-strong duration-[80ms]' : 'text-ws-static-subtle duration-[60ms]'}`}
          style={{
            left: x,
            top: y,
            transform: TRANSLATE[side],
            opacity: fading && active !== n ? 0.4 : 1,
            // Hover lifts the weight a step, the same move as the badge, not a new one.
            fontWeight: active === n ? 'var(--font-weight-ws-medium)' : undefined,
          }}
        >
          {label}
        </span>
      ))}
      {/* Each part's own area answers the pointer too; a part inside another lies over it. */}
      {view &&
        [...(drawn?.parts ?? [])]
          .sort((a, b) => a.depth - b.depth)
          .map((part) => (
            <div
              key={part.n}
              className="absolute"
              style={boxOf(part.rect) ?? undefined}
              {...hover(part.n)}
            />
          ))}
      {/* The tokens of the part under the pointer, beside the component: to its right, or its
          left when the window has no room there, level with the part's top; under it only when
          neither side has room. It stays open while the pointer is on it, so a class can be
          copied; Escape or a click elsewhere closes it. */}
      <Popup open={on && Boolean(info)} onOpenChange={(next) => !next && setActive(null)}>
        <Popup.Trigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute"
            // As wide as the whole drawing, so the popup never lies on the component; as tall
            // as the part (beside it) or as the drawing (under it).
            style={
              (focus &&
                drawn &&
                boxOf(
                  beside
                    ? { ...focus.rect, left: 0, width: drawn.width }
                    : { left: 0, top: 0, width: drawn.width, height: drawn.height },
                )) ??
              undefined
            }
          />
        </Popup.Trigger>
        <Popup.Container
          side={beside ? 'right' : 'bottom'}
          align="start"
          sideOffset={8}
          aria-label={info ? `${info.part}: tokens` : undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onPointerEnter={() => window.clearTimeout(leaving.current)}
          onPointerLeave={(event) => event.pointerType === 'mouse' && highlight(null)}
          onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && highlight(null)}
          data-anatomy-tokens
          // The library's own surface; only its fixed width gives way to the content's.
          className="w-auto"
        >
          {info && focus && <PartTokens part={info.part} element={info.element} el={focus.el} />}
        </Popup.Container>
      </Popup>
    </div>
  );
};

export default withPlayground(AnatomyDiagram);
