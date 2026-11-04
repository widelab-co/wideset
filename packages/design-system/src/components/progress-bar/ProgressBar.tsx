import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { ProgressBarContext } from './ProgressBar.context';
import type { ProgressBarProps, ProgressBarWithSubComponents } from './ProgressBar.types';
import { progressBarVariants } from './ProgressBar.variants';
import { ProgressBarDescription } from './ProgressBarDescription';
import { ProgressBarHeader } from './ProgressBarHeader';
import { ProgressBarLabel } from './ProgressBarLabel';
import { ProgressBarTrack } from './ProgressBarTrack';
import { ProgressBarValue } from './ProgressBarValue';

// Radix fills `aria-valuetext` with the rounded percentage when no `getValueLabel` is given. Screen
// readers derive the same percentage from `aria-valuenow`, so VoiceOver announces it twice. Omit
// the attribute unless the caller supplies its own text (`aria-valuetext` or `getValueLabel`).
const omitValueText = (() => undefined) as unknown as (value: number, max: number) => string;

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
      fixedWidth = false,
      variant = 'default',
      type = 'bar',
      defaultMotion,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const [labelId, setLabelId] = React.useState<string>();
    const [descriptionId, setDescriptionId] = React.useState<string>();
    const max = typeof maxProp === 'number' && maxProp > 0 ? maxProp : 100;
    const clampedValue =
      typeof value === 'number' && !Number.isNaN(value) ? Math.min(Math.max(value, 0), max) : 0;
    const percent = Math.round((clampedValue / max) * 100);

    if (typeof value === 'number' && Number.isNaN(value)) {
      // eslint-disable-next-line no-console
      console.warn('ProgressBar received NaN for `value` prop.');
    }

    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    // The circle has no visible label, so the `label` shorthand names it through `aria-label`.
    const shorthandName = type === 'circle' ? label : undefined;
    const ariaLabel = hasOwnName
      ? props['aria-label']
      : (shorthandName ?? (labelId || (type === 'bar' && label) ? undefined : 'Progress'));

    const contextValue = React.useMemo(
      () => ({
        value: clampedValue,
        max,
        percent,
        variant,
        type,
        motion,
        fixedWidth,
        setLabelId,
        setDescriptionId,
      }),
      [clampedValue, max, percent, variant, type, motion, fixedWidth],
    );

    // `asChild` renders the root props onto the caller's single element, which then holds
    // the parts (as in Tile). Without such an element there is nothing to slot onto, so the
    // root stays a <div> rather than losing its role to the first part.
    const isSlotted = Boolean(asChild) && React.isValidElement(children);

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
      <ProgressBarContext.Provider value={contextValue}>
        <ProgressPrimitive.Root
          ref={ref}
          value={clampedValue}
          max={max}
          getValueLabel={getValueLabel ?? omitValueText}
          asChild={isSlotted}
          data-slot="progress-bar"
          aria-label={ariaLabel}
          aria-labelledby={props['aria-labelledby'] ?? labelId}
          aria-describedby={props['aria-describedby'] ?? descriptionId}
          {...props}
          // Computed ARIA wins over caller props, as it did on the hand-built circle.
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          className={cn(progressBarVariants({ type }), className)}
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

export {
  ProgressBar,
  ProgressBarDescription,
  ProgressBarHeader,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarValue,
};
