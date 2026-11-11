// TODO(custom): a drawn thumbnail of the page a screenshot would capture; Wideset has no thumbnail for it, and blocks ship no images.
import { cn } from '@wideset/react';

const FRAME = 'fill-(--ws-static-fill-background)';
const PAGE = 'fill-(--ws-static-fill-foreground) stroke-(--ws-static-stroke-subtle)';
const TEXT = 'fill-(--ws-static-fill-alpha-strong)';
const QUIET = 'fill-(--ws-static-fill-alpha-base)';
const RULE = 'stroke-(--ws-static-stroke-subtle)';

/** The table's rows: where each starts and how long the customer's name and next step are. */
const ROWS = [
  { y: 70, name: 34, step: 52 },
  { y: 84, name: 40, step: 60 },
  { y: 98, name: 36, step: 44 },
  { y: 112, name: 32, step: 56 },
];
/** The meetings beside it: where each starts and how long its title is. */
const MEETINGS = [
  { y: 66, title: 30 },
  { y: 84, title: 36 },
  { y: 102, title: 28 },
];

/**
 * Home as a screenshot would catch it, drawn in a few neutral marks at the window's 3:2: the grey
 * frame with the sidebar on it, the raised page with its bar, the greeting, the deals table and
 * the meetings beside it. The surfaces' own colours, so it turns with the theme. Decorative: the
 * words beside it say what it is.
 */
export function PageThumbnail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'border-ws-static-base rounded-ws-container-sm shrink-0 overflow-hidden border',
        className,
      )}
    >
      <svg viewBox="0 0 240 160" className="block h-auto w-full">
        <rect width={240} height={160} className={FRAME} />

        {/* The sidebar on the frame: the mark, the search, the pages (Home selected). */}
        <rect
          x={8}
          y={8}
          width={10}
          height={10}
          rx={3}
          className="fill-(--ws-static-fill-inverse-background)"
        />
        <rect x={22} y={11} width={22} height={4} rx={2} className={TEXT} />
        <rect x={8} y={24} width={40} height={8} rx={2} className={PAGE} />
        <rect x={6} y={38} width={44} height={8} rx={2} className={QUIET} />
        <rect x={10} y={40.5} width={20} height={3} rx={1.5} className={TEXT} />
        {[0, 1, 2, 3, 4].map((row) => (
          <rect
            key={row}
            x={10}
            y={41 + (row + 1) * 10}
            width={26}
            height={3}
            rx={1.5}
            className={QUIET}
          />
        ))}

        {/* The raised page, its bar, the greeting. */}
        <rect x={56} y={4} width={180} height={152} rx={6} className={PAGE} />
        <line x1={56} x2={236} y1={18} y2={18} className={RULE} />
        <rect x={66} y={26} width={64} height={6} rx={2} className={TEXT} />
        <rect x={66} y={36} width={92} height={3} rx={1.5} className={QUIET} />

        {/* Deals to move this week. */}
        <rect x={66} y={52} width={46} height={4} rx={2} className={TEXT} />
        {ROWS.map(({ y, name, step }) => (
          <g key={y}>
            <line x1={66} x2={180} y1={y - 5} y2={y - 5} className={RULE} />
            <rect x={66} y={y} width={name} height={3} rx={1.5} className={TEXT} />
            <rect x={108} y={y} width={step * 0.6} height={3} rx={1.5} className={QUIET} />
            <rect x={164} y={y} width={16} height={3} rx={1.5} className={QUIET} />
          </g>
        ))}

        {/* Coming up. */}
        <rect x={192} y={52} width={30} height={4} rx={2} className={TEXT} />
        {MEETINGS.map(({ y, title }) => (
          <g key={y}>
            <rect x={192} y={y} width={12} height={3} rx={1.5} className={QUIET} />
            <rect x={192} y={y + 6} width={title} height={3} rx={1.5} className={TEXT} />
          </g>
        ))}
      </svg>
    </div>
  );
}
