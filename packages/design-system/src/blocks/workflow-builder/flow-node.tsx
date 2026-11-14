// TODO(custom): a step on the workflow canvas (type icon, kind, what it does, a problem mark); Wideset has no node or canvas item.
import { RiErrorWarningFill } from '@remixicon/react';
import { cn } from '@wideset/react';

import { type Step, STEP_TYPES } from './data';
import { isComplete } from './flow';

/**
 * One step as a node: one button, so Tab walks the steps in order and Enter selects. Every kind is
 * drawn the same way and only the icon tells them apart; the brand colour marks the selected node,
 * and a step that cannot run yet carries a small negative mark, nothing louder.
 */
export function FlowNode({
  step,
  selected,
  onSelect,
  onDeleteKey,
}: {
  step: Step;
  selected: boolean;
  onSelect: () => void;
  onDeleteKey: () => void;
}) {
  const { label, icon: Icon, summary } = STEP_TYPES[step.kind];
  const complete = isComplete(step);

  return (
    <button
      type="button"
      id={`step-${step.id}`}
      data-step={step.id}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key !== 'Delete' && event.key !== 'Backspace') return;
        event.preventDefault();
        onDeleteKey();
      }}
      className={cn(
        'p-ws-7 gap-ws-7 rounded-ws-container-md bg-ws-static-foreground flex w-[18rem] shrink-0 items-center border text-left',
        'outline-ws-dynamic-primary-strong-default focus-visible:wds-focus-visible',
        selected
          ? 'border-ws-dynamic-primary-default outline-ws-dynamic-primary-default/20 focus-visible:outline-ws-dynamic-primary-strong-default outline-2'
          : 'border-ws-static-base hover:border-ws-static-strong',
      )}
    >
      <span className="size-ws-14 rounded-ws-control-lg bg-ws-static-alpha-subtle flex shrink-0 items-center justify-center">
        <Icon aria-hidden="true" className="size-ws-9 text-ws-static-base" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="typography-caption-md text-ws-static-subtle">{label}</span>
        <span className="typography-label-strong-sm text-ws-static-strong truncate">
          {summary(step.fields)}
        </span>
      </span>
      {!complete && (
        <>
          <RiErrorWarningFill
            aria-hidden="true"
            className="size-ws-9 text-ws-semantic-negative shrink-0"
          />
          <span className="sr-only">, needs attention</span>
        </>
      )}
    </button>
  );
}
