import { FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { samplePromo } from './data';

/**
 * The promo code field demonstrates an applied discount and a field error using one sample
 * code. Apply sits in the field's suffix so Enter works too.
 */
export function PromoCode({ onApply }: { onApply: () => void }) {
  const id = useId();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = code.trim();
    if (typed.toUpperCase() === samplePromo.code) onApply();
    else setError(typed ? `Try the sample code ${samplePromo.code}.` : 'Enter a promo code first.');
  };

  return (
    <form noValidate onSubmit={apply}>
      <FormField
        label="Promo code"
        htmlFor={id}
        helperText={`Sample code: ${samplePromo.code}`}
        errorText={error}
      >
        <TextInput
          id={id}
          name="promo"
          size="sm"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          variant={error ? 'danger' : 'primary'}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(undefined);
          }}
        >
          <TextInput.Input />
          <TextInput.Suffix>
            <TextInput.Button type="submit">Apply</TextInput.Button>
          </TextInput.Suffix>
        </TextInput>
      </FormField>
    </form>
  );
}
