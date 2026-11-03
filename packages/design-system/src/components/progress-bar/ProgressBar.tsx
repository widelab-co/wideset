import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';

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
      variant = 'default',
      type = 'bar',
      defaultMotion,
      label,
      description,
      // Deprecated and without effect: the circle's Value always reserves room for 100%.
      // eslint-disable-next-line unused-imports/no-unused-vars
      fixedWidth: _fixedWidth,
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

    if (Number.isNaN(valueProp)) {
      // eslint-disable-next-line no-console
      console.warn('ProgressBar received NaN for `value` prop.');
    }

    const max = typeof maxProp === 'number' && maxProp > 0 ? maxProp : 100;
    const value =
      typeof valueProp === 'number' && !Number.isNaN(valueProp)
        ? Math.min(Math.max(valueProp, 0), max)
        : 0;
    const percent = Math.round((value / max) * 100);

    const context = React.useMemo<ProgressBarContextValue>(
      () => ({
        value,
        max,
        percent,
        variant,
        type,
        motion,
        labelId,
        descriptionId,
        registerLabel,
        registerDescription,
      }),
      [
        value,
        max,
        percent,
        variant,
        type,
        motion,
        labelId,
        descriptionId,
        registerLabel,
        registerDescription,
      ],
    );

    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    // The circle has no visible label, so the deprecated `label` prop names it.
    const circleName = type === 'circle' ? label : undefined;
    const fallbackName = hasOwnName || hasLabel ? undefined : (circleName ?? 'Progress');

    const content =
      children ??
      (type === 'circle' ? (
        <>
          <ProgressBarValue />
          <ProgressBarTrack />
        </>
      ) : (
        <>
          {label && (
            <ProgressBarHeader>
              <ProgressBarLabel>{label}</ProgressBarLabel>
              <ProgressBarValue />
            </ProgressBarHeader>
          )}
          <ProgressBarTrack />
          {description && <ProgressBarDescription>{description}</ProgressBarDescription>}
        </>
      ));

    return (
      <ProgressBarContext.Provider value={context}>
        <ProgressPrimitive.Root
          ref={ref}
          value={value}
          max={max}
          data-slot="progress-bar"
          data-type={type}
          data-variant={variant}
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
          {content}
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
