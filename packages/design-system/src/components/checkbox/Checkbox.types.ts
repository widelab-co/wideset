import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { checkboxVariants } from './Checkbox.variants';
import type { CheckboxDescription } from './CheckboxDescription';
import type { CheckboxGroup } from './CheckboxGroup';
import type { CheckboxLabel } from './CheckboxLabel';

export type CheckboxContextType = {
  disabled?: boolean;
  id?: string;
  descriptionId?: string;
  onDescriptionIdChange?: (id: string | undefined) => void;
};

type CheckboxPropsBase = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  MotionProps &
  VariantProps<typeof checkboxVariants>;

type CheckboxPropsWithLabel = CheckboxPropsBase & {
  /** Shorthand label, mutually exclusive with composed children. */
  label: string;
  /** Supporting text for the shorthand label. Unavailable with composed children. */
  description?: string;
  children?: never;
};

type CheckboxPropsWithChildren = CheckboxPropsBase & {
  label?: never;
  description?: never;
  /** Composed label and description. Use instead of the shorthand label and description. */
  children?: React.ReactNode;
};

type CheckboxPropsWithoutLabel = CheckboxPropsBase & {
  label?: never;
  description?: never;
  children?: never;
};

/** A checkbox with optional label and description. */
export type CheckboxProps =
  CheckboxPropsWithLabel | CheckboxPropsWithChildren | CheckboxPropsWithoutLabel;

export type CheckboxWithVariants = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<CheckboxProps> &
    React.RefAttributes<React.ComponentRef<typeof CheckboxPrimitive.Root>>
> & {
  Group: typeof CheckboxGroup;
  Label: typeof CheckboxLabel;
  Description: typeof CheckboxDescription;
};

/** The text label associated with `Checkbox`. */
export type CheckboxLabelProps = HTMLAttributes<HTMLLabelElement> & {
  /** ID of the control associated with this label. */
  htmlFor?: string;
};

/** A layout container for related checkboxes. Name the group with `aria-labelledby` or `aria-label`. */
export type CheckboxGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Layout direction of the checkbox group. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
};
