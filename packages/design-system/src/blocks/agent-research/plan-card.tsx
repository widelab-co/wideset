// TODO(custom): the plan a research run follows, as a transcript row that opens to a card where it can be edited; Wideset has no plan or editable-list part, and the kit's approval card asks about one command.
import { RiListCheck3, RiPencilLine } from '@remixicon/react';
import { Button, Textarea } from '@wideset/react';
import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Fold } from './fold';
import { IconAction } from './icon-action';
import { Row } from './row';

type PlanCardProps = {
  /** What the agent will look into, in order. */
  steps: string[];
  /** The run is in progress: the plan stays open for as long as it is being followed. */
  live: boolean;
  /** The Verbose view: the plan starts open at rest too. */
  defaultOpen: boolean;
  /** The plan cannot be changed now: a run is in progress, or the chat has moved on. */
  locked: boolean;
  /** The plan was changed: the research runs again, on the new plan. */
  onChange: (steps: string[]) => void;
};

/**
 * What the agent means to look into, said before it starts, in a few numbered lines: the one
 * place where a long run can be steered cheaply. While the run goes it is open, a bordered card
 * under its row, as the transcript's other things to act on are. Once the run is over it folds
 * itself to one quiet row, as a thought does, so a finished chat is the question and the report;
 * a press opens it again. Edit turns the lines into one field, a step to a line; saving a changed
 * plan runs the research again, and Esc or Cancel puts the old one back. Neither button is
 * filled: Send stays the screen's one filled button.
 */
export function PlanCard({ steps, live, defaultOpen, locked, onChange }: PlanCardProps) {
  const [open, setOpen] = useState(live || defaultOpen);
  const [draft, setDraft] = useState<string | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const editing = draft !== null;

  // Open for as long as the run follows it; folded once the run is over.
  useEffect(() => {
    setOpen(live || defaultOpen);
  }, [live, defaultOpen]);

  // Edit was pressed to write: the cursor is in the field.
  useEffect(() => {
    if (editing) field.current?.focus();
  }, [editing]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    const next = (draft ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    setDraft(null);
    if (next.length > 0 && next.join('\n') !== steps.join('\n')) onChange(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') return;
    // Only the edit ends, not the run or whatever else listens for Esc.
    event.stopPropagation();
    setDraft(null);
  };

  return (
    // The transcript pads a card as it pads an answer; a row sits flush, as the steps around it do.
    <div className="-mx-ws-3 -my-ws-3">
      <Row
        mark={<RiListCheck3 aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <span className="text-ws-static-base">Research plan</span>
        <span className="text-ws-static-subtle shrink-0 tabular-nums">{steps.length} steps</span>
      </Row>
      <Fold open={open}>
        <section
          aria-label="Research plan"
          className="border-ws-static-base rounded-ws-container-md py-ws-5 pr-ws-5 pl-ws-9 ml-ws-12 mt-ws-2 mb-ws-3 border"
        >
          {!editing ? (
            <div className="gap-ws-5 flex items-start">
              <ol className="typography-body-md text-ws-static-base marker:text-ws-static-subtle gap-ws-2 py-ws-2 pl-ws-10 flex min-w-0 flex-1 list-decimal flex-col marker:tabular-nums">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <IconAction
                label="Edit plan"
                icon={RiPencilLine}
                iconClassName="text-ws-static-subtle"
                size="xs"
                disabled={locked}
                onClick={() => setDraft(steps.join('\n'))}
              />
            </div>
          ) : (
            <form onSubmit={save} className="gap-ws-5 py-ws-2 pr-ws-5 flex flex-col">
              <Textarea
                size="sm"
                rows={steps.length + 1}
                ref={field}
                resize="none"
                aria-label="Plan, one step to a line"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onKeyDown}
              />
              <div className="gap-ws-3 flex items-center">
                <p className="typography-caption-md text-ws-static-subtle mr-auto">
                  One step to a line. Saving runs the research again.
                </p>
                <Button variant="secondary" preset="ghost" size="sm" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" preset="border" size="sm">
                  Run again
                </Button>
              </div>
            </form>
          )}
        </section>
      </Fold>
    </div>
  );
}
