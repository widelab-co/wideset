import type { VariantProps } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { CheckboxProps } from '../checkbox/Checkbox.types';
import type { actionBarVariants } from './ActionBar.variants';
import type { ActionBarActions } from './ActionBarActions';
import type { ActionBarCount } from './ActionBarCount';
import type { ActionBarSelectAll } from './ActionBarSelectAll';

/** Floating actions for the current selection. */
export type ActionBarProps = {
  /** @deprecated Use `ActionBar.Count` with the formatted selection count. */
  amountSelected?: number | [count: number, format: (amount: number) => ReactNode];
  /** Controls visibility of the action bar. Defaults to `false`. */
  isOpen?: boolean;
  /** @deprecated Compose a clear-selection button inside `ActionBar.Actions`. */
  onClose?: () => void;
  /** Compose the selection count and its actions. */
  children?: ReactNode;
  /** @deprecated Label the clear-selection button directly. The legacy default is `'Close'`. */
  closeAriaLabel?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'> &
  VariantProps<typeof actionBarVariants> &
  MotionProps;

/** The selection count, read out politely when it changes. */
export type ActionBarCountProps = ComponentPropsWithoutRef<'p'> & {
  /** Localized text describing the current selection. */
  children?: ReactNode;
};

/** The raised segment for the selection controls. */
export type ActionBarActionsProps = ComponentPropsWithoutRef<'div'> & {
  /** Optional Select all checkbox followed by actions for the selection. */
  children?: ReactNode;
};

/** A checkbox for selecting or clearing all items in the current scope. */
export type ActionBarSelectAllProps = Omit<CheckboxProps, 'label' | 'description' | 'children'> & {
  /** Visible label of the checkbox. Defaults to `'Select all'`. */
  label?: string;
};

export type ActionBarWithSubComponents = ForwardRefExoticComponent<
  ActionBarProps & RefAttributes<HTMLDivElement>
> & {
  Count: typeof ActionBarCount;
  Actions: typeof ActionBarActions;
  SelectAll: typeof ActionBarSelectAll;
};
