import { RiArchiveLine, RiFolderAddLine, RiSearchLine } from '@remixicon/react';
import { Button, Modal, TextInput } from '@wideset/react';
import { useRef, useState } from 'react';

import { type Folder, ROOT } from './data';
import { FolderTree, treeRows } from './folder-tree';
import { formatFiles } from './format';

type MoveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** How many files are moving; kept while the dialog closes, so its words do not change. */
  count: number;
  folders: Folder[];
  /** The folder the files are in now. */
  current: string;
  /** Chosen when the dialog opens: the place files last went, or nothing. */
  initialChoice?: string;
  /** Makes a folder and gives back its id. */
  onCreateFolder: (name: string, parent: string) => string;
  onMove: (destination: string) => void;
  onArchive: () => void;
};

/** "Proposals / 2026": a folder's path under All files, or All files itself. */
export const pathOf = (folders: Folder[], id: string) => {
  const names: string[] = [];
  for (let at = folders.find((f) => f.id === id); at && at.id !== ROOT;) {
    names.unshift(at.name);
    at = folders.find((f) => f.id === at?.parent);
  }
  return names.length > 0 ? names.join(' / ') : 'All files';
};

/** A folder and the folders above it: the ones to open so it shows. */
const lineOf = (folders: Folder[], id?: string): string[] => {
  const folder = folders.find((item) => item.id === id);
  return folder ? [folder.id, ...lineOf(folders, folder.parent ?? undefined)] : [];
};

/**
 * Moving files to another folder. A search over the tree narrows it to the folders that match;
 * the tree opens on the current folder, which is marked and cannot be chosen. The choice is
 * repeated under the tree as a path, where New folder makes one inside it and chooses it. Move
 * here, the one filled button, waits for a choice. Archive instead sits apart on the left, for
 * files that should leave the active folders rather than move between them.
 */
export function MoveDialog({
  open,
  onOpenChange,
  count,
  folders,
  current,
  initialChoice,
  onCreateFolder,
  onMove,
  onArchive,
}: MoveDialogProps) {
  const tree = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState(initialChoice);
  const [expanded, setExpanded] = useState(() => [
    ...new Set([...lineOf(folders, current), ...lineOf(folders, initialChoice), ROOT]),
  ]);
  // The folder a new one is being named in.
  const [naming, setNaming] = useState<string>();

  const searching = query.trim() !== '';
  const rows = treeRows(folders, expanded, query);
  const destination = chosen && chosen !== current ? chosen : undefined;

  const startNaming = () => {
    const parent = destination ?? ROOT;
    setQuery('');
    setExpanded((all) => [...new Set([...all, ...lineOf(folders, parent)])]);
    setNaming(parent);
  };

  const name = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return { error: 'Give the folder a name.' };
    const taken = folders.some(
      (folder) => folder.parent === naming && folder.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (taken) return { error: `There is already a folder called “${trimmed}” here.` };
    const id = onCreateFolder(trimmed, naming ?? ROOT);
    setChosen(id);
    return { id };
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        // While a new folder is being named, Esc drops the name, not the dialog.
        onEscapeKeyDown={(event) => naming && event.preventDefault()}
      >
        <Modal.Header>
          <Modal.Title>{`Move ${formatFiles(count)}`}</Modal.Title>
          <Modal.Description>
            Choose a folder. The files keep their links and who they are shared with.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="gap-ws-9 flex flex-col">
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)}>
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiSearchLine} />
            </TextInput.Prefix>
            <TextInput.Input
              type="search"
              placeholder="Search folders"
              aria-label="Search folders"
              onKeyDown={(event) => {
                // Down from the search goes into the tree, at its focus.
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                tree.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
              }}
            />
            <TextInput.Suffix inner>
              <TextInput.ClearButton />
            </TextInput.Suffix>
          </TextInput>

          {/* The tree scrolls inside its frame, so the dialog keeps its height while it opens. */}
          <div className="border-ws-static-base rounded-ws-container-sm p-ws-3 h-[18.5rem] overflow-y-auto border">
            <FolderTree
              rows={rows}
              searching={searching}
              expanded={expanded}
              onExpandedChange={setExpanded}
              current={current}
              chosen={chosen}
              onChoose={setChosen}
              naming={naming}
              onName={name}
              onNamingEnd={() => setNaming(undefined)}
              treeRef={tree}
            />
            {searching && rows.length === 1 && (
              <p role="status" className="px-ws-5 py-ws-5 typography-body-md text-ws-static-subtle">
                {`No folders called “${query.trim()}”.`}
              </p>
            )}
          </div>

          <div className="gap-ws-9 flex items-center justify-between">
            <p
              aria-live="polite"
              className="typography-body-md text-ws-static-subtle min-w-0 truncate"
            >
              {destination ? (
                <>
                  To: <span className="text-ws-static-strong">{pathOf(folders, destination)}</span>
                </>
              ) : (
                'Choose where they go.'
              )}
            </p>
            <Button variant="secondary" preset="ghost" onClick={startNaming}>
              <Button.Icon icon={RiFolderAddLine} />
              New folder
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer variant="extension">
          <Button variant="secondary" preset="border" onClick={onArchive}>
            <Button.Icon icon={RiArchiveLine} />
            Archive instead
          </Button>
          <div className="gap-ws-5 flex">
            <Modal.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Modal.Close>
            <Button
              disabled={!destination || naming !== undefined}
              onClick={() => destination && onMove(destination)}
            >
              Move here
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
