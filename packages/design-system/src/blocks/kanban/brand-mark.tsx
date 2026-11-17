import { cn } from '@wideset/react';

const TILE =
  'M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16Z';
const W =
  'M21.6907 12C21.6907 12 19.618 17.322 19.5381 17.5183C19.4954 17.4215 17.1775 12 17.1775 12H15.0877C15.0877 12 12.7755 17.5183 12.7413 17.5916C12.7042 17.5157 10.2409 12 10.2409 12H8L11.7434 20H13.8047L16.1483 14.3403H16.1853C16.211 14.3953 18.5802 20 18.5802 20H20.7042C20.7042 20 23.9772 12.0707 24 12.0052L21.6935 12H21.6907Z';

/**
 * The Wideset mark: a W on the inverse tile, Figma's workspace Thumbnail. It takes the size of
 * its place (32px in a sidebar or top bar, 36px in a larger switcher) and inverts in dark mode.
 * Decorative beside the product's name; give it a `label` when it stands alone.
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
      <path d={W} className="fill-(--ws-static-text-inverse-strong)" />
    </svg>
  );
}
