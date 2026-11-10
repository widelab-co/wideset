import { RiGoogleFill, RiMicrosoftFill } from '@remixicon/react';
import { Button, useToast } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { TextLink } from './auth-card';
import { LINK_LIFETIME, RESEND_COOLDOWN, ROUTES, SENT_TO } from './data';
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
 * The card after a magic sign-in link was sent: where it went and how long it works, the two big
 * inboxes one click away, and resending once a cooldown has run out. There is no filled button:
 * the next step happens in the inbox.
 */
export function LinkSent() {
  const id = useId();
  const { showToast } = useToast();
  const [left, restart] = useCooldown(RESEND_COOLDOWN);

  const resend = () => {
    // Send the sign-in link again here.
    restart();
    showToast({ content: `We sent a new link to ${SENT_TO}`, status: 'success' });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-7 flex flex-col">
        <h1 id={`${id}-title`} className="typography-title-md text-ws-static-strong">
          Check your e-mail
        </h1>
        <p className="typography-body-md text-ws-static-base">
          We sent a sign-in link to <span className="text-ws-static-strong">{SENT_TO}</span>. It
          works for {LINK_LIFETIME}.
        </p>
      </div>
      <div className="gap-ws-5 grid sm:grid-cols-2">
        <Button asChild size="lg" variant="secondary" preset="border" className="w-full">
          <a href={ROUTES.gmail} target="_blank" rel="noreferrer">
            <Button.Icon icon={RiGoogleFill} />
            Open Gmail
          </a>
        </Button>
        <Button asChild size="lg" variant="secondary" preset="border" className="w-full">
          <a href={ROUTES.outlook} target="_blank" rel="noreferrer">
            <Button.Icon icon={RiMicrosoftFill} />
            Open Outlook
          </a>
        </Button>
      </div>
      <p className="typography-body-md text-ws-static-subtle">
        Didn’t get it? Check spam,{' '}
        {left > 0 ? (
          <>
            resend it in <span className="tabular-nums">{clock(left)}</span>
          </>
        ) : (
          <TextButton onClick={resend}>resend it</TextButton>
        )}{' '}
        or{' '}
        <span className="whitespace-nowrap">
          <TextLink href={ROUTES.magicLink}>use a different e-mail</TextLink>.
        </span>
      </p>
    </section>
  );
}
