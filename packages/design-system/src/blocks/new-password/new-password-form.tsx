import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { Button, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { ACCOUNT_EMAIL, LINK_LIFETIME, MIN_PASSWORD_LENGTH } from './data';
import { PasswordRules } from './password-rules';
import { TextButton } from './text-button';

type NewPasswordFormProps = {
  /** Called once the new password is saved. */
  onSaved: () => void;
  /** Shows the expired-link state, the answer a server gives for a link that ran out. */
  onExpired: () => void;
};

/** The rules, in the order the checklist shows them. */
const rulesFor = (password: string) => {
  const name = ACCOUNT_EMAIL.split('@')[0].toLowerCase();
  return [
    {
      label: `At least ${MIN_PASSWORD_LENGTH} characters`,
      met: password.length >= MIN_PASSWORD_LENGTH,
    },
    { label: 'A number', met: /\d/.test(password) },
    // Empty is not "not your e-mail" yet: a rule ticks only once something meets it.
    { label: 'Not your e-mail', met: password !== '' && !password.toLowerCase().includes(name) },
  ];
};

/**
 * Choosing a new password after opening a reset link: the password with its rules ticking as you
 * type, a confirmation, and one button that stays disabled until the rules are met and the two
 * match, so the checklist is the only error message the password needs. One toggle shows both
 * fields. A mismatch is said under the confirmation once it is as long as the password or left.
 * The account's address rides along hidden, so a password manager saves the new password with it.
 * Nothing here talks to a server: a timeout stands in for the request.
 */
export function NewPasswordForm({ onSaved, onExpired }: NewPasswordFormProps) {
  const id = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [left, setLeft] = useState(false);
  const [shown, setShown] = useState(false);
  const [saving, setSaving] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const rules = rulesFor(password);
  const matches = confirm === password;
  const mismatch = confirm !== '' && !matches && (left || confirm.length >= password.length);
  const ready = rules.every((rule) => rule.met) && matches;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready || saving) return;
    setSaving(true);
    // Save the password with the link's token here; an expired token answers with onExpired().
    timer.current = window.setTimeout(onSaved, 800);
  };

  const type = shown ? 'text' : 'password';

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex w-full flex-col"
    >
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
          Choose a new password
        </h1>
        <p className="typography-body-md text-ws-static-base">
          For <span className="text-ws-static-strong">{ACCOUNT_EMAIL}</span>. You’ll be signed in
          once it’s saved.
        </p>
      </div>
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={ACCOUNT_EMAIL}
        readOnly
        hidden
      />
      <FormField label="New password" htmlFor={`${id}-password`}>
        <>
          <TextInput
            id={`${id}-password`}
            name="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby={`${id}-rules`}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
            autoFocus
          >
            <TextInput.Input type={type} />
            <TextInput.Suffix inner>
              <TextInput.IconButton
                icon={shown ? RiEyeOffLine : RiEyeLine}
                aria-label={shown ? 'Hide passwords' : 'Show passwords'}
                aria-pressed={shown}
                onClick={() => setShown((value) => !value)}
              />
            </TextInput.Suffix>
          </TextInput>
          <PasswordRules id={`${id}-rules`} rules={rules} />
        </>
      </FormField>
      <FormField
        label="Confirm password"
        htmlFor={`${id}-confirm`}
        errorText={mismatch ? 'The passwords don’t match.' : undefined}
      >
        <TextInput
          id={`${id}-confirm`}
          name="confirm"
          autoComplete="new-password"
          required
          value={confirm}
          variant={mismatch ? 'danger' : 'primary'}
          onChange={(event) => setConfirm(event.target.value)}
          onBlur={() => setLeft(true)}
        >
          <TextInput.Input type={type} />
        </TextInput>
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={!ready || saving}>
        {saving ? 'Saving…' : 'Save and sign in'}
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        This link works once, for {LINK_LIFETIME}.{' '}
        <TextButton onClick={onExpired}>Link expired?</TextButton>
      </p>
    </form>
  );
}
