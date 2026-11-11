import { Button } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { AccountList } from './account-list';
import { type Account, ACCOUNTS, ROUTES } from './data';

/**
 * The card after signing out: that it worked, the accounts still signed in on this device to go
 * straight back in as, signing in as someone else, and a note for a shared computer. There is no
 * filled button: none of the ways on is the one to push. Continuing shows that account busy for a
 * moment while it opens; nothing here talks to a server.
 */
export function SignedOutNotice() {
  const id = useId();
  const [busy, setBusy] = useState<string>();
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const continueAs = (account: Account) => {
    if (busy) return;
    setBusy(account.id);
    // Switch to this account's session here, then open the app.
    timer.current = window.setTimeout(() => window.location.assign(ROUTES.app), 900);
  };

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1 id={`${id}-title`} className="typography-subtitle-lg text-ws-static-strong">
          You are signed out
        </h1>
        <p className="typography-body-md text-ws-static-base">
          These accounts are still signed in on this device.
        </p>
      </div>
      <AccountList accounts={ACCOUNTS} busy={busy} onContinue={continueAs} />
      <Button asChild size="lg" variant="secondary" preset="border" className="w-full">
        <a href={ROUTES.signIn}>Sign in with another account</a>
      </Button>
      <p className="typography-body-md text-ws-static-subtle">
        Close this window if you are on a shared computer.
      </p>
    </section>
  );
}
