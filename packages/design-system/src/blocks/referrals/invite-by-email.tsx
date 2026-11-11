import { Button, FormField } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { FieldWithAction } from './field-with-action';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InviteByEmailProps = {
  /** Addresses that cannot be invited: the ones already invited and the sender's own. */
  taken: string[];
  onInvite: (email: string) => void;
  className?: string;
};

/**
 * Inviting one person by e-mail: a field and its button, so Enter sends too. The address is
 * checked on submit, never while it is typed; what is wrong is said under the field, which keeps
 * the value to be corrected and takes the focus back.
 */
export function InviteByEmail({ taken, onInvite, className }: InviteByEmailProps) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = email.trim().toLowerCase();
    const problem = !typed
      ? 'Enter an e-mail address.'
      : !EMAIL.test(typed)
        ? 'Enter an e-mail address like name@company.com.'
        : taken.includes(typed)
          ? `${typed} has already been invited.`
          : undefined;
    setError(problem);
    if (problem) return document.getElementById(id)?.focus();
    onInvite(typed);
    setEmail('');
  };

  return (
    <form noValidate onSubmit={send} className={className}>
      <FormField
        label="Invite by e-mail"
        htmlFor={id}
        helperText="We send your link with a short note in your name."
        errorText={error}
      >
        <FieldWithAction
          id={id}
          name="email"
          type="email"
          autoComplete="off"
          placeholder="name@company.com"
          variant={error ? 'danger' : 'primary'}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(undefined);
          }}
          action={
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              preset="border"
              className="shrink-0"
            >
              Send
            </Button>
          }
        />
      </FormField>
    </form>
  );
}
