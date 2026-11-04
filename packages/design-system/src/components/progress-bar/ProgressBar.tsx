import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';
import { clamp, isFiniteNumber } from 'src/logic/helpers';

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

// Radix fills `aria-valuetext` with the rounded percentage by default. Screen readers derive the
// same percentage from `aria-valuenow` and `aria-valuemax`, so VoiceOver announced it twice (as
// found on #5). Omit the attribute; a caller's own `aria-valuetext` still reaches the root.
const omitValueText = (() => undefined) as unknown as (value: number, max: number) => string;

const DEFAULT_MAX = 100;

/** `max` when it is a number greater than 0, otherwise 100 (with a warning if one was given). */
const validateMax = (max?: number) => {
  if (max === undefined) return DEFAULT_MAX;
  if (isFiniteNumber(max) && max > 0) return max;
  console.warn(`ProgressBar \`max\` must be a number greater than 0. Received ${max}.`);
  return DEFAULT_MAX;
};

/** `value` kept within `0…max`; a missing or non-finite value is 0 (with a warning if one was given). */
const validateValue = (value: number | undefined, max: number) => {
  if (value === undefined) return 0;
  if (isFiniteNumber(value)) return clamp(value, 0, max);
  console.warn(`ProgressBar \`value\` must be a finite number. Received ${value}.`);
  return 0;
};

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
      asChild,
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

    // `asChild` puts the root on the caller's single element, which then holds the parts (as in
    // Tile). Without such an element the root stays a <div> instead of slotting onto a part.
    const isSlotted = Boolean(asChild) && React.isValidElement(children);

    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    const fallbackName = hasOwnName || hasLabel ? undefined : 'Progress';

    return (
      <ProgressBarContext.Provider value={context}>
        <ProgressPrimitive.Root
          ref={ref}
          value={value}
          max={max}
          asChild={isSlotted}
          getValueLabel={omitValueText}
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
