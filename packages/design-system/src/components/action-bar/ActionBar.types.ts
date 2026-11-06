import type { VariantProps } from 'class-variance-authority';
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { CheckboxProps } from '../checkbox/Checkbox.types';
import type { actionBarVariants } from './ActionBar.variants';
import type { ActionBarActions } from './ActionBarActions';
import type { ActionBarCount } from './ActionBarCount';
import type { ActionBarSelectAll } from './ActionBarSelectAll';

/** A floating bar of actions for the current selection. */
export type ActionBarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof actionBarVariants> &
  MotionProps & {
    /**
     * Shows the bar. Keep it mounted and tie this to "the selection is not empty", so the bar
     * can animate out. Closed, it is `inert` and hidden from assistive technology. Defaults to
     * `false`.
     */
    isOpen?: boolean;
    /** `ActionBar.Count`, then `ActionBar.Actions`. */
    children?: ReactNode;
  };

/** The selection count, read out politely when it changes. */
export type ActionBarCountProps = HTMLAttributes<HTMLParagraphElement> & {
  /** What is selected, as text: "4 rows selected". */
  children?: ReactNode;
};

/** The raised segment that holds Select all and the actions for the selection. */
export type ActionBarActionsProps = HTMLAttributes<HTMLDivElement> & {
  /** `ActionBar.SelectAll` first, then buttons and icon buttons of size `sm`. */
  children?: ReactNode;
};

/** The checkbox that selects every item, and clears the selection once all are selected. */
export type ActionBarSelectAllProps = Omit<CheckboxProps, 'label' | 'description' | 'children'> & {
  /** Visible label of the checkbox. Defaults to `'Select all'`. */
  label?: string;
};

export type ActionBarWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<ActionBarProps> & RefAttributes<HTMLDivElement>
> & {
  Count: typeof ActionBarCount;
  Actions: typeof ActionBarActions;
  SelectAll: typeof ActionBarSelectAll;
};
