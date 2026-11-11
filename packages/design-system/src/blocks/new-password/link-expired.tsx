import { Button } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { TextLink } from './auth-card';
import { ACCOUNT_EMAIL, LINK_LIFETIME, ROUTES } from './data';

/**
 * The card when the reset link has run out or was already used: why, and sending a new link to
 * the same address in one step, since the link already says whose account it is. Focus moves to
 * the title, so a screen reader reads the new state. Nothing here talks to a server.
 */
export function LinkExpired({ onSent }: { onSent: () => void }) {
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const [sending, setSending] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => {
    title.current?.focus();
    return () => window.clearTimeout(timer.current);
  }, []);

  const send = () => {
    setSending(true);
    // Send a new reset link here.
    timer.current = window.setTimeout(onSent, 600);
  };

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1
          ref={title}
          id={`${id}-title`}
          tabIndex={-1}
          className="typography-subtitle-lg text-ws-static-strong outline-none"
        >
          This link has expired
        </h1>
        <p className="typography-body-md text-ws-static-base">
          Reset links work for {LINK_LIFETIME}. We’ll send a new one to{' '}
          <span className="text-ws-static-strong">{ACCOUNT_EMAIL}</span>.
        </p>
      </div>
      <Button size="lg" className="w-full" disabled={sending} onClick={send}>
        {sending ? 'Sending…' : 'Send a new link'}
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        Remembered it? <TextLink href={ROUTES.signIn}>Back to sign in</TextLink>
      </p>
    </section>
  );
}
