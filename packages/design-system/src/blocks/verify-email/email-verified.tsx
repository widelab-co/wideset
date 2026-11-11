import { Button } from '@wideset/react';
import { useEffect, useId, useRef } from 'react';

import { ROUTES, SENT_TO } from './data';

/**
 * The card once the code is accepted, in place of the form: the address now verified and the one
 * way on. Focus moves to the title, so a screen reader reads the new state.
 */
export function EmailVerified() {
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
          E-mail verified
        </h1>
        <p className="typography-body-md text-ws-static-base">
          We confirmed <span className="text-ws-static-strong">{SENT_TO}</span>. Next, set up your
          workspace.
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <a href={ROUTES.next}>Continue</a>
      </Button>
    </section>
  );
}
