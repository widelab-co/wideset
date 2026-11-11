// TODO(custom): section title above its content; Wideset has no Section or PageSection.
import { type ReactNode, useId } from 'react';

/** One part of the page: a 16px title, then what it holds. The title names the region. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-7 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        {title}
      </h2>
      {children}
    </section>
  );
}
