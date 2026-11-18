import { Checkbox, FormField, Select, TextInput } from '@wideset/react';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { CardBrand } from './card-brand';
import { COUNTRIES, PRODUCT, ROUTES } from './data';
import { TextLink } from './text-link';

export type PaymentValues = {
  number: string;
  expiry: string;
  cvc: string;
  country: string;
  zip: string;
  email: string;
  terms: boolean;
};

type Field = keyof PaymentValues;

/** Every field is required: what its error says when it is left empty. */
const REQUIRED: Record<Field, string> = {
  number: 'Enter the card number.',
  expiry: 'Enter the expiration date.',
  cvc: 'Enter the security code.',
  country: 'Choose a country.',
  zip: 'Enter the ZIP code.',
  email: 'Enter a billing e-mail.',
  terms: 'Accept the terms to continue.',
};

const filled = (value: string | boolean) =>
  typeof value === 'string' ? value.trim() !== '' : value;

type PaymentFormProps = {
  /** The form's id: the submit button sits in the modal's footer and points at it with `form`. */
  id: string;
  /** Called with the values once every field is filled. */
  onSubmit: (values: PaymentValues) => void;
};

/**
 * The payment form: a card, where it is billed and the consent to charge it. Fields are
 * controlled; submitting names every empty field at the field and moves focus to the first. It
 * draws no button of its own, so the modal's footer can hold the actions. Nothing here talks to a
 * payment provider: swap the card fields for the provider's own when you connect one.
 */
export function PaymentForm({ id, onSubmit }: PaymentFormProps) {
  const [values, setValues] = useState<PaymentValues>({
    number: '',
    expiry: '',
    cvc: '',
    country: COUNTRIES[0].value,
    zip: '',
    email: '',
    terms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const set = <F extends Field>(field: F, value: PaymentValues[F]) => {
    setValues((all) => ({ ...all, [field]: value }));
    setErrors((all) => ({ ...all, [field]: undefined }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const empty = (Object.keys(REQUIRED) as Field[]).filter((field) => !filled(values[field]));
    setErrors(Object.fromEntries(empty.map((field) => [field, REQUIRED[field]])));
    if (empty.length) document.getElementById(`${id}-${empty[0]}`)?.focus();
    else onSubmit(values);
  };

  /** What every text field shares: its id, value, change handler and error look. */
  const text = (field: Exclude<Field, 'country' | 'terms'>) => ({
    id: `${id}-${field}`,
    name: field,
    required: true,
    value: values[field],
    variant: errors[field] ? ('danger' as const) : ('primary' as const),
    onChange: (event: ChangeEvent<HTMLInputElement>) => set(field, event.target.value),
  });

  return (
    <form id={id} noValidate onSubmit={submit} className="gap-ws-11 flex flex-col">
      <FormField label="Card number" htmlFor={`${id}-number`} errorText={errors.number}>
        <TextInput
          {...text('number')}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
        >
          <TextInput.Input />
          <TextInput.Suffix>
            <CardBrand />
          </TextInput.Suffix>
        </TextInput>
      </FormField>
      <div className="gap-ws-9 grid grid-cols-2">
        <FormField label="Expiration date" htmlFor={`${id}-expiry`} errorText={errors.expiry}>
          <TextInput
            {...text('expiry')}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
          />
        </FormField>
        <FormField label="Security code" htmlFor={`${id}-cvc`} errorText={errors.cvc}>
          <TextInput {...text('cvc')} inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" />
        </FormField>
      </div>
      <div className="gap-ws-9 grid grid-cols-2">
        <FormField
          label="Country"
          htmlFor={`${id}-country`}
          tooltip="Where the card is billed. It sets the tax on your invoices."
          errorText={errors.country}
        >
          <Select
            id={`${id}-country`}
            name="country"
            className="w-full"
            options={COUNTRIES}
            placeholder="Choose a country"
            clearable
            required
            value={values.country}
            onValueChange={(value) => set('country', value)}
            variant={errors.country ? 'danger' : 'primary'}
          />
        </FormField>
        <FormField label="ZIP code" htmlFor={`${id}-zip`} errorText={errors.zip}>
          <TextInput {...text('zip')} autoComplete="postal-code" placeholder="12345" />
        </FormField>
      </div>
      <FormField label="Billing email" htmlFor={`${id}-email`} errorText={errors.email}>
        <TextInput
          {...text('email')}
          type="email"
          autoComplete="email"
          placeholder="e.g. finance@lumenstudio.co"
        />
      </FormField>
      {/*
        FormField draws the consent's error under the box. The checkbox carries its own label, so
        the field's label row is empty: `gap-0` takes back the gap it would leave above the box.
      */}
      <FormField label={null} errorText={errors.terms} className="gap-0">
        <Checkbox
          id={`${id}-terms`}
          name="terms"
          required
          checked={values.terms}
          onCheckedChange={(checked) => set('terms', checked === true)}
          variant={errors.terms ? 'danger' : 'primary'}
        >
          <Checkbox.Label>
            I agree to the {PRODUCT} <TextLink href={ROUTES.terms}>Terms &amp; Conditions</TextLink>
          </Checkbox.Label>
        </Checkbox>
      </FormField>
    </form>
  );
}
