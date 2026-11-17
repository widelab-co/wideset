// TODO(custom): canvas zoom controls (out, level, in, fit) in one bordered group; Wideset has no toolbar group or zoom control.
import { RiFocus3Line, RiZoomInLine, RiZoomOutLine } from '@remixicon/react';
import { cn, IconButton } from '@wideset/react';

/**
 * The zoom steps. CSS `zoom` scales the flow's layout too, so the canvas scrolls by the zoomed
 * size; the classes are written out so Tailwind finds them.
 */
export const ZOOMS = [
  { value: 0.5, className: '[zoom:0.5]' },
  { value: 0.75, className: '[zoom:0.75]' },
  { value: 1, className: '[zoom:1]' },
  { value: 1.25, className: '[zoom:1.25]' },
  { value: 1.5, className: '[zoom:1.5]' },
];

/**
 * Zoom out, the level, zoom in, then fit, in one group in the canvas corner. The group is the
 * one frame; its buttons are ghost, so nothing is boxed twice.
 */
export function ZoomControls({
  zoom,
  onZoomChange,
  onFit,
  className,
}: {
  /** Index into `ZOOMS`. */
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFit: () => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Zoom"
      className={cn(
        'gap-ws-2 p-ws-2 rounded-ws-control-lg border-ws-static-base bg-ws-static-foreground flex items-center border',
        className,
      )}
    >
      <IconButton
        icon={RiZoomOutLine}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Zoom out"
        disabled={zoom === 0}
        onClick={() => onZoomChange(zoom - 1)}
      />
      <output
        aria-live="polite"
        className="typography-label-sm text-ws-static-base w-ws-17 text-center tabular-nums"
      >
        {ZOOMS[zoom].value * 100}%
      </output>
      <IconButton
        icon={RiZoomInLine}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Zoom in"
        disabled={zoom === ZOOMS.length - 1}
        onClick={() => onZoomChange(zoom + 1)}
      />
      <span aria-hidden="true" className="h-ws-9 border-ws-static-subtle mx-ws-2 border-l" />
      <IconButton
        icon={RiFocus3Line}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Fit to screen"
        onClick={onFit}
      />
    </div>
  );
}
