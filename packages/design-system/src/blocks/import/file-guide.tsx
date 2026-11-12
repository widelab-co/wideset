import { Card } from '@wideset/react';
import { useId } from 'react';

import { Code } from './code';
import { fields, guide } from './data';
import { TextLink } from './text-link';

/**
 * Beside the steps: the columns Orbit reads, as the help article lists them, so the file can be
 * checked without leaving the page, and the article for the rest. A card like the step beside it,
 * so the row keeps one treatment; it holds plain text and no action, so the step stays the heavier.
 */
export function FileGuide() {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId}>
      <Card>
        <Card.Header>
          <div className="gap-ws-2 flex flex-col">
            <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
              Columns Orbit reads
            </h2>
            <p className="typography-body-md text-ws-static-subtle">
              Only name is required. Any other column can be matched to a field or left out.
            </p>
          </div>
        </Card.Header>
        {/* Card.Content keeps room on its right for a scrollbar; this puts the text back in line. */}
        <Card.Content contentClassName="pr-ws-6 gap-ws-11 flex flex-col">
          <dl className="gap-ws-7 flex flex-col">
            {fields.map((field) => (
              <div key={field.value} className="gap-ws-2 flex flex-col">
                <dt className="typography-label-sm">
                  <Code>{field.column}</Code>
                  {field.required && <span className="text-ws-static-subtle">, required</span>}
                </dt>
                <dd className="typography-label-sm text-ws-static-subtle">{field.holds}</dd>
              </div>
            ))}
          </dl>
          <p className="typography-body-md text-ws-static-subtle">
            More in <TextLink href={guide.href}>{guide.title}</TextLink>.
          </p>
        </Card.Content>
      </Card>
    </section>
  );
}
