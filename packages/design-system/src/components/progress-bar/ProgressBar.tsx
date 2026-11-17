import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { ProgressBarContext } from './ProgressBar.context';
import { usePartId } from './ProgressBar.hooks';
import { hasContent, omitValueText, validateMax, validateValue } from './ProgressBar.logic';
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
    const [labelId, registerLabel] = usePartId();
    const [descriptionId, registerDescription] = usePartId();

    const max = validateMax(maxProp);
    const value = validateValue(valueProp, max);
    const percent = Math.round((value / max) * 100);

    const context = React.useMemo<ProgressBarContextValue>(
      () => ({ value, max, percent, status, type, motion, registerLabel, registerDescription }),
      [value, max, percent, status, type, motion, registerLabel, registerDescription],
    );

    const hasOwnName = Boolean(props['aria-label'] || props['aria-labelledby']);
    const fallbackName = hasOwnName || labelId ? undefined : 'Progress';
    // A caller's `aria-describedby` adds to the composed Description instead of replacing it.
    const describedBy =
      [props['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined;

    // The computed role and values must win. Radix spreads caller props over its own ARIA, so they
    // are set after `{...props}`; with `asChild`, Slot gives the child's props priority, so the
    // child carries them as well.
    const semantics = {
      role: 'progressbar',
      'aria-valuenow': value,
      'aria-valuemin': 0,
      'aria-valuemax': max,
    } as const;

    // `asChild` puts the root on the caller's single element, which then holds the parts (as in
    // Tile). Without such an element the root stays a <div> instead of slotting onto a part.
    const isSlotted = Boolean(asChild) && React.isValidElement(children);
    const content = isSlotted ? (
      React.cloneElement(children as React.ReactElement<Record<string, unknown>>, semantics)
    ) : hasContent(children) ? (
      children
    ) : (
      <ProgressBarTrack />
    );

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
          aria-labelledby={labelId}
          {...props}
          aria-describedby={describedBy}
          {...semantics}
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
