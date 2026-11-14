import { Button, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Bringing someone along: one e-mail field and Send. It checks the address on Send, says what is
 * wrong under the field, and empties itself once the invitation is out, so a second one can follow.
 */
export function InviteColleague({ onInvite }: { onInvite: (email: string) => void }) {
  const fieldId = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const submit = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    const value = email.trim();
    if (!value) return setError('Enter their e-mail address.');
    if (!EMAIL.test(value)) return setError('Enter a full address, like name@company.com.');
    setError(undefined);
    setEmail('');
    onInvite(value);
  };

  return (
    <form noValidate onSubmit={submit} className="gap-ws-7 flex flex-col items-start">
      <FormField
        label="Their e-mail"
        htmlFor={fieldId}
        helperText="They get their own invitation from the hosts."
        errorText={error}
        className="w-full"
      >
        <TextInput
          id={fieldId}
          size="sm"
          type="email"
          autoComplete="off"
          placeholder="name@company.com"
          variant={error ? 'danger' : 'primary'}
          value={email}
          onChange={(changeEvent) => {
            setEmail(changeEvent.target.value);
            if (error) setError(undefined);
          }}
        />
      </FormField>
      <Button type="submit" variant="secondary" preset="border" size="sm">
        Send invitation
      </Button>
    </form>
  );
}
