import { cn } from '@wideset/react';

const TILE =
  'M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16Z';

/**
 * The Orbit mark: a ring and its satellite on the inverse tile, Figma's workspace Thumbnail. It
 * takes the size of its place (32px in a sidebar, 36px in a larger switcher) and inverts in dark
 * mode. Decorative beside the product's name; give it a `label` when it stands alone.
 */
export function BrandMark({ className, label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('size-ws-14 shrink-0', className)}
    >
      <path d={TILE} className="fill-(--ws-static-fill-inverse-background)" />
      <circle
        cx="16"
        cy="16"
        r="6.5"
        fill="none"
        strokeWidth="2.25"
        className="stroke-(--ws-static-text-inverse-strong)"
      />
      {/* The satellite on the ring, cut out of it by a tile-coloured edge. */}
      <circle
        cx="20.6"
        cy="11.4"
        r="2.6"
        strokeWidth="1.75"
        className="fill-(--ws-static-text-inverse-strong) stroke-(--ws-static-fill-inverse-background)"
      />
    </svg>
  );
}
