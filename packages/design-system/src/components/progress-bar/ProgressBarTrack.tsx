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

const SIZE = 20;
const STROKE_WIDTH = 2.5;
const RADIUS = SIZE / 2 - STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ProgressBarTrack = React.forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  ({ className, ...props }, ref) => {
    const { percent, variant, type, motion } = useProgressBarContext();

    if (type === 'circle') {
      return (
        <div
          ref={ref}
          data-slot="progress-bar-track"
          className={cn(progressBarTrackVariants({ type }), className)}
          {...props}
        >
          {variant === 'success' ? (
            <RiCheckboxCircleFill
              aria-hidden="true"
              focusable="false"
              className={progressBarCircleIconVariants({ variant })}
            />
          ) : variant === 'error' ? (
            <RiErrorWarningFill
              aria-hidden="true"
              focusable="false"
              className={progressBarCircleIconVariants({ variant })}
            />
          ) : (
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="shrink-0"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                className="fill-none stroke-(--border-color-ws-dynamic-secondary-default)"
                strokeWidth={STROKE_WIDTH}
              />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                className={cn(
                  'stroke-ws-dynamic-primary-default fill-none',
                  progressBarCircleMotionVariants({ enabled: motion }),
                )}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            </svg>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="progress-bar-track"
        className={cn(progressBarTrackVariants({ type }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressBarIndicatorVariants({ variant }),
            progressBarIndicatorMotionVariants({ enabled: motion }),
          )}
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      </div>
    );
  },
);
ProgressBarTrack.displayName = 'ProgressBar.Track';
