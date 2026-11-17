import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import type { FieldLabelProps } from '../field-label/FieldLabel.types';
import type { formFieldVariants } from './FormField.variants';

/** A labeled field wrapper with helper and validation text. */
export type FormFieldProps = VariantProps<typeof formFieldVariants> & {
  /** The control. A single element is linked to the helper or error text with `aria-describedby`. */
  children: ReactNode;
  /** Additional classes added to the root element. */
  className?: string;
  /** Wrapper element. Use `fieldset` to label a group of related controls. */
  WrapperComponent?: 'div' | 'fieldset';
  /** Validation message displayed in place of helper text when provided. */
  errorText?: string;
  /** Supporting text displayed when there is no error message. */
  helperText?: string;
  /** Id of the helper or error text. Generated when omitted. */
  helperTextId?: string;
  /** Field label content; connect it to the control with matching IDs. */
  label: ReactNode;
  /** Quiet text after the label, such as "(optional)". */
  suffix?: string;
  /** Extra explanation behind an info button next to the label. */
  tooltip?: ReactNode;
  /** Accessible name of the tooltip button. Defaults to `'More information'`. */
  tooltipAriaLabel?: string;
  /** Quiet content at the far end of the label row, such as a counter or a link. */
  aside?: ReactNode;
} & Omit<FieldLabelProps, 'children' | 'className'>;
