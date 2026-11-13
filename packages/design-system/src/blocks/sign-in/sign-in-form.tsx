import { Button, Checkbox, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { TextLink } from './auth-card';
import { ROUTES } from './data';

/*
  The sign-in form. The two sign-in starting points (sign-in, sign-in-card) carry byte-identical
  copies of this file; src/__tests__/blocks.test.tsx keeps them the same.
*/

type Field = 'username' | 'password';

/**
 * Figma's sign-in form. Submitting checks only that both fields are filled, names the empty one
 * and moves focus to it; whether the pair is right is the server's answer, and that error never
 * says which part was wrong. Nothing here talks to a server.
 */
export function SignInForm() {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const clear = (field: Field) =>
    setErrors((all) => (all[field] ? { ...all, [field]: undefined } : all));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      username: String(data.get('username') ?? '').trim()
        ? undefined
        : 'Enter your e-mail or username.',
      password: data.get('password') ? undefined : 'Enter your password.',
    };
    setErrors(next);
    const invalid = (Object.keys(next) as Field[]).find((field) => next[field]);
    if (invalid) {
      document.getElementById(`${id}-${invalid}`)?.focus();
      return;
    }
    // Sign the person in here, then open the app.
    window.location.assign(ROUTES.app);
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex w-full flex-col"
    >
      <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong mb-ws-5">
        Sign in to Wideset
      </h1>
      <FormField label="E-mail or username" htmlFor={`${id}-username`} errorText={errors.username}>
        <TextInput
          id={`${id}-username`}
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="e.g. hello@wideset.co"
          required
          variant={errors.username ? 'danger' : 'primary'}
          onChange={() => clear('username')}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
          autoFocus
        />
      </FormField>
      <FormField label="Password" htmlFor={`${id}-password`} errorText={errors.password}>
        <TextInput
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          variant={errors.password ? 'danger' : 'primary'}
          onChange={() => clear('password')}
        />
      </FormField>
      <Checkbox name="remember" label="Keep me signed in" />
      <Button type="submit" size="lg" className="w-full">
        Sign in
      </Button>
      {/* Figma breaks the line after "or" with a 363px measure. */}
      <p className="typography-body-md text-ws-static-subtle max-w-[22.6875rem]">
        Trouble with signing in? Request a magic{' '}
        <TextLink href={ROUTES.magicLink}>sign in link</TextLink> or{' '}
        <TextLink href={ROUTES.resetPassword}>reset your password</TextLink>
      </p>
    </form>
  );
}
