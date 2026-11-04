import type * as ProgressPrimitive from '@radix-ui/react-progress';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { progressBarRootVariants } from './ProgressBar.variants';
import type { ProgressBarDescription } from './ProgressBarDescription';
import type { ProgressBarHeader } from './ProgressBarHeader';
import type { ProgressBarLabel } from './ProgressBarLabel';
import type { ProgressBarTrack } from './ProgressBarTrack';
import type { ProgressBarValue } from './ProgressBarValue';

export type ProgressBarStatus = 'default' | 'success' | 'error';
export type ProgressBarType = NonNullable<VariantProps<typeof progressBarRootVariants>['type']>;

/** Shows how far a task has got, as a bar or a ring. */
export type ProgressBarProps = Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'asChild' | 'children' | 'getValueLabel'
> &
  MotionProps & {
    /** Current progress, clamped between `0` and `max`. A missing or `NaN` value renders `0`. */
    value?: number;
    /** The value that means complete. Defaults to `100`. */
    max?: number;
    /**
     * State of the task: `default` while it runs, `success` when it finished, `error` when it
     * failed. Sets the colour of the fill, the circle's icon and the description.
     */
    status?: ProgressBarStatus;
    /** Shape of the progress indicator: a full-width bar or a compact ring. */
    type?: ProgressBarType;
    /**
     * The parts to render: `ProgressBar.Header`, `.Label`, `.Value`, `.Track`, `.Description`.
     * Without children the bar renders its track and the circle its percentage and ring.
     */
    children?: React.ReactNode;
  };

export type ProgressBarContextValue = {
  /** Value clamped into `0..max`. */
  value: number;
  max: number;
  /** `value / max` as a rounded percentage, `0..100`. */
  percent: number;
  status: ProgressBarStatus;
  type: ProgressBarType;
  motion: boolean;
  labelId: string;
  descriptionId: string;
  /** Marks a mounted Label; returns the cleanup that unmarks it. */
  registerLabel: () => () => void;
  /** Marks a mounted Description; returns the cleanup that unmarks it. */
  registerDescription: () => () => void;
};

export type ProgressBarWithSubComponents = React.ForwardRefExoticComponent<
  ProgressBarProps & React.RefAttributes<React.ComponentRef<typeof ProgressPrimitive.Root>>
> & {
  Header: typeof ProgressBarHeader;
  Label: typeof ProgressBarLabel;
  Value: typeof ProgressBarValue;
  Track: typeof ProgressBarTrack;
  Description: typeof ProgressBarDescription;
};

/** The row above the bar holding `ProgressBar.Label` and `ProgressBar.Value` (bar type). */
export type ProgressBarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** The visible label; it names the progressbar through `aria-labelledby`. */
export type ProgressBarLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  /** Label content: plain text or rich content such as formatted text. */
  children?: React.ReactNode;
};

/** The value as text, the percentage by default. */
export type ProgressBarValueProps = React.HTMLAttributes<HTMLSpanElement> & {
  /**
   * Formats the visible value, e.g. `(value, max) => \`${value} / ${max}\``. Defaults to the rounded
   * percentage. Visual only: screen readers read the root's `aria-valuetext`.
   */
  formatValue?: (value: number, max: number) => React.ReactNode;
};

/** The bar's track and fill, or the ring (an icon on success and error) for the circle type. */
export type ProgressBarTrackProps = React.HTMLAttributes<HTMLDivElement>;

/** Helper text below the bar, coloured by the root `status`; it describes the progressbar. */
export type ProgressBarDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;
