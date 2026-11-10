import { RiGoogleFill, RiMicrosoftFill } from '@remixicon/react';
import { Button, Divider, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { TextLink } from './auth-card';
import { ROUTES, SSO_DOMAINS } from './data';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Signing in through an identity provider. Google and Microsoft are one click each, drawn as
 * secondary buttons; the work e-mail is the one form, and its button is the only filled one. As
 * soon as the address is complete the domain is looked up: a known one names the workspace and its
 * provider under the field and on the button. An unknown domain is an error only on submit.
 */
export function SsoForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const value = email.trim();
  const domain = value.split('@')[1]?.toLowerCase() ?? '';
  const connection = EMAIL.test(value) ? SSO_DOMAINS[domain] : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = !value
      ? 'Enter your work e-mail.'
      : !EMAIL.test(value)
        ? 'Enter an e-mail like name@company.com.'
        : connection
          ? undefined
          : `No single sign-on is set up for ${domain}. Use Google, Microsoft or a password.`;
    setError(next);
    if (next || !connection) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    window.location.assign(connection.href);
  };

  return (
    <div className="gap-ws-12 flex w-full flex-col">
      <h1 className="typography-title-md text-ws-static-strong">Sign in to Orbit</h1>
      <div className="gap-ws-5 flex flex-col">
        <Button
          size="lg"
          variant="secondary"
          preset="border"
          className="w-full"
          onClick={() => window.location.assign(ROUTES.google)}
        >
          <Button.Icon icon={RiGoogleFill} />
          Continue with Google
        </Button>
        <Button
          size="lg"
          variant="secondary"
          preset="border"
          className="w-full"
          onClick={() => window.location.assign(ROUTES.microsoft)}
        >
          <Button.Icon icon={RiMicrosoftFill} />
          Continue with Microsoft
        </Button>
      </div>
      <Divider text="or" />
      <form
        noValidate
        onSubmit={submit}
        aria-label="Single sign-on"
        className="gap-ws-12 flex flex-col"
      >
        <FormField
          label="Work e-mail"
          htmlFor={`${id}-email`}
          helperText={
            connection
              ? `${connection.workspace} uses ${connection.provider}: continue to sign in.`
              : 'We’ll find your company’s sign-in page.'
          }
          errorText={error}
        >
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
              setEmail(event.target.value);
              setError(undefined);
            }}
          />
        </FormField>
        <Button type="submit" size="lg" className="w-full">
          {connection ? `Continue with ${connection.provider}` : 'Continue with SSO'}
        </Button>
      </form>
      <p className="typography-body-md text-ws-static-subtle">
        Not using single sign-on? <TextLink href={ROUTES.signIn}>Sign in with a password</TextLink>
      </p>
    </div>
  );
}
