// TODO(custom): section title above its content; Wideset has no Section or PageSection.
import { type ReactNode, useId } from 'react';

/**
 * One quiet part of the side column: a 16px title, then what it holds, with no card. Who is going,
 * the hosts and inviting a colleague are side lists beside the event, so they stay plain; the
 * cards are kept for what the event is. The title names the region.
 */
export function SideSection({ title, children }: { title: string; children: ReactNode }) {
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
