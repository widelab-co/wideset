import { Button, FormField, useToast } from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { TextLink } from './auth-card';
import { CodeInput } from './code-input';
import { CODE_LENGTH, DEMO_CODE, RESEND_COOLDOWN, ROUTES, SENT_TO } from './data';
import { TextButton } from './text-button';

/**
 * Seconds left before an action may run again, and a way to start the wait over. It counts to a
 * deadline rather than counting ticks, so a throttled background tab still shows the right time.
 */
function useCooldown(seconds: number) {
  const [until, setUntil] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  const counting = left > 0;
  useEffect(() => {
    if (!counting) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [counting]);
  const restart = () => {
    const start = Date.now();
    setNow(start);
    setUntil(start + seconds * 1000);
  };
  return [left, restart] as const;
}

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * Verifying the address given at sign-up: where the code went, with a way to correct it, the code
 * as six boxes that check themselves the moment the sixth digit is in (typed, pasted or filled by
 * the phone), and a new code once a cooldown has run out. A wrong code is said under the boxes,
 * which keep the digits to correct; the button stays for a short code and shows the check is
 * running. Nothing here talks to a server: the demo accepts only the code in `data.ts`.
 */
export function VerifyForm({ onVerified }: { onVerified: () => void }) {
  const id = useId();
  const { showToast } = useToast();
  const [error, setError] = useState<string>();
  const [checking, setChecking] = useState(false);
  const [left, restart] = useCooldown(RESEND_COOLDOWN);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const focusCode = () => document.getElementById(`${id}-code`)?.focus();

  const check = (code: string) => {
    if (checking) return;
    if (code.length < CODE_LENGTH) {
      setError(`Enter all ${CODE_LENGTH} digits of the code.`);
      focusCode();
      return;
    }
    setChecking(true);
    // Check the code here.
    timer.current = window.setTimeout(() => {
      setChecking(false);
      if (code === DEMO_CODE) {
        onVerified();
        return;
      }
      setError('That code didn’t work. Check the latest e-mail, or send a new code.');
      focusCode();
    }, 700);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    check(String(new FormData(event.currentTarget).get('code') ?? ''));
  };

  const resend = () => {
    // Send a new code here; the old one stops working.
    restart();
    setError(undefined);
    showToast({ content: `We sent a new code to ${SENT_TO}`, status: 'success' });
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
          Verify your e-mail
        </h1>
        <p className="typography-body-md text-ws-static-base">
          We sent a {CODE_LENGTH}-digit code to{' '}
          <span className="text-ws-static-strong">{SENT_TO}</span>.{' '}
          <TextLink href={ROUTES.changeEmail}>Change</TextLink>
        </p>
      </div>
      <FormField
        id={`${id}-code-label`}
        label="Verification code"
        htmlFor={`${id}-code`}
        errorText={error}
      >
        <CodeInput
          id={`${id}-code`}
          labelId={`${id}-code-label`}
          name="code"
          length={CODE_LENGTH}
          invalid={Boolean(error)}
          onChange={(code) => {
            setError(undefined);
            if (code.length === CODE_LENGTH) check(code);
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the screen has one task, and it starts here
          autoFocus
        />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={checking}>
        {checking ? 'Verifying…' : 'Verify e-mail'}
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        Didn’t get it? Check spam or{' '}
        {left > 0 ? (
          <>
            resend the code in <span className="tabular-nums">{clock(left)}</span>
          </>
        ) : (
          <TextButton onClick={resend}>resend the code</TextButton>
        )}
        .
      </p>
    </form>
  );
}
