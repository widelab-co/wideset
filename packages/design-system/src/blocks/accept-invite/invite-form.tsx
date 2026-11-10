import { RiEyeLine, RiEyeOffLine, RiLockLine } from '@remixicon/react';
import { Avatar, Button, Checkbox, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { TextLink } from './auth-card';
import { INVITATION, MIN_PASSWORD_LENGTH, ROUTES } from './data';

type Field = 'name' | 'password' | 'terms';

/**
 * Accepting an invitation by creating an account: who invited you and to what, then the sign-up
 * form without the e-mail, which the invitation fixes (shown, read-only, so a password manager
 * saves it with the new password). Submitting names every problem at its field and moves focus to
 * the first. Someone who already has an account signs in from the footer instead. Nothing here
 * talks to a server.
 */
export function InviteForm() {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [shown, setShown] = useState(false);
  const clear = (field: Field) =>
    setErrors((all) => (all[field] ? { ...all, [field]: undefined } : all));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get('password') ?? '');
    const next = {
      name: String(data.get('name') ?? '').trim() ? undefined : 'Enter your name.',
      password: !password
        ? 'Enter a password.'
        : password.length < MIN_PASSWORD_LENGTH
          ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined,
      terms: data.get('terms') ? undefined : 'Accept the terms to join.',
    };
    setErrors(next);
    const invalid = (Object.keys(next) as Field[]).find((field) => next[field]);
    if (invalid) {
      document.getElementById(`${id}-${invalid}`)?.focus();
      return;
    }
    // Create the account and accept the invitation here, then open the workspace.
    window.location.assign(ROUTES.app);
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex w-full flex-col"
    >
      <div className="gap-ws-7 flex flex-col">
        <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
          Join {INVITATION.workspace}
        </h1>
        <div className="gap-ws-5 flex items-center">
          <Avatar initials={INVITATION.invitedBy.initials} />
          <p className="typography-body-md text-ws-static-base">
            <span className="text-ws-static-strong">{INVITATION.invitedBy.name}</span> invited you
            to Orbit as an {INVITATION.role}.
          </p>
        </div>
      </div>
      <FormField label="Full name" htmlFor={`${id}-name`} errorText={errors.name}>
        <TextInput
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          placeholder="e.g. Daniel Ortiz"
          required
          variant={errors.name ? 'danger' : 'primary'}
          onChange={() => clear('name')}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
          autoFocus
        />
      </FormField>
      <FormField
        label="Work e-mail"
        htmlFor={`${id}-email`}
        helperText="The invitation was sent to this address."
      >
        <TextInput
          id={`${id}-email`}
          name="email"
          type="email"
          // The account's username: a password manager saves the new password with it.
          autoComplete="username"
          value={INVITATION.email}
          readOnly
        >
          <TextInput.Input />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiLockLine} />
          </TextInput.Suffix>
        </TextInput>
      </FormField>
      <FormField
        label="Password"
        htmlFor={`${id}-password`}
        helperText={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        errorText={errors.password}
      >
        <TextInput
          id={`${id}-password`}
          name="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          placeholder="Create a password"
          required
          variant={errors.password ? 'danger' : 'primary'}
          onChange={() => clear('password')}
        >
          <TextInput.Input type={shown ? 'text' : 'password'} />
          <TextInput.Suffix inner>
            <TextInput.IconButton
              icon={shown ? RiEyeOffLine : RiEyeLine}
              aria-label={shown ? 'Hide password' : 'Show password'}
              onClick={() => setShown((value) => !value)}
            />
          </TextInput.Suffix>
        </TextInput>
      </FormField>
      {/* FormField draws the terms' error under the box; the checkbox carries its own label. */}
      <FormField label={null} errorText={errors.terms}>
        <Checkbox
          id={`${id}-terms`}
          name="terms"
          variant={errors.terms ? 'danger' : 'primary'}
          onCheckedChange={() => clear('terms')}
        >
          <Checkbox.Label>
            I agree to the <TextLink href={ROUTES.terms}>Terms of Service</TextLink> and{' '}
            <TextLink href={ROUTES.privacy}>Privacy Policy</TextLink>
          </Checkbox.Label>
        </Checkbox>
      </FormField>
      <Button type="submit" size="lg" className="w-full">
        Accept invitation
      </Button>
    </form>
  );
}
