import { RiAspectRatioLine, RiZoomInLine, RiZoomOutLine } from '@remixicon/react';
import { Button, IconButton } from '@wideset/react';

/** The zoom steps, as a document viewer offers them. */
export const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export type Zoom = number | 'fit';

type ZoomControlsProps = {
  zoom: Zoom;
  /** The scale on screen: the chosen step, or what Fit works out to. */
  scale: number;
  onZoomChange: (zoom: Zoom) => void;
};

/**
 * Zoom under the file: out, the current size (which returns to 100%), in, and Fit, pressed
 * while the file fits the window. Out and in step through the zoom steps from wherever the
 * scale is, so from Fit at 73% they go to 50% or 75%.
 */
export function ZoomControls({ zoom, scale, onZoomChange }: ZoomControlsProps) {
  const smaller = ZOOM_STEPS.findLast((step) => step < scale - 0.001);
  const larger = ZOOM_STEPS.find((step) => step > scale + 0.001);
  const percent = Math.round(scale * 100);

  return (
    <div role="group" aria-label="Zoom" className="gap-ws-3 flex items-center">
      <IconButton
        icon={RiZoomOutLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label="Zoom out"
        disabled={smaller === undefined}
        onClick={() => smaller !== undefined && onZoomChange(smaller)}
      />
      <Button
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label={`Actual size, now ${percent}%`}
        onClick={() => onZoomChange(1)}
        className="min-w-[4.5rem]"
      >
        {`${percent}%`}
      </Button>
      <IconButton
        icon={RiZoomInLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label="Zoom in"
        disabled={larger === undefined}
        onClick={() => larger !== undefined && onZoomChange(larger)}
      />
      <IconButton
        icon={RiAspectRatioLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label="Fit to window"
        aria-pressed={zoom === 'fit'}
        onClick={() => onZoomChange('fit')}
      />
    </div>
  );
}
