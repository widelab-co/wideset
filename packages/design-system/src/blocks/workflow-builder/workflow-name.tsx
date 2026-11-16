// TODO(custom): a page title edited in place; Wideset has no inline-edit or editable heading.
import { RiPencilLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

/**
 * The workflow's name as the page title, with a pencil beside it. Editing swaps the title for a
 * field in the same type, so nothing jumps; Enter or leaving the field keeps the name, Escape or
 * an empty name puts the old one back.
 */
export function WorkflowName({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState<string>();
  // Enter and Escape hand the focus back to the pencil; a click elsewhere keeps it there.
  const [refocus, setRefocus] = useState(false);
  const pencilRef = useRef<HTMLButtonElement>(null);
  // Set once Enter or Escape has closed the field, so the blur of its removal changes nothing.
  const closedRef = useRef(false);

  useEffect(() => {
    if (draft !== undefined || !refocus) return;
    pencilRef.current?.focus();
    setRefocus(false);
  }, [draft, refocus]);

  const close = (keep: boolean, fromKeyboard = false) => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (keep && draft?.trim()) onChange(draft.trim());
    setRefocus(fromKeyboard);
    setDraft(undefined);
  };

  if (draft !== undefined) {
    return (
      <input
        // The field appears because the pencil was pressed: the focus belongs in it.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        aria-label="Workflow name"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => close(true)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== 'Escape') return;
          // Otherwise the key goes on to the pencil, which takes the focus back, and reopens it.
          event.preventDefault();
          close(event.key === 'Enter', true);
        }}
        onFocus={(event) => event.target.select()}
        className="typography-title-sm text-ws-static-strong rounded-ws-control-md px-ws-3 -mx-ws-3 bg-ws-static-highlight-base outline-ws-dynamic-primary-default field-sizing-content min-w-[12rem] outline-2"
      />
    );
  }

  return (
    <div className="gap-ws-3 flex min-w-0 items-center">
      <h1 className="typography-title-sm text-ws-static-strong truncate">{value}</h1>
      <IconButton
        ref={pencilRef}
        icon={RiPencilLine}
        variant="secondary"
        preset="ghost"
        size="xs"
        aria-label="Rename workflow"
        onClick={() => {
          closedRef.current = false;
          setDraft(value);
        }}
      />
    </div>
  );
}
