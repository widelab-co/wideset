import { Card } from '@wideset/react';
import { type ReactNode, type Ref, useId } from 'react';

type ModuleProps = {
  title: string;
  /** One quiet action for the whole module (View all), only when there is something to view. */
  action?: ReactNode;
  /** Set while the data is on its way: the body then holds a skeleton. */
  busy?: boolean;
  /** The module itself, to move focus to when its content is replaced. */
  regionRef?: Ref<HTMLElement>;
  children: ReactNode;
};

/**
 * A module of the page: one frame and one header for every state, so only the body changes when
 * the data arrives, is missing or fails. The header keeps a button's height with or without one,
 * and the body stretches, so the modules of a grid stay the same size. The section is the region
 * that says it is busy and that takes focus; the card inside it only draws the frame.
 */
export function Module({ title, action, busy = false, regionRef, children }: ModuleProps) {
  const titleId = useId();

  return (
    <section
      ref={regionRef}
      aria-labelledby={titleId}
      aria-busy={busy}
      tabIndex={-1}
      className="rounded-ws-container-lg focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex"
    >
      <Card>
        <Card.Header>
          <div className="gap-ws-9 min-h-ws-14 flex items-center justify-between">
            <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
              {title}
            </h2>
            {action && <Card.Action>{action}</Card.Action>}
          </div>
        </Card.Header>
        {/* The cells pad themselves: the body keeps 4px so a table's first column lines up with
            the title. */}
        <div className="px-ws-3 pb-ws-3 flex flex-1 flex-col">
          {busy && (
            <p role="status" className="sr-only">
              Loading {title.toLowerCase()}
            </p>
          )}
          {children}
        </div>
      </Card>
    </section>
  );
}
