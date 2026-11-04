import type * as ProgressPrimitive from '@radix-ui/react-progress';
import type { HTMLAttributes, ReactNode } from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { FieldLabelProps } from '../field-label/FieldLabel.types';
import type { ProgressBarDescription } from './ProgressBarDescription';
import type { ProgressBarHeader } from './ProgressBarHeader';
import type { ProgressBarLabel } from './ProgressBarLabel';
import type { ProgressBarTrack } from './ProgressBarTrack';
import type { ProgressBarValue } from './ProgressBarValue';

export type ProgressBarVariant = 'default' | 'success' | 'error';
export type ProgressBarType = 'bar' | 'circle';

export type ProgressBarContextType = {
  /** Value clamped to `0..max`. */
  value: number;
  max: number;
  /** Completion rounded to a whole percent. */
  percent: number;
  variant: ProgressBarVariant;
  type: ProgressBarType;
  motion: boolean;
  fixedWidth: boolean;
  setLabelId: (id: string | undefined) => void;
  setDescriptionId: (id: string | undefined) => void;
};

type ProgressBarPropsBase = Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'children' | 'getValueLabel' | 'asChild'
> &
  MotionProps & {
    /** Semantic state — controls color for both bar fill and circle icon. */
    variant?: ProgressBarVariant;
    /** Shape of the progress indicator. */
    type?: ProgressBarType;
    /** Renders the root onto your single child element instead of a `<div>`; put the parts inside that element. Ignored when the child is not a single element. */
    asChild?: boolean;
    /**
     * Aligns the percentage label to a fixed width to prevent layout shift during animation (circle type only).
     * @deprecated Give `ProgressBar.Value` a `className` with a fixed width instead (for example `w-ws-14 inline-block`). Removed in the next release.
     */
    fixedWidth?: boolean;
    /**
     * Builds the `aria-valuetext` announced by screen readers. Without it (and without `aria-valuetext`) the attribute is omitted and screen readers announce the percentage from `aria-valuenow`.
     * @deprecated Pass `aria-valuetext` instead. Removed in the next release.
     */
    getValueLabel?: (value: number, max: number) => string;
  };

type ProgressBarPropsWithShorthand = ProgressBarPropsBase & {
  /**
   * Label shown above the bar; it also names the progress bar. On the circle type it only sets `aria-label`.
   * @deprecated Compose `ProgressBar.Label` instead. Removed in the next release.
   */
  label?: string;
  /**
   * Helper text shown below the bar (bar type only).
   * @deprecated Compose `ProgressBar.Description` instead. Removed in the next release.
   */
  description?: string;
  children?: never;
};

type ProgressBarPropsWithChildren = ProgressBarPropsBase & {
  label?: never;
  description?: never;
  /** Composed parts: `Header`, `Label`, `Value`, `Track` and `Description`. */
  children?: ReactNode;
};

/** A determinate progress indicator, as a bar or a circle. Without children it renders the track alone. */
export type ProgressBarProps = ProgressBarPropsWithShorthand | ProgressBarPropsWithChildren;

export type ProgressBarWithSubComponents = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ProgressBarProps> &
    React.RefAttributes<React.ComponentRef<typeof ProgressPrimitive.Root>>
> & {
  Header: typeof ProgressBarHeader;
  Label: typeof ProgressBarLabel;
  Value: typeof ProgressBarValue;
  Track: typeof ProgressBarTrack;
  Description: typeof ProgressBarDescription;
};

/** Row holding the label and the value above a bar. */
export type ProgressBarHeaderProps = HTMLAttributes<HTMLDivElement>;

/** The visible name of the progress bar; wired to the root with `aria-labelledby`. */
export type ProgressBarLabelProps = Omit<FieldLabelProps, 'description' | 'aside' | 'tooltip'>;

/** The current value as text. Shows the rounded percentage unless told otherwise. */
export type ProgressBarValueProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Builds the text from the clamped value and `max`. The default is the rounded percentage. Not announced by screen readers; use `aria-valuetext` on the root for that. */
  formatValue?: (value: number, max: number) => ReactNode;
  /** Fixed content that replaces the computed value. */
  children?: ReactNode;
};

/** The bar fill or the circle ring; shows a status icon for the success and error variants of the circle. */
export type ProgressBarTrackProps = HTMLAttributes<HTMLDivElement>;

/** Helper text below the bar. Takes its state and icon from the `variant` of `ProgressBar`; wired to the root with `aria-describedby`. */
export type ProgressBarDescriptionProps = HTMLAttributes<HTMLDivElement>;
