import * as ProgressPrimitive from '@radix-ui/react-progress';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarTrackProps } from './ProgressBar.types';
import {
  progressBarCircleIconVariants,
  progressBarCircleMotionVariants,
  progressBarIndicatorMotionVariants,
  progressBarIndicatorVariants,
  progressBarTrackVariants,
} from './ProgressBar.variants';

const RING_SIZE = 20;
const RING_STROKE = 2.5;
const RING_RADIUS = RING_SIZE / 2 - RING_STROKE / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const ProgressBarRing = ({ percent, motion }: { percent: number; motion: boolean }) => (
  <svg
    width={RING_SIZE}
    height={RING_SIZE}
    viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx={RING_SIZE / 2}
      cy={RING_SIZE / 2}
      r={RING_RADIUS}
      className="fill-none stroke-(--border-color-ws-dynamic-secondary-default)"
      strokeWidth={RING_STROKE}
    />
    <circle
      cx={RING_SIZE / 2}
      cy={RING_SIZE / 2}
      r={RING_RADIUS}
      className={cn(
        'stroke-ws-dynamic-primary-default fill-none',
        progressBarCircleMotionVariants({ enabled: motion }),
      )}
      strokeWidth={RING_STROKE}
      strokeLinecap="round"
      strokeDasharray={RING_CIRCUMFERENCE}
      strokeDashoffset={RING_CIRCUMFERENCE * (1 - percent / 100)}
      transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
    />
  </svg>
);

/** Visual only: the root carries the progressbar role and the value. */
const ProgressBarTrack = React.forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  ({ className, ...props }, ref) => {
    const { type, status, percent, motion } = useProgressBarContext();

    return (
      <div
        ref={ref}
        data-slot="progress-bar-track"
        className={cn(progressBarTrackVariants({ type }), className)}
        {...props}
      >
        {type === 'bar' && (
          <ProgressPrimitive.Indicator
            className={cn(
              progressBarIndicatorVariants({ status }),
              progressBarIndicatorMotionVariants({ enabled: motion }),
            )}
            style={{ transform: `translateX(-${100 - percent}%)` }}
          />
        )}
        {type === 'circle' && status === 'default' && (
          <ProgressBarRing percent={percent} motion={motion} />
        )}
        {type === 'circle' && status === 'success' && (
          <RiCheckboxCircleFill
            aria-hidden="true"
            focusable="false"
            className={progressBarCircleIconVariants({ status: 'success' })}
          />
        )}
        {type === 'circle' && status === 'error' && (
          <RiErrorWarningFill
            aria-hidden="true"
            focusable="false"
            className={progressBarCircleIconVariants({ status: 'error' })}
          />
        )}
      </div>
    );
  },
);
ProgressBarTrack.displayName = 'ProgressBar.Track';

export { ProgressBarTrack };
