import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiMastercardLine,
  RiVisaLine,
} from '@remixicon/react';
import { FormField, TextInput } from '@wideset/react';

import {
  type CardBrand,
  cardBrand,
  type CardErrors,
  type CardValues,
  formatCardCvc,
  formatCardExpiry,
  formatCardNumber,
} from './card';

const BRAND_ICON: Record<CardBrand, RemixiconComponentType> = {
  visa: RiVisaLine,
  mastercard: RiMastercardLine,
  card: RiBankCardLine,
};

type CardFieldsProps = {
  /** Prefix of the fields' ids (`<id>-number`), so the screen can focus the first one in error. */
  id: string;
  values: CardValues;
  errors: CardErrors;
  onChange: (values: CardValues) => void;
};

/**
 * A card typed in by hand: its number, expiry and security code, each shaped as it is typed. The
 * number's suffix shows the brand it starts as. The screen holds the values and the errors, which
 * it sets when paying. Nothing here talks to a payment provider.
 */
export function CardFields({ id, values, errors, onChange }: CardFieldsProps) {
  return (
    <div className="gap-ws-9 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-start">
      <FormField label="Card number" htmlFor={`${id}-number`} errorText={errors.number}>
        <TextInput
          id={`${id}-number`}
          size="sm"
          required
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
          variant={errors.number ? 'danger' : 'primary'}
          value={values.number}
          onChange={(event) =>
            onChange({ ...values, number: formatCardNumber(event.target.value) })
          }
        >
          <TextInput.Input />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={BRAND_ICON[cardBrand(values.number)]} />
          </TextInput.Suffix>
        </TextInput>
      </FormField>
      <FormField label="Expiry date" htmlFor={`${id}-expiry`} errorText={errors.expiry}>
        <TextInput
          id={`${id}-expiry`}
          size="sm"
          required
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM / YY"
          variant={errors.expiry ? 'danger' : 'primary'}
          value={values.expiry}
          onChange={(event) =>
            onChange({ ...values, expiry: formatCardExpiry(event.target.value) })
          }
        />
      </FormField>
      <FormField label="Security code" htmlFor={`${id}-cvc`} errorText={errors.cvc}>
        <TextInput
          id={`${id}-cvc`}
          size="sm"
          required
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVC"
          variant={errors.cvc ? 'danger' : 'primary'}
          value={values.cvc}
          onChange={(event) => onChange({ ...values, cvc: formatCardCvc(event.target.value) })}
        />
      </FormField>
    </div>
  );
}
