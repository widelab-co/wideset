import * as ProgressPrimitive from '@radix-ui/react-progress';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { FieldLabel } from '../field-label/FieldLabel';
import { HelperText } from '../helper-text/HelperText';
import type { ProgressBarProps } from './ProgressBar.types';
import {
  progressBarCircleIconVariants,
  progressBarCircleMotionVariants,
  progressBarIndicatorMotionVariants,
  progressBarIndicatorVariants,
} from './ProgressBar.variants';

const ProgressBar = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    {
      className,
      value,
      max: maxProp,
      getValueLabel,
      asChild,
      label,
      description,
      fixedWidth,
      variant = 'default',
      type = 'bar',
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const labelId = React.useId();
    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    const fallbackName = hasOwnName || label ? undefined : 'Progress';
    const max = typeof maxProp === 'number' && maxProp > 0 ? maxProp : 100;
    const clampedValue =
      typeof value === 'number' && !Number.isNaN(value) ? Math.min(Math.max(value, 0), max) : 0;
    const progressValue = Math.round((clampedValue / max) * 100);

    if (Number.isNaN(value)) {
      // eslint-disable-next-line no-console
      console.warn('ProgressBar received NaN for `value` prop.');
    }

    if (type === 'circle') {
      const size = 20;
      const strokeWidth = 2.5;
      const radius = size / 2 - strokeWidth / 2;
      const circumference = 2 * Math.PI * radius;
      const fraction = progressValue / 100;
      const dashArray = circumference;
      const offset = circumference * (1 - fraction);

      const icons: Record<typeof variant, React.ReactNode> = {
        default: (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="shrink-0"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="fill-none stroke-(--border-color-ws-dynamic-secondary-default)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={cn(
                'stroke-ws-dynamic-primary-default fill-none',
                progressBarCircleMotionVariants({ enabled: motion }),
              )}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
        ),
        success: (
          <RiCheckboxCircleFill
            aria-hidden="true"
            focusable="false"
            className={progressBarCircleIconVariants({ variant: 'success' })}
          />
        ),
        error: (
          <RiErrorWarningFill
            aria-hidden="true"
            focusable="false"
            className={progressBarCircleIconVariants({ variant: 'error' })}
          />
        ),
      };

      return (
        <div
          data-slot="progress-bar"
          ref={ref}
          {...props}
          className={cn('gap-ws-5 inline-flex items-center', className)}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          // The circle has no visible label, so `label` names it when no ARIA name is given.
          aria-label={hasOwnName ? props['aria-label'] : (label ?? 'Progress')}
        >
          <div className={fixedWidth ? 'w-ws-14' : undefined}>
            <span className="typography-label-sm text-ws-static-subtle">{`${progressValue}%`}</span>
          </div>

          {icons[variant]}
        </div>
      );
    }

    return (
      <div className="gap-ws-5 flex w-full flex-col">
        {label && (
          <div className="gap-ws-3 flex items-center justify-between">
            <FieldLabel id={labelId}>{label}</FieldLabel>
            <span className="typography-label-sm text-ws-static-subtle">{`${progressValue}%`}</span>
          </div>
        )}

        <ProgressPrimitive.Root
          ref={ref}
          value={clampedValue}
          max={max}
          getValueLabel={getValueLabel}
          asChild={asChild}
          className={cn(
            'h-ws-3 relative w-full overflow-hidden rounded-full bg-(--ws-dynamic-stroke-secondary-default)',
            className,
          )}
          aria-labelledby={label ? labelId : undefined}
          data-slot="progress-bar"
          aria-label={fallbackName}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              progressBarIndicatorVariants({ variant }),
              progressBarIndicatorMotionVariants({ enabled: motion }),
            )}
            style={{ transform: `translateX(-${100 - (progressValue || 0)}%)` }}
          />
        </ProgressPrimitive.Root>

        {description && (
          <HelperText state={variant} showIcon={variant === 'success' || variant === 'error'}>
            {description}
          </HelperText>
        )}
      </div>
    );
  },
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
