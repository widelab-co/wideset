import { RiArrowRightLine } from '@remixicon/react';
import { ActionTile, Button } from '@wideset/react';
import { useId } from 'react';

import { nextSteps } from './data';

/**
 * What to do next: the few things the new plan makes worth doing, each a tile that is its own one
 * action and ends in an arrow because it goes somewhere (no icon badges: they would add a colour
 * per tile), then the way on, the page's one filled button.
 */
export function NextSteps() {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-9 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        What to do next
      </h2>
      <ul className="gap-ws-5 flex flex-col">
        {nextSteps.map((step) => (
          <li key={step.id}>
            <ActionTile
              title={step.title}
              description={step.description}
              icon={RiArrowRightLine}
              href={step.href}
            />
          </li>
        ))}
      </ul>
      <Button size="sm" asChild className="mt-ws-5 self-start">
        <a href="#home">Go to workspace</a>
      </Button>
    </section>
  );
}
