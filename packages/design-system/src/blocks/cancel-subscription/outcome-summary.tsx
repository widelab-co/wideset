import { Button } from '@wideset/react';

import { type Outcome, ROUTES } from './data';
import { FactsList } from './facts-list';

/**
 * The result, shown where the steps were: what happens when, as the same rows the first step
 * used, then the way to take it back and the way on. Undo is a real button beside the filled
 * one, not a link in small print: the plan runs to the end of the period, so there is time to
 * change one's mind.
 */
export function OutcomeSummary({ outcome, onUndo }: { outcome: Outcome; onUndo: () => void }) {
  return (
    <div className="gap-ws-12 flex flex-col">
      <FactsList facts={outcome.facts} />
      <div className="gap-ws-5 flex flex-wrap justify-end">
        <Button size="sm" variant="secondary" preset="border" onClick={onUndo}>
          {outcome.undo}
        </Button>
        <Button size="sm" asChild>
          <a href={ROUTES.billing}>Back to billing</a>
        </Button>
      </div>
    </div>
  );
}
