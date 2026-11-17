import { Card } from '@wideset/react';
import { type ReactNode, useId } from 'react';

/**
 * One part of the form as a bordered card: a 16px title and one line saying what it is for in
 * the header, the fields under it. Each section is a container, so the form reads as a stack of
 * jobs to do, the same in both layouts. The title names the region.
 */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <Card role="region" aria-labelledby={id}>
      <Card.Header>
        <div className="gap-ws-2 flex flex-col">
          <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
            {title}
          </h2>
          <p className="typography-body-md text-ws-static-subtle">{description}</p>
        </div>
      </Card.Header>
      {/* Card.Content keeps 10px free on the right for a scrollbar; the padding gives it back, so
          the fields end where the header's line does. */}
      <Card.Content contentClassName="pr-ws-6">
        <div className="gap-ws-11 flex flex-col">{children}</div>
      </Card.Content>
    </Card>
  );
}
