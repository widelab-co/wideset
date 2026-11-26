import { Button } from '@wideset/react';
import { useEffect, useId, useRef } from 'react';

import { ROUTES, TRUST_DAYS } from './data';

/**
 * The card once the code is accepted, in place of the form: signed in, whether this device is
 * remembered, and the one way on. Focus moves to the title, so a screen reader reads the new state.
 */
export function SignedIn({ trusted }: { trusted: boolean }) {
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
          className="typography-title-md text-ws-static-strong outline-none"
        >
          You’re signed in
        </h1>
        <p className="typography-body-md text-ws-static-base">
          {trusted
            ? `This device skips the code for the next ${TRUST_DAYS} days.`
            : 'Next time you sign in on this device, we’ll ask for a code again.'}
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <a href={ROUTES.app}>Continue to Orbit</a>
      </Button>
    </section>
  );
}
