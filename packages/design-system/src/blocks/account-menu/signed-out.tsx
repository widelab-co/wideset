// TODO(custom): a signed-out message (the mark, a title, a line, one action) on a raised card; Wideset has no empty or result state component.
import { Button } from '@wideset/react';
import { useEffect, useId, useRef } from 'react';

import { BrandMark } from './brand-mark';

/**
 * What the screen shows after Log out: no app around it, only a short card on the grey ground
 * saying who signed out of what, and the one way back. Signing in again is the undo, which is why
 * Log out asked nothing.
 */
export function SignedOut({
  email,
  workspace,
  onSignIn,
}: {
  email: string;
  workspace: string;
  onSignIn: () => void;
}) {
  const titleId = useId();
  const action = useRef<HTMLButtonElement>(null);

  // The row that had the focus is gone with the app: hand it to the way back.
  useEffect(() => action.current?.focus(), []);

  return (
    <main className="p-ws-12 flex flex-1 items-center justify-center">
      <section
        aria-labelledby={titleId}
        className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low gap-ws-12 p-ws-14 flex w-full max-w-[26rem] flex-col items-start"
      >
        <BrandMark className="size-ws-15" />
        <div className="gap-ws-3 flex flex-col">
          <h1 id={titleId} className="typography-title-md text-ws-static-strong">
            Signed out
          </h1>
          <p role="status" className="typography-body-md text-ws-static-subtle">
            You signed out of {workspace} as {email}.
          </p>
        </div>
        <Button ref={action} onClick={onSignIn}>
          Sign in again
        </Button>
      </section>
    </main>
  );
}
