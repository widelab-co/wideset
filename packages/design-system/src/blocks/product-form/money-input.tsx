import { TextInput } from '@wideset/react';

import { formatAmount, parseAmount } from './format';

type MoneyInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  /** Names the field when no label is linked to it (a table cell). */
  'aria-label'?: string;
  /** Right-aligns the figure, for a column of amounts. */
  alignEnd?: boolean;
  className?: string;
};

/**
 * An amount in US dollars: the sign as a fixed prefix, digits only, settled into an amount when
 * the field is left (149 → 149.00), so every price on the page reads the same way.
 */
export function MoneyInput({
  value,
  onChange,
  invalid,
  alignEnd,
  className,
  ...props
}: MoneyInputProps) {
  return (
    <TextInput
      size="sm"
      inputMode="decimal"
      autoComplete="off"
      placeholder="0.00"
      variant={invalid ? 'danger' : 'primary'}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/[^\d.,]/g, ''))}
      onBlur={() => parseAmount(value) >= 0 && onChange(formatAmount(parseAmount(value)))}
      className={className}
      {...props}
    >
      <TextInput.Prefix>$</TextInput.Prefix>
      <TextInput.Input className={alignEnd ? 'text-right tabular-nums' : 'tabular-nums'} />
    </TextInput>
  );
}
