import { RiAddLine, RiArrowDownSLine, RiFilter3Line } from '@remixicon/react';
import { Button, Popup } from '@wideset/react';
import { useRef, useState } from 'react';

import { ConditionRow } from './condition-row';
import { blank, type Condition, FIELD_IDS, type Filter, isComplete } from './conditions';

type FilterPopoverProps = {
  /** The filter on the list now; the popover edits a copy of it. */
  applied: Filter;
  onApply: (filter: Filter) => void;
  defaultOpen?: boolean;
  /** The copy on screen the first time it opens, when that is not `applied` (a sample mid-edit). */
  defaultDraft?: Filter;
};

/**
 * The filter builder, under the toolbar's Filter button. It edits a draft of the list's filter:
 * conditions as rows of field, test and value, one join word for all of them, Add condition under
 * the rows, and the footer's Clear all and Apply, the popover's one filled button. Apply hands
 * the draft's complete conditions to the list and closes; Esc or a click away drop it, and the next opening starts
 * from the filter on the list again. Focus lands on the popover itself, so it reads its name
 * before Tab walks the rows.
 */
export function FilterPopover({ applied, onApply, defaultOpen, defaultDraft }: FilterPopoverProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [draft, setDraft] = useState(defaultDraft ?? applied);
  const [added, setAdded] = useState<string>();
  const surface = useRef<HTMLDivElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);

  const setConditions = (conditions: Condition[]) => setDraft({ ...draft, conditions });
  // A new condition starts on the first field not filtered yet.
  const add = () => {
    const used = draft.conditions.map((condition) => condition.field);
    const condition = blank(FIELD_IDS.find((field) => !used.includes(field)) ?? 'stage');
    setConditions([...draft.conditions, condition]);
    setAdded(condition.id);
  };

  return (
    <Popup
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setDraft(applied);
          setAdded(undefined);
        }
        setOpen(next);
      }}
    >
      <Popup.Trigger asChild>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiFilter3Line} />
          Filter
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </Popup.Trigger>
      <Popup.Container
        ref={surface}
        side="bottom"
        align="end"
        collisionPadding={16}
        aria-label="Filter deals"
        className="w-[44rem] max-w-[calc(100vw-2rem)]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          surface.current?.focus();
        }}
      >
        <Popup.Content contentClassName="gap-ws-5 flex flex-col">
          {draft.conditions.length === 0 && (
            <p className="typography-body-md text-ws-static-subtle">
              No conditions yet. Add one to narrow the deals.
            </p>
          )}
          {draft.conditions.map((condition, index) => (
            <ConditionRow
              key={condition.id}
              condition={condition}
              index={index}
              join={draft.join}
              onJoinChange={(join) => setDraft({ ...draft, join })}
              onChange={(next) =>
                setConditions(draft.conditions.map((c) => (c.id === next.id ? next : c)))
              }
              onRemove={() => {
                setConditions(draft.conditions.filter((c) => c.id !== condition.id));
                addButton.current?.focus();
              }}
              focusOnMount={condition.id === added}
            />
          ))}
          <Button
            ref={addButton}
            variant="secondary"
            preset="ghost"
            size="sm"
            onClick={add}
            className="self-start"
          >
            <Button.Icon icon={RiAddLine} />
            Add condition
          </Button>
        </Popup.Content>
        <Popup.Footer className="justify-between">
          <Button
            variant="secondary"
            preset="ghost"
            size="sm"
            disabled={draft.conditions.length === 0}
            onClick={() => setConditions([])}
          >
            Clear all
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // A condition left without a value narrows nothing: it is not kept.
              onApply({ ...draft, conditions: draft.conditions.filter(isComplete) });
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </Popup.Footer>
      </Popup.Container>
    </Popup>
  );
}
