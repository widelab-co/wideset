import { Button, FormField, Modal, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import type { Entry } from './data';
import { formatPeople, formatReports } from './format';

type DeleteFolderDialogProps = {
  /** The folder to delete; nothing renders without one. */
  folder?: Entry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (folder: Entry) => void;
};

/**
 * The heavy delete: a folder of reports shared with other people, gone for good. A plain `Modal`,
 * not a `StatusModal`: it holds a field, which a status dialog must not, and a warning icon would
 * be a second alarm beside the red button that already carries it.
 *
 * The title names the folder; the line under it says, in plain words, what goes with it, who
 * loses access and that it cannot be undone. Typing the folder's name is the pause before it:
 * focus starts in that field, never on the danger button, and the button, which names the action,
 * stays disabled until the name matches (spaces around it and case aside). Enter deletes once it
 * does; Cancel, the X and Esc leave everything as it was.
 */
export function DeleteFolderDialog({
  folder,
  open,
  onOpenChange,
  onConfirm,
}: DeleteFolderDialogProps) {
  const fieldId = useId();

  if (!folder) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(fieldId)?.focus();
        }}
      >
        {/* Inside the content, so what was typed goes when the dialog closes. */}
        <DeleteFolderForm fieldId={fieldId} folder={folder} onConfirm={() => onConfirm(folder)} />
      </Modal.Content>
    </Modal>
  );
}

function DeleteFolderForm({
  fieldId,
  folder,
  onConfirm,
}: {
  fieldId: string;
  folder: Entry;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState('');
  const matches = typed.trim().toLowerCase() === folder.name.toLowerCase();
  const access = folder.people?.length ? `, and ${formatPeople(folder.people)} lose access` : '';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (matches) onConfirm();
  };

  return (
    <form onSubmit={submit} noValidate>
      <Modal.Header>
        <Modal.Title>Delete “{folder.name}”?</Modal.Title>
        <Modal.Description>
          {`Its ${formatReports(folder.reports ?? 0)} and their schedules go with it${access}. This cannot be undone.`}
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <FormField label={`Type “${folder.name}” to confirm`} htmlFor={fieldId}>
          <TextInput
            id={fieldId}
            autoComplete="off"
            spellCheck={false}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </FormField>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Modal.Close>
        <Button type="submit" variant="danger" disabled={!matches}>
          Delete folder
        </Button>
      </Modal.Footer>
    </form>
  );
}
