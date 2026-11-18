import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { ProgressBarContext } from './ProgressBar.context';
import { useInvalidPropWarnings, usePartId } from './ProgressBar.hooks';
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

    useInvalidPropWarnings(valueProp, maxProp);
    const max = validateMax(maxProp);
    const value = validateValue(valueProp, max);
    const percent = Math.round((value / max) * 100);

    const context = React.useMemo<ProgressBarContextValue>(
      () => ({ value, max, percent, status, type, motion, registerLabel, registerDescription }),
      [value, max, percent, status, type, motion, registerLabel, registerDescription],
    );

    const labelledBy = props['aria-labelledby'] || labelId;
    const label = props['aria-label'] || (labelledBy ? undefined : 'Progress');
    const describedBy =
      [props['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined;

    // Applied after `{...props}` and on the slotted child, so caller ARIA cannot override them.
    const semantics = {
      role: 'progressbar',
      'aria-valuenow': value,
      'aria-valuemin': 0,
      'aria-valuemax': max,
    } as const;

    const isSlotted =
      Boolean(asChild) && React.isValidElement(children) && children.type !== React.Fragment;
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
          {...props}
          aria-label={label}
          aria-labelledby={labelledBy}
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
