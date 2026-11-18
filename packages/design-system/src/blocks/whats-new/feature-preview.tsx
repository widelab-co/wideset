// TODO(custom): a drawn sketch of a feature's UI for release notes; Wideset has no preview, and blocks ship no images.
import { cn } from '@wideset/react';

const SHEET = 'fill-(--ws-static-fill-foreground) stroke-(--ws-static-stroke-subtle)';
const SURFACE = 'fill-(--ws-static-fill-overlay) stroke-(--ws-static-stroke-base)';
const FIELD = 'fill-none stroke-(--ws-static-stroke-base)';
const TEXT = 'fill-(--ws-static-fill-alpha-strong)';
const QUIET = 'fill-(--ws-static-fill-alpha-base)';
const RULE = 'stroke-(--ws-static-stroke-subtle)';

/** The table's rows behind the popover: a name, a stage, an amount on the right. */
const TABLE_ROWS = [100, 124, 148, 172, 196];
/** The popover's conditions: where each box starts and how long the words in it are. */
const CONDITIONS = [
  { y: 82, words: [26, 30, 40] },
  { y: 106, words: [34, 38, 30] },
  { y: 130, words: [30, 26, 46] },
];

/** A small rounded box with a line of words in it: a field, a button, a select. */
function Box({
  x,
  y,
  width,
  words,
  className,
}: Record<'x' | 'y' | 'width' | 'words', number> & {
  className?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={16} rx={4} className={cn(FIELD, className)} />
      <rect x={x + 6} y={y + 6} width={words} height={4} rx={2} className={TEXT} />
    </g>
  );
}

/** An ×, the remove mark on a chip or a condition. */
function Cross({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 2.5} ${y - 2.5}l5 5m0-5l-5 5`}
      strokeWidth={1.25}
      strokeLinecap="round"
      className="stroke-(--ws-static-stroke-strong)"
    />
  );
}

/**
 * The deals list with its filter open, drawn in a few neutral marks: the toolbar with Filter and
 * Sort at its end, the applied conditions as chips, the table, and the popover's three rows of
 * field, test and value over it. One grey family and the surfaces' own colours, so it sits in the
 * modal like a screenshot would, without being one, and turns with the theme. Decorative: the
 * title and lines beside it say what it shows.
 */
export function FeaturePreview({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('bg-ws-static-alpha-subtle rounded-ws-container-md overflow-hidden', className)}
    >
      <svg viewBox="0 0 552 200" className="block h-auto w-full">
        {/* The page, running off the bottom edge. */}
        <rect x={32} y={28} width={488} height={200} rx={8} className={SHEET} />

        {/* Toolbar: search on the left, Filter (the feature, a stronger line) and Sort right. */}
        <Box x={48} y={44} width={140} words={60} />
        <Box x={404} y={44} width={52} words={26} className="stroke-(--ws-static-stroke-strong)" />
        <Box x={462} y={44} width={42} words={22} />

        {/* The conditions applied, as chips. */}
        {[
          { x: 48, width: 92 },
          { x: 146, width: 82 },
        ].map(({ x, width }) => (
          <g key={x}>
            <rect x={x} y={70} width={width} height={16} rx={8} className={QUIET} />
            <rect x={x + 8} y={76} width={width - 30} height={4} rx={2} className={TEXT} />
            <Cross x={x + width - 11} y={78} />
          </g>
        ))}

        {/* The table. */}
        {TABLE_ROWS.map((y) => (
          <g key={y}>
            <line x1={48} x2={504} y1={y - 8} y2={y - 8} className={RULE} />
            <rect x={48} y={y} width={88} height={5} rx={2.5} className={TEXT} />
            <rect x={168} y={y} width={44} height={5} rx={2.5} className={QUIET} />
            <rect x={460} y={y} width={44} height={5} rx={2.5} className={QUIET} />
          </g>
        ))}

        {/* The popover under Filter, lined up with its end. */}
        <rect x={240} y={68} width={264} height={116} rx={8} className={SURFACE} />
        {CONDITIONS.map(({ y, words: [field, test, value] }, row) => (
          <g key={y}>
            <rect x={252} y={y + 6} width={row ? 16 : 24} height={4} rx={2} className={QUIET} />
            <Box x={282} y={y} width={56} words={field} />
            <Box x={344} y={y} width={56} words={test} />
            <Box x={406} y={y} width={70} words={value} />
            <Cross x={489} y={y + 8} />
          </g>
        ))}
        <line x1={240} x2={504} y1={156} y2={156} className={RULE} />
        <rect x={252} y={168} width={36} height={4} rx={2} className={QUIET} />
        <rect x={448} y={162} width={44} height={16} rx={4} className={TEXT} />
      </svg>
    </div>
  );
}
