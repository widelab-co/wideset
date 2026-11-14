import { Button, Checkbox, FormField, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { CodeInput } from './code-input';
import { CODE_LENGTH, DEMO_BACKUP_CODE, DEMO_CODE, ROUTES, TRUST_DAYS } from './data';
import { TextButton } from './text-button';

type Method = 'app' | 'backup';

const normalise = (code: string) => code.replace(/[\s-]/g, '').toUpperCase();

/**
 * The second sign-in step: the code from an authenticator app, or one of the backup codes saved
 * when two-factor sign-in was turned on. A short code names what is missing; a wrong one is said
 * under the boxes, which turn red and keep the digits to correct. Nothing here talks to a server:
 * the demo accepts only the codes in `data.ts`.
 */
export function TwoFactorForm() {
  const id = useId();
  const [method, setMethod] = useState<Method>('app');
  const [error, setError] = useState<string>();
  const app = method === 'app';

  const switchTo = (next: Method) => {
    setError(undefined);
    setMethod(next);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let next: string | undefined;
    if (app) {
      const code = String(data.get('code') ?? '');
      next =
        code.length < CODE_LENGTH
          ? `Enter all ${CODE_LENGTH} digits of the code.`
          : code === DEMO_CODE
            ? undefined
            : 'That code didn’t work. Enter the one your app shows now.';
    } else {
      const code = normalise(String(data.get('backup') ?? ''));
      next = !code
        ? 'Enter one of your backup codes.'
        : code === normalise(DEMO_BACKUP_CODE)
          ? undefined
          : 'That backup code didn’t work. Check it, or try another one.';
    }
    setError(next);
    if (next) {
      document.getElementById(`${id}-${method}`)?.focus();
      return;
    }
    // Check the code here, remember the device if asked, then open the app.
    window.location.assign(ROUTES.app);
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
          {app ? 'Enter your code' : 'Use a backup code'}
        </h1>
        <p className="typography-body-md text-ws-static-base">
          {app
            ? `Open your authenticator app and enter the ${CODE_LENGTH}-digit code for Orbit.`
            : 'Enter one of the backup codes you saved. Each one works only once.'}
        </p>
      </div>
      {app ? (
        <FormField
          id={`${id}-app-label`}
          label="Authentication code"
          htmlFor={`${id}-app`}
          errorText={error}
        >
          <CodeInput
            id={`${id}-app`}
            labelId={`${id}-app-label`}
            name="code"
            length={CODE_LENGTH}
            invalid={Boolean(error)}
            onChange={() => setError(undefined)}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
            autoFocus
          />
        </FormField>
      ) : (
        <FormField label="Backup code" htmlFor={`${id}-backup`} errorText={error}>
          <TextInput
            id={`${id}-backup`}
            name="backup"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="e.g. 4F7A-2KD9"
            required
            variant={error ? 'danger' : 'primary'}
            onChange={() => setError(undefined)}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the person asked for this field
            autoFocus
          />
        </FormField>
      )}
      <Checkbox name="trust" label={`Trust this device for ${TRUST_DAYS} days`} />
      <Button type="submit" size="lg" className="w-full">
        Verify code
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        {app ? 'Can’t use your app? ' : 'Have your phone? '}
        <TextButton onClick={() => switchTo(app ? 'backup' : 'app')}>
          {app ? 'Use a backup code' : 'Use your authenticator app'}
        </TextButton>
      </p>
    </form>
  );
}
