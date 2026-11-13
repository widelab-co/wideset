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
import type { FieldLabelDescription } from './FieldLabelDescription';
import type { FieldLabelSuffix } from './FieldLabelSuffix';
import type { FieldLabelTooltip } from './FieldLabelTooltip';

export type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  /** Draws the asterisk (`aria-hidden`). Set `required` on the control as well. */
  required?: boolean;
  /** @deprecated Use `FieldLabel.Suffix` inside the label. */
  suffix?: ReactNode;
  /** @deprecated Use `FieldLabel.Tooltip` next to the label. */
  tooltip?: ReactNode;
  /** @deprecated Set `aria-label` on `FieldLabel.Tooltip`. */
  tooltipAriaLabel?: string;
  /** @deprecated Use `FieldLabel.Aside` next to the label. */
  aside?: ReactNode;
  /** @deprecated Use `FieldLabel.Description` next to the label. */
  description?: ReactNode;
};

export type FieldLabelSuffixProps = HTMLAttributes<HTMLSpanElement>;

export type FieldLabelTooltipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Tooltip content. */
  children?: ReactNode;
  /** Defaults to `'More information'`. */
  'aria-label'?: string;
};

export type FieldLabelAsideProps = HTMLAttributes<HTMLDivElement>;

export type FieldLabelDescriptionProps = HTMLAttributes<HTMLDivElement>;

export type FieldLabelWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<FieldLabelProps> & RefAttributes<HTMLLabelElement>
> & {
  Suffix: typeof FieldLabelSuffix;
  Tooltip: typeof FieldLabelTooltip;
  Aside: typeof FieldLabelAside;
  Description: typeof FieldLabelDescription;
};
