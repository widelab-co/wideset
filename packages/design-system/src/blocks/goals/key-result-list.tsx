// TODO(custom): key result checklist (rows that tick, the whole row the target); Wideset has no checklist or task row.
import { Checkbox, cn } from '@wideset/react';
import { useId } from 'react';

import { type KeyResult, type Measure, MEASURES } from './data';
import { formatMeasure } from './format';

type KeyResultListProps = {
  results: KeyResult[];
  /** Ids of the key results done. */
  done: string[];
  measure: Measure;
  /** The goal's name, so every checkbox says which goal it belongs to. */
  goal: string;
  /** The goal row's columns and padding: a key result's value stands under the goal's figure. */
  rowClassName: string;
  onDoneChange: (id: string, done: boolean) => void;
};

/**
 * A goal's key results, the task list's rows at a step smaller: the whole row is the checkbox's
 * label, one target with the hover across it. Done, a row goes quiet and struck through; ticking
 * or unticking one adds its value to the goal's figure or takes it away. A money goal shows what
 * each result is worth under the goal's figure; a counted goal counts each as one.
 */
export function KeyResultList({
  results,
  done,
  measure,
  goal,
  rowClassName,
  onDoneChange,
}: KeyResultListProps) {
  const id = useId();

  if (results.length === 0)
    return (
      <p className={cn(rowClassName, 'typography-body-md text-ws-static-subtle pb-ws-9')}>
        <span className="pl-ws-12 col-span-full">No key results yet.</span>
      </p>
    );

  return (
    <ul aria-label={`${goal}, key results`} className="pb-ws-5">
      {results.map((result) => {
        const checked = done.includes(result.id);
        const checkboxId = `${id}-${result.id}`;
        return (
          <li key={result.id}>
            <label
              htmlFor={checkboxId}
              className={cn(
                rowClassName,
                'h-ws-16 hover:bg-ws-dynamic-secondary-alpha-hover cursor-pointer items-center',
              )}
            >
              {/* Indented past the goal's chevron, so the box lines up with the goal's name. */}
              <span className="gap-ws-7 pl-ws-12 col-span-2 flex min-w-0 items-center">
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={(value) => onDoneChange(result.id, value === true)}
                />
                <span
                  className={cn(
                    'typography-label-sm min-w-0 truncate',
                    checked ? 'text-ws-static-subtle line-through' : 'text-ws-static-strong',
                  )}
                >
                  {result.title}
                </span>
              </span>
              {MEASURES[measure].money && (
                <span
                  className={cn(
                    'typography-label-sm tabular-nums',
                    checked ? 'text-ws-static-subtle' : 'text-ws-static-base',
                  )}
                >
                  {formatMeasure(measure, result.value)}
                </span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
