import { cn } from '@wideset/react';
import { useId } from 'react';

/** Figma's W, in its own box (24.97 × 13.87). */
const W =
  'M21.377 0C21.377 0 18.14 9.233 18.017 9.574C17.95 9.402 14.331 0 14.331 0H11.069C11.069 0 7.462 9.574 7.41 9.703C7.353 9.57 3.508 0 3.508 0H0L5.853 13.871H9.059L12.716 4.054H12.773C12.81 4.149 16.51 13.871 16.51 13.871H19.827C19.827 13.871 24.932 0.114 24.967 0H21.377Z';

/** Figma's tile, 46.24 × 46.89 with a 16.18 radius, at its place in the 47.25 × 48 icon. */
const TILE = { x: 0.69, y: 0.81, width: 46.24, height: 46.89, rx: 16.18 };

// Light-palette primitives: the icon looks the same in dark mode.
const INDIGO_300 = '[stop-color:var(--ws-colors-light-indigo-300)]';
const INDIGO_400 = '[stop-color:var(--ws-colors-light-indigo-400)]';
const INDIGO_500 = '[stop-color:var(--ws-colors-light-indigo-500)]';
const INDIGO_600 = '[stop-color:var(--ws-colors-light-indigo-600)]';
const INDIGO_700 = '[stop-color:var(--ws-colors-light-indigo-700)]';
const PURPLE_200 = '[stop-color:var(--ws-colors-light-purple-200)]';
const PURPLE_400 = '[stop-color:var(--ws-colors-light-purple-400)]';
const WHITE = '[stop-color:var(--ws-colors-light-neutral-0)]';

/**
 * The app icon at the top of a sign-in card: Figma's glass tile, a W lit from below. It is not the
 * flat brand mark of an app's sidebar, and it keeps its colours in dark mode, so it draws with the
 * light palette's primitives. Figma lights the tile with blurred, blended shapes; here that light is
 * two gradients in the nearest tokens. Decorative: the title beside it names the product.
 */
export function AppIcon({ className }: { className?: string }) {
  const id = useId();
  const url = (name: string) => `url(#${id}${name})`;

  return (
    <svg
      viewBox="0 0 47.25 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('size-ws-18 shrink-0', className)}
    >
      <defs>
        <clipPath id={`${id}tile`}>
          <rect {...TILE} />
        </clipPath>
        {/* The light rising from the bottom edge. */}
        <linearGradient id={`${id}glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopOpacity={0.06} className={INDIGO_600} />
          <stop offset="0.4" stopOpacity={0.1} className={INDIGO_600} />
          <stop offset="0.6" stopOpacity={0.38} className={INDIGO_600} />
          <stop offset="0.75" stopOpacity={0.62} className={INDIGO_600} />
          <stop offset="0.86" stopOpacity={0.85} className={INDIGO_600} />
          <stop offset="0.93" stopOpacity={0.9} className={INDIGO_500} />
          <stop offset="0.97" className={INDIGO_400} />
          <stop offset="1" className={INDIGO_300} />
        </linearGradient>
        {/* Figma's radial fill: centred above the tile, so its rim lights the lower corners. */}
        <radialGradient
          id={`${id}bowl`}
          cx="0.5"
          cy="-0.111"
          r="1"
          gradientTransform="matrix(0.8005 0 0 1.4758 0.0998 0.0528)"
        >
          <stop offset="0.55" stopOpacity={0} className={INDIGO_600} />
          <stop offset="0.79" className={INDIGO_600} />
          <stop offset="0.86" className={INDIGO_400} />
        </radialGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={PURPLE_200} />
          <stop offset="0.5" stopOpacity={0.56} className={INDIGO_500} />
          <stop offset="1" stopOpacity={0.15} className={INDIGO_700} />
        </linearGradient>
        {/* Figma's two glass highlights: a lilac line along the top, a white one along the bottom. */}
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopOpacity={0.3} className={PURPLE_400} />
          <stop offset="0.15" stopOpacity={0} className={PURPLE_400} />
          <stop offset="0.92" stopOpacity={0} className={WHITE} />
          <stop offset="1" stopOpacity={0.2} className={WHITE} />
        </linearGradient>
      </defs>
      <g clipPath={url('tile')}>
        <rect {...TILE} className="fill-(--ws-colors-light-brand-1100)" />
        <rect {...TILE} fill={url('bowl')} />
        <rect {...TILE} fill={url('glow')} />
      </g>
      <rect
        x="0.23"
        y="0.23"
        width="46.79"
        height="47.54"
        rx="16.18"
        fill="none"
        stroke={url('rim')}
        strokeWidth="0.46"
      />
      <path transform="translate(11.32 18.61)" d={W} fill={url('w')} />
    </svg>
  );
}
