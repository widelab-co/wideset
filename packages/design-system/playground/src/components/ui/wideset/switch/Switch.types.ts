import type * as Label from '@radix-ui/react-label';
import type * as RadixSwitch from '@radix-ui/react-switch';
import type { VariantProps } from 'class-variance-authority';
import type React from 'react';

import type { MotionProps } from '@/lib/wideset/motion/Motion.types';
import type { switchVariants } from './Switch.variants';
import type { SwitchDescription } from './SwitchDescription';
import type { SwitchLabel } from './SwitchLabel';

export type SwitchContextType = {
  disabled?: boolean;
  id?: string;
};

/** The text label associated with `Switch`. */
export type SwitchLabelProps = React.ComponentPropsWithoutRef<typeof Label.Root>;

type SwitchPropsBase = Omit<React.ComponentProps<typeof RadixSwitch.Root>, 'children'> &
  MotionProps &
  VariantProps<typeof switchVariants> & {
    /**
     * Position of label in accordance to the Switch
     *
     * @default 'right'
     */
    labelPosition?: 'left' | 'right';
  };

type SwitchPropsWithLabel = SwitchPropsBase & {
  /** Shorthand label, mutually exclusive with composed children. */
  label: string;
  children?: never;
};

type SwitchPropsWithChildren = SwitchPropsBase & {
  label?: never;
  /** Composed label and description. Use instead of the shorthand label. */
  children?: React.ReactNode;
};

/** A binary setting that takes effect immediately. */
export type SwitchProps = SwitchPropsWithLabel | SwitchPropsWithChildren;

export type SwitchWithVariants = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SwitchProps> &
    React.RefAttributes<React.ComponentRef<typeof RadixSwitch.Root>>
> & {
  Label: typeof SwitchLabel;
  Description: typeof SwitchDescription;
};
