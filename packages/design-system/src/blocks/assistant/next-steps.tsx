// TODO(custom): next steps as checklist rows (a checkbox, the step, its day); Wideset has no checklist or task row.
import { Checkbox, cn } from '@wideset/react';
import { useId, useState } from 'react';

import type { NextStep } from './data';
import { formatDay } from './format';

/**
 * What happens next on the deal, soonest first. A row does one thing, so the whole row is its
 * checkbox's label; ticked, the step goes quiet and struck through.
 */
export function NextSteps({ steps }: { steps: NextStep[] }) {
  const id = useId();
  const [done, setDone] = useState<string[]>([]);

  return (
    <ul className="border-ws-static-base border-t">
      {steps.map((step) => {
        const isDone = done.includes(step.id);
        const checkboxId = `${id}-${step.id}`;
        return (
          <li key={step.id} className="border-ws-static-base border-b">
            <label
              htmlFor={checkboxId}
              className="h-ws-17 gap-ws-7 px-ws-5 hover:bg-ws-dynamic-secondary-alpha-hover flex cursor-pointer items-center"
            >
              <Checkbox
                id={checkboxId}
                checked={isDone}
                onCheckedChange={(checked) =>
                  setDone((current) =>
                    checked === true
                      ? [...current, step.id]
                      : current.filter((item) => item !== step.id),
                  )
                }
                aria-labelledby={`${checkboxId}-title`}
              />
              <span
                id={`${checkboxId}-title`}
                className={cn(
                  'min-w-0 flex-1 truncate',
                  isDone
                    ? 'typography-label-sm text-ws-static-subtle line-through'
                    : 'typography-label-sm text-ws-static-strong',
                )}
              >
                {step.title}
              </span>
              <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
                {formatDay(step.due)}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
