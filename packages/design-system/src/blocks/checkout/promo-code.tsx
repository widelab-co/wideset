import { FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { findPromo, type Promo } from './data';

/**
 * The promo code field. Apply sits in the field's suffix and submits it, so Enter applies too. A
 * code that does not exist is named in the error under the field and stays in it to be corrected;
 * one that does is handed to the summary, which shows it as a line in place of this field.
 */
export function PromoCode({ onApply }: { onApply: (promo: Promo) => void }) {
  const id = useId();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = code.trim();
    const promo = findPromo(typed);
    if (promo) onApply(promo);
    else
      setError(
        typed
          ? `“${typed}” is not a valid code. Check it and try again.`
          : 'Enter a promo code first.',
      );
  };

  return (
    <form noValidate onSubmit={apply}>
      <FormField label="Promo code" htmlFor={id} errorText={error}>
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
