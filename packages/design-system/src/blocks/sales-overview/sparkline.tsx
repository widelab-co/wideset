// TODO(custom): hand-built SVG sparkline; no Sparkline in Wideset.
import { cn } from '@wideset/react';

// The line in viewBox units; the SVG stretches to its box and the stroke keeps its width.
const WIDTH = 100;
const HEIGHT = 32;

/**
 * A figure's recent trend as a bare line: no axes, no labels, the latest value marked. It only
 * shows the shape; the number beside it says the value.
 */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * WIDTH,
    // 2 units of room top and bottom so the stroke is never clipped.
    2 + (1 - (value - min) / (max - min || 1)) * (HEIGHT - 4),
  ]);
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn('overflow-visible', className)}
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-ws-static-subtle"
      >
        <path
          d={points.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join('')}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <path d={`M${lastX} ${lastY}h0`} strokeWidth={5} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
