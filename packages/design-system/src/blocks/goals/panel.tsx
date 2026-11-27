import { Card } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of the page in a bordered card: a 16px title in the header names the region, the
 * content under it. A `flush` panel holds a table, which runs edge to edge and pads its own
 * cells.
 */
export function Panel({
  title,
  flush,
  className,
  children,
}: {
  title: string;
  flush?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <Card role="region" aria-labelledby={id} className={className}>
      <Card.Header>
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
      </Card.Header>
      {/* A table goes straight in the card: Card.Content's scrollbar gutter would stop its lines
          short. Anything else keeps the content's padding, with the gutter given back. */}
      {flush ? children : <Card.Content contentClassName="pr-ws-6">{children}</Card.Content>}
    </Card>
  );
}
