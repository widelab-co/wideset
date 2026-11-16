import { Button, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ResetFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
  /** Called once the address is well formed. */
  onSent: () => void;
};

/**
 * Asking for a reset link: one e-mail field and one button, in the sign-in card's rhythm. Submitting
 * checks only that the address is there and well formed; the answer never says whether an account
 * exists. Nothing here talks to a server.
 */
export function ResetForm({ email, onEmailChange, onSent }: ResetFormProps) {
  const id = useId();
  const [error, setError] = useState<string>();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const next = !value
      ? 'Enter the e-mail you sign in with.'
      : EMAIL.test(value)
        ? undefined
        : 'Enter an e-mail like name@company.com.';
    setError(next);
    if (next) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    // Send the reset link here.
    onSent();
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex w-full flex-col"
    >
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
          Reset your password
        </h1>
        <p className="typography-body-md text-ws-static-base">
          Enter the e-mail you use for Orbit and we’ll send you a reset link.
        </p>
      </div>
      <FormField label="E-mail" htmlFor={`${id}-email`} errorText={error}>
        <TextInput
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="e.g. maya@lumenstudio.co"
          required
          value={email}
          variant={error ? 'danger' : 'primary'}
          onChange={(event) => {
            onEmailChange(event.target.value);
            setError(undefined);
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
          autoFocus
        />
      </FormField>
      <Button type="submit" size="lg" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
