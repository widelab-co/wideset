import { Button, cn, Modal, RadioButton, RadioButtonGroup } from '@wideset/react';
import { useState } from 'react';

import type { Item } from './data';
import { formatFiles } from './format';

/** Where a folder's row starts, by depth: the tree reads by indent alone. */
const INDENT = ['', 'pl-ws-12', 'pl-ws-20', 'pl-ws-24'];
const ROOT = 'root';

type FolderDialogProps = {
  mode: 'move' | 'copy';
  /** What is being moved or copied; kept while the dialog closes, so its words do not change. */
  items: Item[];
  /** Every folder that is not put away, to build the tree from. */
  folders: Item[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (parent: string | null) => void;
};

/** Folders under a parent, A to Z, each followed by its own, with their depth. */
const tree = (folders: Item[], parent: string | null = null, depth = 1): [Item, number][] =>
  folders
    .filter((folder) => folder.parent === parent)
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((folder): [Item, number][] => [
      [folder, depth],
      ...tree(folders, folder.id, depth + 1),
    ]);

/**
 * Picking where files go: the folder tree as one set of radio buttons, All files at its root.
 * A folder cannot go into itself or a folder inside it, and a move cannot pick where everything
 * already is; those rows are disabled rather than hidden, so the tree keeps its shape. The
 * button names the action and waits for a choice.
 */
export function FolderDialog({
  mode,
  items,
  folders,
  open,
  onOpenChange,
  onConfirm,
}: FolderDialogProps) {
  const [destination, setDestination] = useState<string>();

  // A folder being moved, and everything under it, is out of reach.
  const blocked = new Set(items.filter((item) => item.kind === 'folder').map((item) => item.id));
  for (const [folder] of tree(folders)) {
    if (folder.parent && blocked.has(folder.parent)) blocked.add(folder.id);
  }
  const parents = new Set(items.map((item) => item.parent ?? ROOT));
  const here = mode === 'move' && parents.size === 1 ? [...parents][0] : undefined;

  const verb = mode === 'move' ? 'Move' : 'Copy';
  const what = items.length === 1 ? items[0].name : formatFiles(items.length);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setDestination(undefined);
        onOpenChange(next);
      }}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{`${verb} ${what}`}</Modal.Title>
          <Modal.Description>
            {mode === 'move'
              ? 'Choose a folder. Pins and collections stay as they are.'
              : 'Choose a folder. A copy in the same folder is named “Copy of …”.'}
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <RadioButtonGroup
            aria-label="Destination folder"
            value={destination ?? ''}
            onValueChange={setDestination}
          >
            <RadioButton value={ROOT} label="All files" disabled={here === ROOT} />
            {tree(folders).map(([folder, depth]) => (
              <div key={folder.id} className={cn(INDENT[Math.min(depth, INDENT.length - 1)])}>
                <RadioButton
                  value={folder.id}
                  label={folder.name}
                  disabled={blocked.has(folder.id) || here === folder.id}
                />
              </div>
            ))}
          </RadioButtonGroup>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button
            disabled={!destination}
            onClick={() => {
              if (!destination) return;
              onOpenChange(false);
              onConfirm(destination === ROOT ? null : destination);
            }}
          >
            {`${verb} here`}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
