import { RiCloseLine, RiExpandDiagonalLine, RiNodeTree } from '@remixicon/react';
import { IconButton, Tabs } from '@wideset/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Graph, Graph as GraphData } from '../lib/catalog';
import { RailPanel } from './railControls';

/**
 * The relationship map in the rail, in the manner of Obsidian's interactive graph. The
 * component you are reading sits in the centre and everything it has a relationship with
 * around it: what it is built from, what is built from it, and what the stories put beside
 * it. At rest it is dots and lines only; names appear as you zoom in, when there is room
 * between the nodes for them, and belong to the node under the pointer at any zoom.
 *
 * Every line is drawn the same way: a line means "these two go together", and its tooltip says
 * how. The wheel zooms around the pointer, the background pans, a double-click resets the
 * view, nodes drag and the layout settles again when let go. Two scopes (this component, or
 * the whole system) and a large view of either in a dialog over the page. The data comes from
 * scripts/gen-graph.mjs.
 */
type GraphEdge = GraphData['edges'][number];

type Mode = 'local' | 'all';

type Body = {
  id: string;
  depth: number;
  degree: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
};

type View = { z: number; tx: number; ty: number };

/** Layouts run in one world 600 units wide, whatever the canvas; the canvas scales to fit. */
const WORLD_W = 600;
const WORLD_PAD = 24;
/** Button touches twenty components; past this many the local map stops being readable. */
const NODE_CAP = 10;
/** Names appear once linked nodes are this far apart on screen. */
const LABEL_SPACING = 64;
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 6;
const DAMPING = 0.8;
const SPRING = 0.045;
/** The canvas is wider than tall, so horizontal distance counts for less and nodes spread sideways. */
const SQUEEZE_X = 0.75;

const PHYSICS: Record<Mode, { rest: number; repulsion: number; gravity: number }> = {
  local: { rest: 140, repulsion: 14000, gravity: 0.01 },
  all: { rest: 56, repulsion: 2200, gravity: 0.006 },
};

const adjacencyOf = (graph: Graph) => {
  const adjacency = new Map<string, Set<string>>();
  const touch = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    adjacency.get(a)!.add(b);
  };
  for (const edge of graph.edges) {
    touch(edge.from, edge.to);
    touch(edge.to, edge.from);
  }
  return adjacency;
};

/**
 * The current component and its direct relations only: one step out is what the reader can
 * hold; two steps out through a hub like Button is everything. When there are more
 * neighbours than fit, the ones with a page come first, then real dependencies, then the
 * best-connected.
 */
const localIds = (graph: Graph, current: string, pages: readonly string[]) => {
  const adjacency = adjacencyOf(graph);
  const degree = (id: string) => adjacency.get(id)?.size ?? 0;
  const dependency = (id: string) =>
    graph.edges.some(
      (edge) =>
        edge.kind === 'uses' &&
        ((edge.from === current && edge.to === id) || (edge.to === current && edge.from === id)),
    );
  const rank = (id: string) => (pages.includes(id) ? 0 : 2) + (dependency(id) ? 0 : 1);
  return [...(adjacency.get(current) ?? [])]
    .sort((a, b) => rank(a) - rank(b) || degree(b) - degree(a) || a.localeCompare(b))
    .slice(0, NODE_CAP - 1);
};

const seed = (bodies: Body[], mode: Mode, world: { w: number; h: number }) => {
  const cx = world.w / 2;
  const cy = world.h / 2;
  const others = bodies.filter((body) => body.depth > 0);
  for (const body of bodies) {
    if (body.depth === 0) {
      body.x = cx;
      body.y = cy;
    }
  }
  if (mode === 'local') {
    others.forEach((body, i) => {
      const angle = (i / others.length) * Math.PI * 2 - Math.PI / 2 + 0.4;
      body.x = cx + Math.cos(angle) * PHYSICS.local.rest * 1.2;
      body.y = cy + Math.sin(angle) * PHYSICS.local.rest * 0.85;
    });
  } else {
    // A sunflower spiral: even, deterministic, and no two nodes start on top of each other.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const radius = Math.min(world.w, world.h) * 0.42;
    others.forEach((body, i) => {
      const r = radius * Math.sqrt((i + 1) / (others.length + 1));
      body.x = cx + Math.cos(i * golden) * r;
      body.y = cy + Math.sin(i * golden) * r * 0.9;
    });
  }
};

/** One step of the layout; returns the largest speed so the loop knows when it has settled. */
const step = (bodies: Body[], edges: GraphEdge[], mode: Mode, world: { w: number; h: number }) => {
  const { rest, repulsion, gravity } = PHYSICS[mode];
  const byId = new Map(bodies.map((body) => [body.id, body]));
  const cx = world.w / 2;
  const cy = world.h / 2;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const dx = (b.x - a.x) * SQUEEZE_X;
      const dy = b.y - a.y;
      const d2 = Math.max(dx * dx + dy * dy, 36);
      const force = repulsion / d2;
      const d = Math.sqrt(d2);
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }
  for (const edge of edges) {
    const a = byId.get(edge.from);
    const b = byId.get(edge.to);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const force = (d - rest) * SPRING;
    const fx = (dx / d) * force;
    const fy = (dy / d) * force;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }
  let fastest = 0;
  for (const body of bodies) {
    const pull = body.depth === 0 ? gravity * 6 : body.degree === 0 ? gravity * 3 : gravity;
    body.vx += (cx - body.x) * pull;
    body.vy += (cy - body.y) * pull;
    if (body.pinned) {
      body.vx = 0;
      body.vy = 0;
      continue;
    }
    body.vx *= DAMPING;
    body.vy *= DAMPING;
    body.x = Math.min(Math.max(body.x + body.vx, WORLD_PAD), world.w - WORLD_PAD);
    body.y = Math.min(Math.max(body.y + body.vy, WORLD_PAD), world.h - WORLD_PAD);
    fastest = Math.max(fastest, Math.abs(body.vx), Math.abs(body.vy));
  }
  return fastest;
};

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type CanvasProps = {
  graph: Graph;
  current: string;
  pages: readonly string[];
  mode: Mode;
  width: number;
  height: number;
};

/** The graph itself: one SVG with a zoomable, pannable world inside it. */
function GraphCanvas({ graph, current, pages, mode, width, height }: CanvasProps) {
  const titles = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node.title])), [graph]);
  const adjacency = useMemo(() => adjacencyOf(graph), [graph]);
  const { ids, edges } = useMemo(() => {
    const chosen =
      mode === 'local'
        ? [current, ...localIds(graph, current, pages)]
        : [current, ...graph.nodes.map((node) => node.id).filter((id) => id !== current)];
    const set = new Set(chosen);
    return {
      ids: chosen,
      edges: graph.edges.filter((edge) => set.has(edge.from) && set.has(edge.to)),
    };
  }, [graph, current, pages, mode]);

  // Keyed on the aspect ratio, not the size: measuring the rail after mount changes the width
  // but not the shape, and must not lay the graph out again.
  const aspect = height / Math.max(width, 1);
  const world = useMemo(() => ({ w: WORLD_W, h: WORLD_W * aspect }), [aspect]);
  const kFit = width / WORLD_W;

  const svgRef = useRef<SVGSVGElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const frameRef = useRef(0);
  const dragged = useRef(false);
  const viewRef = useRef<View>({ z: 1, tx: 0, ty: 0 });
  const [view, setViewState] = useState<View>(viewRef.current);
  const [, setTick] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);

  const setView = (next: View) => {
    viewRef.current = next;
    setViewState(next);
  };

  const run = () => {
    cancelAnimationFrame(frameRef.current);
    const loop = () => {
      const fastest = step(bodiesRef.current, edges, mode, world);
      setTick((tick) => tick + 1);
      if (fastest > 0.03) frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
  };

  const freshBodies = () => {
    const bodies: Body[] = ids.map((id, index) => ({
      id,
      depth: index === 0 ? 0 : 1,
      degree: adjacency.get(id)?.size ?? 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      pinned: false,
    }));
    seed(bodies, mode, world);
    return bodies;
  };
  const settle = (bodies: Body[]) => {
    for (let i = 0; i < 600; i++) if (step(bodies, edges, mode, world) < 0.03) break;
    return bodies;
  };

  // The first layout settles while rendering: the layout is deterministic, so the server sends
  // the finished picture and hydration matches it, instead of the nodes spreading out once the
  // island's JavaScript arrives. Only a later change of scope animates.
  const initialLayout = useRef(true);
  if (initialLayout.current && !bodiesRef.current.length) bodiesRef.current = settle(freshBodies());

  // A new scope or a new component: fresh bodies, fresh view, settle again.
  useEffect(() => {
    if (initialLayout.current) {
      initialLayout.current = false;
      return;
    }
    const bodies = freshBodies();
    bodiesRef.current = bodies;
    setView({ z: 1, tx: 0, ty: 0 });
    if (reducedMotion()) {
      settle(bodies);
      setTick((tick) => tick + 1);
    } else {
      run();
    }
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, edges, mode, world]);

  // Wheel zoom around the pointer. React registers wheel as passive, so this is attached by hand.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const box = svg.getBoundingClientRect();
      const px = event.clientX - box.left;
      const py = event.clientY - box.top;
      const before = viewRef.current;
      const z = clamp(before.z * Math.exp(-event.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX);
      const k0 = kFit * before.z;
      const k1 = kFit * z;
      const wx = (px - before.tx) / k0;
      const wy = (py - before.ty) / k0;
      setView({ z, tx: px - wx * k1, ty: py - wy * k1 });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [kFit]);

  const k = kFit * view.z;
  const toWorld = (clientX: number, clientY: number) => {
    const box = svgRef.current!.getBoundingClientRect();
    const { tx, ty } = viewRef.current;
    return { x: (clientX - box.left - tx) / k, y: (clientY - box.top - ty) / k };
  };

  const startNodeDrag = (body: Body) => (event: React.PointerEvent<Element>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    body.pinned = true;
    dragged.current = false;
    const origin = { x: event.clientX, y: event.clientY };
    const move = (moveEvent: PointerEvent) => {
      if (Math.hypot(moveEvent.clientX - origin.x, moveEvent.clientY - origin.y) > 3) {
        dragged.current = true;
      }
      const point = toWorld(moveEvent.clientX, moveEvent.clientY);
      body.x = clamp(point.x, WORLD_PAD, world.w - WORLD_PAD);
      body.y = clamp(point.y, WORLD_PAD, world.h - WORLD_PAD);
      run();
    };
    const end = () => {
      body.pinned = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      run();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };

  const startPan = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    const origin = { x: event.clientX, y: event.clientY, ...viewRef.current };
    setPanning(true);
    const move = (moveEvent: PointerEvent) => {
      setView({
        z: origin.z,
        tx: origin.tx + moveEvent.clientX - origin.x,
        ty: origin.ty + moveEvent.clientY - origin.y,
      });
    };
    const end = () => {
      setPanning(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };

  const bodies = bodiesRef.current;
  const byId = new Map(bodies.map((body) => [body.id, body]));
  const touches = (edge: GraphEdge) => edge.from === hovered || edge.to === hovered;
  const linked = (id: string) =>
    id === hovered || edges.some((edge) => touches(edge) && (edge.from === id || edge.to === id));
  const fade = 'opacity var(--ws-motion-duration-quick) var(--ws-motion-ease-out)';
  const describe = (edge: GraphEdge) =>
    edge.kind === 'uses'
      ? `${titles.get(edge.from)} contains ${titles.get(edge.to)}`
      : `${titles.get(edge.from)} and ${titles.get(edge.to)} are used together`;
  /** What a node relates to, in the order a reader asks for it. */
  const detail = (id: string) => {
    const inside = graph.edges.filter((edge) => edge.kind === 'uses' && edge.from === id).length;
    const within = graph.edges.filter((edge) => edge.kind === 'uses' && edge.to === id).length;
    const beside = graph.edges.filter(
      (edge) => edge.kind === 'with' && (edge.from === id || edge.to === id),
    ).length;
    const parts = [];
    if (within) parts.push(`inside ${within}`);
    if (inside) parts.push(`contains ${inside}`);
    if (beside) parts.push(`used beside ${beside}`);
    return parts.length ? `${titles.get(id)} — ${parts.join(', ')}` : `${titles.get(id)}`;
  };
  const labelsVisible = PHYSICS[mode].rest * k >= LABEL_SPACING;
  /** Screen radius at fit; nodes grow with the square root of the zoom, so they never balloon. */
  const screenRadius = (body: Body) => {
    if (mode === 'local') return body.depth === 0 ? 9 : 4.5;
    return body.depth === 0 ? 7 : Math.min(2.5 + body.degree * 0.35, 6);
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block touch-none text-ws-static-subtle select-none"
      style={{ cursor: panning ? 'grabbing' : 'grab' }}
      aria-label={`Components related to ${titles.get(current) ?? current}`}
      // A group, not an image: its nodes are links (named by their <title>) a keyboard reaches.
      role="group"
      onPointerDown={startPan}
      onDoubleClick={() => setView({ z: 1, tx: 0, ty: 0 })}
    >
      <g transform={`translate(${view.tx} ${view.ty}) scale(${k})`}>
        <g fill="none">
          {edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const lit = hovered ? touches(edge) : false;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                strokeWidth={lit ? 1.5 : 1}
                vectorEffect="non-scaling-stroke"
                className={lit ? 'text-ws-dynamic-primary-default' : undefined}
                style={{
                  opacity: hovered ? (lit ? 1 : 0.15) : 0.38,
                  transition: fade,
                }}
              >
                <title>{describe(edge)}</title>
              </line>
            );
          })}
        </g>
        {bodies.map((body) => {
          const isCurrent = body.depth === 0;
          const hasPage = pages.includes(body.id) && !isCurrent;
          const isHovered = hovered === body.id;
          const dim = hovered ? !linked(body.id) : false;
          const radius = (screenRadius(body) * Math.sqrt(view.z)) / k;
          const label = titles.get(body.id) ?? body.id;
          const showLabel = isHovered || (labelsVisible && !dim);
          const content = (
            <>
              <circle r={radius} fill="currentColor" />
              {showLabel && (
                <text
                  y={radius + 14 / k}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12 / k}
                  className={
                    isHovered || isCurrent
                      ? 'font-ws-medium text-ws-static-strong'
                      : 'text-ws-static-base'
                  }
                  style={{ pointerEvents: 'none' }}
                >
                  {label}
                </text>
              )}
              <circle r={13 / k} fill="transparent" />
            </>
          );
          const shared = {
            transform: `translate(${body.x} ${body.y})`,
            className: isHovered ? 'text-ws-dynamic-primary-default' : undefined,
            style: {
              opacity: dim ? 0.35 : 1,
              transition: fade,
              cursor: hasPage ? 'pointer' : 'grab',
            },
            onPointerDown: startNodeDrag(body),
            onPointerEnter: () => setHovered(body.id),
            onPointerLeave: () => setHovered(null),
          };
          return hasPage ? (
            <a
              key={body.id}
              href={`/components/${body.id}`}
              onClick={(event) => dragged.current && event.preventDefault()}
              {...shared}
            >
              <title>{`${detail(body.id)} · open its page`}</title>
              {content}
            </a>
          ) : (
            <g key={body.id} {...shared}>
              <title>{detail(body.id)}</title>
              {content}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function RelationshipGraph({
  current,
  graph,
  pages,
}: {
  current: string;
  graph: Graph;
  /** Components that have a page; their nodes are links. */
  pages: readonly string[];
}) {
  const [mode, setMode] = useState<Mode>('local');
  const [fullscreen, setFullscreen] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(272);
  const [stage, setStage] = useState({ w: 1200, h: 800 });
  const title = graph.nodes.find((node) => node.id === current)?.title ?? current;

  useEffect(() => {
    setWidth(hostRef.current?.clientWidth || 272);
  }, []);

  // Fullscreen: measure the stage, follow the window, close on Escape, freeze the page behind.
  useEffect(() => {
    if (!fullscreen) return;
    const measure = () => {
      const el = stageRef.current;
      if (el) setStage({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setFullscreen(false);
    window.addEventListener('resize', measure);
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [fullscreen]);

  const scopeLabel = mode === 'local' ? 'Show the whole system' : `Show only ${title}`;

  return (
    <>
      <RailPanel>
        {/* The panel is a 272px square in Figma: the canvas fills it edge to edge, the scope and
            fullscreen buttons sit in its corner. */}
        <div className="relative -my-ws-7 -mr-ws-7 -ml-ws-9">
          <div ref={hostRef}>
            {!fullscreen && (
              <GraphCanvas
                graph={graph}
                current={current}
                pages={pages}
                mode={mode}
                width={width}
                height={width}
              />
            )}
          </div>
          <div className="absolute top-ws-5 right-ws-5 flex items-center gap-ws-2">
            <IconButton
              size="xs"
              variant="secondary"
              preset="ghost"
              icon={RiNodeTree}
              aria-label={scopeLabel}
              aria-pressed={mode === 'all'}
              title={scopeLabel}
              onClick={() => setMode(mode === 'local' ? 'all' : 'local')}
            />
            <IconButton
              size="xs"
              variant="secondary"
              preset="ghost"
              icon={RiExpandDiagonalLine}
              aria-label="Open large view"
              title="Open large view"
              onClick={() => setFullscreen(true)}
            />
          </div>
        </div>
      </RailPanel>
      {fullscreen &&
        createPortal(
          // Docs chrome: a dialog around the graph; the system's Modal is sized for forms.
          <div
            className="docs-modal-backdrop fixed inset-0 z-[100] grid place-items-center p-ws-18"
            onPointerDown={(event) => event.target === event.currentTarget && setFullscreen(false)}
          >
            <div
              className="docs-modal docs-frame flex h-full max-h-[800px] w-full max-w-[1200px] flex-col overflow-hidden rounded-ws-container-xl border border-ws-static-subtle"
              role="dialog"
              aria-modal="true"
              aria-label="Relationships"
            >
              <header className="flex h-ws-19 shrink-0 items-center gap-ws-11 px-ws-7">
                <Tabs
                  type="ghost"
                  divider={false}
                  value={mode}
                  onValueChange={(id) => setMode(id as Mode)}
                >
                  <Tabs.List aria-label="Scope">
                    <Tabs.Item value="local">
                      <Tabs.Label>{title}</Tabs.Label>
                    </Tabs.Item>
                    <Tabs.Item value="all">
                      <Tabs.Label>Whole system</Tabs.Label>
                    </Tabs.Item>
                  </Tabs.List>
                </Tabs>
                <span className="min-w-0 truncate typography-label-strong-sm text-ws-static-strong">
                  {mode === 'local'
                    ? `What ${title} is used with`
                    : `${graph.nodes.length} components`}
                </span>
                <span className="ml-auto flex">
                  <IconButton
                    size="sm"
                    variant="secondary"
                    preset="ghost"
                    icon={RiCloseLine}
                    aria-label="Close"
                    onClick={() => setFullscreen(false)}
                  />
                </span>
              </header>
              <div ref={stageRef} className="min-h-0 flex-1">
                <GraphCanvas
                  graph={graph}
                  current={current}
                  pages={pages}
                  mode={mode}
                  width={stage.w}
                  height={stage.h}
                />
              </div>
              <p className="shrink-0 px-ws-12 pb-ws-9 typography-body-sm text-ws-static-subtle">
                A line means the two components go together. Hover one to read how: contained,
                containing, or simply used side by side.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
