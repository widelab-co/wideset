import { Button, FormField, Select, TextInput, Tile } from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { type BillingDetails as Details, countries, countryName } from './data';

type Field = keyof Details;

/** What a field's error says when it is left empty; the VAT number is the only optional one. */
const REQUIRED: Partial<Record<Field, string>> = {
  company: 'Enter the company name.',
  address: 'Enter the street address.',
  city: 'Enter the city.',
  postalCode: 'Enter the postal code.',
};

type BillingDetailsProps = {
  details: Details;
  onChange: (details: Details) => void;
};

/**
 * Who the invoice is made out to: read back on one tile, with Edit opening the fields in its
 * place. The fields work on a copy, so Cancel leaves the saved details alone; Save checks the
 * required ones and moves focus to the first that is empty. The VAT number decides the VAT on the
 * order, which is why it is asked here and not in settings.
 */
export function BillingDetails({ details, onChange }: BillingDetailsProps) {
  const id = useId();
  const [draft, setDraft] = useState<Details | null>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const wasEditing = useRef(false);
  const editing = draft !== null;

  // Focus follows the switch: into the first field when the fields open, back to Edit when they
  // close, so a keyboard user is never dropped at the top of the page.
  useEffect(() => {
    if (editing) firstField.current?.focus();
    else if (wasEditing.current) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  if (!draft) {
    return (
      <Tile
        title={details.company}
        description={`${details.address}, ${details.city} ${details.postalCode}, ${countryName(details.country)}. ${
          details.vatNumber ? `VAT ${details.vatNumber}` : 'No VAT number'
        }.`}
      >
        <Button
          size="sm"
          variant="secondary"
          preset="border"
          ref={editButton}
          aria-label="Edit billing details"
          onClick={() => setDraft(details)}
        >
          Edit
        </Button>
      </Tile>
    );
  }

  const close = () => {
    setDraft(null);
    setErrors({});
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const empty = (Object.keys(REQUIRED) as Field[]).filter((field) => !draft[field].trim());
    setErrors(Object.fromEntries(empty.map((field) => [field, REQUIRED[field]])));
    if (empty.length) return document.getElementById(`${id}-${empty[0]}`)?.focus();
    onChange(draft);
    close();
  };

  /** What every text field shares: its id, value, change handler and error look. */
  const text = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    size: 'sm' as const,
    required: field in REQUIRED,
    value: draft[field],
    variant: errors[field] ? ('danger' as const) : ('primary' as const),
    onChange: (event: { target: { value: string } }) => {
      setDraft({ ...draft, [field]: event.target.value });
      setErrors({ ...errors, [field]: undefined });
    },
  });

  return (
    <form noValidate onSubmit={save} className="gap-ws-11 flex flex-col">
      <div className="gap-ws-9 grid grid-cols-2 items-start">
        <FormField label="Company" htmlFor={`${id}-company`} errorText={errors.company}>
          <TextInput {...text('company')} ref={firstField} autoComplete="organization" />
        </FormField>
        <FormField
          label="VAT number"
          suffix="(optional)"
          htmlFor={`${id}-vatNumber`}
          helperText="With a VAT number, the VAT is reverse-charged."
        >
          <TextInput {...text('vatNumber')} autoComplete="off" placeholder="GB 123 4567 89" />
        </FormField>
      </div>
      <FormField label="Address" htmlFor={`${id}-address`} errorText={errors.address}>
        <TextInput {...text('address')} autoComplete="street-address" />
      </FormField>
      <div className="gap-ws-9 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)] items-start">
        <FormField label="City" htmlFor={`${id}-city`} errorText={errors.city}>
          <TextInput {...text('city')} autoComplete="address-level2" />
        </FormField>
        <FormField label="Postal code" htmlFor={`${id}-postalCode`} errorText={errors.postalCode}>
          <TextInput {...text('postalCode')} autoComplete="postal-code" />
        </FormField>
        <FormField label="Country" htmlFor={`${id}-country`}>
          <Select
            id={`${id}-country`}
            name="country"
            size="sm"
            className="w-full"
            options={countries}
            value={draft.country}
            onValueChange={(country) => setDraft({ ...draft, country })}
          />
        </FormField>
      </div>
      <div className="gap-ws-5 flex justify-end">
        <Button size="sm" variant="secondary" preset="ghost" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" size="sm" variant="secondary" preset="border">
          Save details
        </Button>
      </div>
    </form>
  );
}
