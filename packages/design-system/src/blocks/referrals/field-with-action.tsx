// TODO(custom): a field with its button beside it under one label; FormField wires the helper and error text to a single control only, and TextInput's own button sits inside the field as ghost text.
import { TextInput, type TextInputProps } from '@wideset/react';
import type { ReactNode } from 'react';

type FieldWithActionProps = Omit<TextInputProps, 'size' | 'children'> & {
  /** The button that acts on the field's value. */
  action: ReactNode;
};

/**
 * A text field and the button that acts on it, on one row. It is the one child `FormField` sees,
 * so the `aria-describedby` and `aria-invalid` the form field hands down land on the input and
 * not on the row around it.
 */
export function FieldWithAction({ action, ...input }: FieldWithActionProps) {
  return (
    <div className="gap-ws-5 flex">
      <TextInput size="sm" className="min-w-0 flex-1" {...input} />
      {action}
    </div>
  );
}
