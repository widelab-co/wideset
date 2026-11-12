import { Button } from '@wideset/react';
import { useEffect, useId, useRef } from 'react';

import { ROUTES } from './data';

/**
 * The card once the new password is saved, in place of the form: what changed, what it did to other
 * sessions, and the one way on. Focus moves to the title, so a screen reader reads the new state.
 */
export function PasswordChanged() {
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => title.current?.focus(), []);

  return (
    <section aria-labelledby={`${id}-title`} className="gap-ws-12 flex w-full flex-col">
      <div className="gap-ws-5 mb-ws-5 flex flex-col">
        <h1
          ref={title}
          id={`${id}-title`}
          tabIndex={-1}
          className="typography-subtitle-lg text-ws-static-strong outline-none"
        >
          Password changed
        </h1>
        <p className="typography-body-md text-ws-static-base">
          You’re signed in. We signed you out of Orbit on your other devices.
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <a href={ROUTES.app}>Continue to Orbit</a>
      </Button>
    </section>
  );
}
