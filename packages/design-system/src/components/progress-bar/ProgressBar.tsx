import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';
import { clamp, finiteOr } from 'src/logic/helpers';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { ProgressBarContext } from './ProgressBar.context';
import type {
  ProgressBarContextValue,
  ProgressBarProps,
  ProgressBarWithSubComponents,
} from './ProgressBar.types';
import { progressBarRootVariants } from './ProgressBar.variants';
import { ProgressBarDescription } from './ProgressBarDescription';
import { ProgressBarHeader } from './ProgressBarHeader';
import { ProgressBarLabel } from './ProgressBarLabel';
import { ProgressBarTrack } from './ProgressBarTrack';
import { ProgressBarValue } from './ProgressBarValue';

const DEFAULT_MAX = 100;
const INVALID_MAX = 'ProgressBar `max` must be a number greater than 0.';

/** `max` when it is a number greater than 0, otherwise 100 (with a warning if one was given). */
const validateMax = (max: number | undefined) => {
  const finiteMax = finiteOr(max, DEFAULT_MAX, { warn: INVALID_MAX });
  if (finiteMax > 0) return finiteMax;

  console.warn(`${INVALID_MAX} Received ${finiteMax}.`);
  return DEFAULT_MAX;
};

/** `value` kept within `0…max`; a missing or non-finite value is 0 (with a warning if one was given). */
const validateValue = (value: number | undefined, max: number) =>
  clamp(finiteOr(value, 0, { warn: 'ProgressBar `value` must be a finite number.' }), 0, max);

/** Tracks whether a part is mounted, so the root only points ARIA at ids that exist. */
const usePartRegistration = () => {
  const [mounted, setMounted] = React.useState(false);
  const register = React.useCallback(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return [mounted, register] as const;
};

const ProgressBar = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    {
      className,
      value: valueProp,
      max: maxProp,
      status = 'default',
      type = 'bar',
      defaultMotion,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const labelId = React.useId();
    const descriptionId = React.useId();
    const [hasLabel, registerLabel] = usePartRegistration();
    const [hasDescription, registerDescription] = usePartRegistration();

    const max = validateMax(maxProp);
    const value = validateValue(valueProp, max);
    const percent = Math.round((value / max) * 100);

    const fields: ProgressBarContextValue = {
      value,
      max,
      percent,
      status,
      type,
      motion,
      labelId,
      descriptionId,
      registerLabel,
      registerDescription,
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const context = React.useMemo(() => fields, Object.values(fields));

    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    const fallbackName = hasOwnName || hasLabel ? undefined : 'Progress';

    return (
      <ProgressBarContext.Provider value={context}>
        <ProgressPrimitive.Root
          ref={ref}
          value={value}
          max={max}
          data-slot="progress-bar"
          data-type={type}
          data-status={status}
          aria-label={fallbackName}
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          {...props}
          // Radix spreads caller props over its own ARIA; the computed role and values must win.
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(progressBarRootVariants({ type }), className)}
        >
          {children ?? <ProgressBarTrack />}
        </ProgressPrimitive.Root>
      </ProgressBarContext.Provider>
    );
  },
) as ProgressBarWithSubComponents;
ProgressBar.displayName = 'ProgressBar';

ProgressBar.Header = ProgressBarHeader;
ProgressBar.Label = ProgressBarLabel;
ProgressBar.Value = ProgressBarValue;
ProgressBar.Track = ProgressBarTrack;
ProgressBar.Description = ProgressBarDescription;

export { ProgressBar };
