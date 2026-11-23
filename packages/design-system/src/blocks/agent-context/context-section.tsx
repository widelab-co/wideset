// TODO(custom): a titled section of a popover, set off from the one above by a line; Popup has a header, a content and a footer, no sections.
import { type ReactNode, useId } from 'react';

type ContextSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * One part of the session's environment: a quiet title over its rows. Sections follow one
 * another with a line between them, edge to edge, and every one keeps the popover's 20px inset,
 * so the titles, the rows and the meter share one left edge.
 */
export function ContextSection({ title, children }: ContextSectionProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="border-ws-static-base gap-ws-5 px-ws-11 py-ws-9 flex flex-col border-t first:border-t-0"
    >
      <h3 id={titleId} className="typography-label-sm text-ws-static-subtle">
        {title}
      </h3>
      {children}
    </section>
  );
}
