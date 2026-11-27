import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  LabelHTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { FieldLabelAside } from './FieldLabelAside';
import type { FieldLabelRequiredIndicator } from './FieldLabelRequiredIndicator';
import type { FieldLabelSuffix } from './FieldLabelSuffix';
import type { FieldLabelTooltip } from './FieldLabelTooltip';

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  /** Shows `FieldLabel.RequiredIndicator`. Set `required` on the control as well. */
  required?: boolean;
};

export type FieldLabelContextValue = { required: boolean };

/** Draws `*` (`aria-hidden`) when the label is `required`; nothing otherwise. */
export type FieldLabelRequiredIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export type FieldLabelSuffixProps = HTMLAttributes<HTMLSpanElement>;

export type FieldLabelTooltipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Tooltip content. */
  children?: ReactNode;
  /** Defaults to `'More information'`. */
  'aria-label'?: string;
};

export type FieldLabelAsideProps = HTMLAttributes<HTMLDivElement>;

export type FieldLabelWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<FieldLabelProps> & RefAttributes<HTMLLabelElement>
> & {
  RequiredIndicator: typeof FieldLabelRequiredIndicator;
  Suffix: typeof FieldLabelSuffix;
  Tooltip: typeof FieldLabelTooltip;
  Aside: typeof FieldLabelAside;
};
