import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { Button, Checkbox, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { TextLink } from './auth-card';
import { MIN_PASSWORD_LENGTH, ROUTES } from './data';

type Field = 'name' | 'email' | 'password' | 'terms';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creating an account, derived from Figma's sign-in form (Figma has no sign-up screen): the same
 * title, 40px fields, full-width 48px primary and gaps. The password can be shown while typing; the
 * terms are a checkbox, read on submit. Submitting names every problem at its field and moves focus
 * to the first. Nothing here talks to a server.
 */
export function SignUpForm() {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [shown, setShown] = useState(false);
  const clear = (field: Field) =>
    setErrors((all) => (all[field] ? { ...all, [field]: undefined } : all));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const next = {
      name: String(data.get('name') ?? '').trim() ? undefined : 'Enter your name.',
      email: !email
        ? 'Enter your work e-mail.'
        : EMAIL.test(email)
          ? undefined
          : 'Enter an e-mail like name@company.com.',
      password: !password
        ? 'Enter a password.'
        : password.length < MIN_PASSWORD_LENGTH
          ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined,
      terms: data.get('terms') ? undefined : 'Accept the terms to create an account.',
    };
    setErrors(next);
    const invalid = (Object.keys(next) as Field[]).find((field) => next[field]);
    if (invalid) {
      document.getElementById(`${id}-${invalid}`)?.focus();
      return;
    }
    // Create the account here, then open the app.
    window.location.assign(ROUTES.app);
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="gap-ws-12 flex w-full flex-col"
    >
      <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
        Create a Wideset account
      </h1>
      <FormField label="Full name" htmlFor={`${id}-name`} errorText={errors.name}>
        <TextInput
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          placeholder="e.g. Adam Smith"
          required
          variant={errors.name ? 'danger' : 'primary'}
          onChange={() => clear('name')}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
          autoFocus
        />
      </FormField>
      <FormField label="Work e-mail" htmlFor={`${id}-email`} errorText={errors.email}>
        <TextInput
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="e.g. hello@wideset.co"
          required
          variant={errors.email ? 'danger' : 'primary'}
          onChange={() => clear('email')}
        />
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
        Create account
      </Button>
    </form>
  );
}
