// TODO(custom): subtask list (checkbox rows in an outlined card, an add row under them); no checklist in Wideset.
import { RiAddLine } from '@remixicon/react';
import { Checkbox, IconButton, ProgressBar } from '@wideset/react';
import { useId } from 'react';

import type { Subtask } from './data';

type SubtaskListProps = {
  subtasks: Subtask[];
  onToggle: (id: string, done: boolean) => void;
};

/**
 * The task's subtasks, ticked off in place. A subtask under way shows how far it is until it is
 * done; the words of the add row are its button's `label`, so the row is one target.
 */
export function SubtaskList({ subtasks, onToggle }: SubtaskListProps) {
  const addId = useId();

  return (
    // Figma's stroke is inside the card: an inset ring keeps its 6px and 4px padding.
    <div className="bg-ws-static-highlight-base rounded-ws-container-md pt-ws-4 pb-ws-3 inset-ring inset-ring-(--ws-static-stroke-base)">
      <ul aria-label="Subtasks">
        {subtasks.map((subtask) => (
          <li
            key={subtask.id}
            className="gap-ws-9 px-ws-9 py-ws-5 flex items-center justify-between"
          >
            <Checkbox
              label={subtask.title}
              description={subtask.description}
              checked={subtask.done}
              onCheckedChange={(checked) => onToggle(subtask.id, checked === true)}
            />
            {subtask.done || subtask.progress === undefined ? null : (
              <ProgressBar
                type="circle"
                value={subtask.progress}
                aria-label={`${subtask.title} progress`}
              />
            )}
          </li>
        ))}
      </ul>
      <div className="h-ws-15 gap-ws-6 px-ws-8 flex items-center">
        <IconButton
          id={addId}
          variant="secondary"
          preset="ghost"
          size="xs"
          icon={RiAddLine}
          aria-label="Add subtask"
        />
        <label
          htmlFor={addId}
          aria-hidden="true"
          className="typography-body-md text-ws-static-subtle"
        >
          Add subtask
        </label>
      </div>
    </div>
  );
}
