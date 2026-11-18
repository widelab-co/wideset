import { Button, useToast } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { ACCOUNT_EMAIL, LINK_LIFETIME, RESEND_COOLDOWN, ROUTES } from './data';
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
 * The card after a new reset link was sent from the expired one, as the forgot-password screen
 * says it: where it went, how long it works, and resending once a cooldown has run out. Focus
 * moves to the title, so a screen reader reads the new state.
 */
export function LinkSent() {
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const { showToast } = useToast();
  const [left, restart] = useCooldown(RESEND_COOLDOWN);

  useEffect(() => title.current?.focus(), []);

  const resend = () => {
    // Send the reset link again here.
    restart();
    showToast({ content: `We sent a new link to ${ACCOUNT_EMAIL}`, status: 'success' });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1
          ref={title}
          id={`${id}-title`}
          tabIndex={-1}
          className="typography-title-md text-ws-static-strong outline-none"
        >
          Check your e-mail
        </h1>
        <p className="typography-body-md text-ws-static-base">
          We sent a new link to <span className="text-ws-static-strong">{ACCOUNT_EMAIL}</span>. It
          works for {LINK_LIFETIME}.
        </p>
      </div>
      <Button asChild size="lg" variant="secondary" preset="border" className="w-full">
        <a href={ROUTES.signIn}>Back to sign in</a>
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        Didn’t get it? Check spam or{' '}
        {left > 0 ? (
          <>
            resend it in <span className="tabular-nums">{clock(left)}</span>
          </>
        ) : (
          <TextButton onClick={resend}>resend it</TextButton>
        )}
        .
      </p>
    </section>
  );
}
