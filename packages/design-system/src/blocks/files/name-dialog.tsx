import { Button, FormField, Modal, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

type NameDialogProps = {
  title: string;
  description: string;
  label: string;
  /** The name it starts with: the current one when renaming, empty for a new collection. */
  initial: string;
  /** The button's words: "Rename", "Create collection". */
  submit: string;
  /** Names already in use, compared without case. */
  taken: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
};

/**
 * Naming something: renaming a file or folder, or starting a collection. One field, filled and
 * selected on open so typing replaces it; Enter submits. An empty name or one already used is
 * stopped with the reason under the field, not by a disabled button.
 */
export function NameDialog({
  title,
  description,
  label,
  initial,
  submit,
  taken,
  open,
  onOpenChange,
  onSubmit,
}: NameDialogProps) {
  const fieldId = useId();
  const [name, setName] = useState(initial);
  const [error, setError] = useState<string>();

  const save = (event: FormEvent) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) return setError('Enter a name.');
    const unchanged = value === initial.trim();
    if (!unchanged && taken.some((other) => other.toLowerCase() === value.toLowerCase())) {
      return setError(`“${value}” is already used here.`);
    }
    onOpenChange(false);
    if (!unchanged) onSubmit(value);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setName(initial);
          setError(undefined);
        }
        onOpenChange(next);
      }}
    >
      <Modal.Content>
        <form onSubmit={save} noValidate>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.Description>{description}</Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <FormField label={label} htmlFor={fieldId} errorText={error}>
              <TextInput
                id={fieldId}
                autoComplete="off"
                value={name}
                variant={error ? 'danger' : undefined}
                onFocus={(event) => event.target.select()}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(undefined);
                }}
              />
            </FormField>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Modal.Close>
            <Button type="submit">{submit}</Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}
