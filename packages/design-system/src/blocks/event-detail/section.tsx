import { Card } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of the page in a bordered card: its 16px title in the header, then what it holds. The
 * title names the region. Every part of the page is drawn this way, the main column and the side
 * alike, so the page reads as one set of blocks.
 */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <section aria-labelledby={id}>
      <Card>
        <Card.Header>
          <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
            {title}
          </h2>
        </Card.Header>
        {/* Card.Content keeps room on its right for a scrollbar; this puts the text back in line. */}
        <Card.Content contentClassName="pr-ws-6">{children}</Card.Content>
      </Card>
    </section>
  );
}
