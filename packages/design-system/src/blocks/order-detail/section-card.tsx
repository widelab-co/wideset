import { Card } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of the order to work with, in a bordered Card: the title in the header, what it holds
 * under the line. The items and the delivery are what an order is handled by, so each gets its
 * own container; the side column's facts stay plain. The title names the region. The children
 * are the card's own parts: `Card.Content` for padded content, or a table straight in the card,
 * so its row lines run from edge to edge.
 */
export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <Card role="region" aria-labelledby={id}>
      <Card.Header>
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
      </Card.Header>
      {children}
    </Card>
  );
}
