import { RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  cn,
  IconButton,
  Toast,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useRef, useState } from 'react';

import {
  FILES,
  FOLDERS,
  NOW,
  ROOT,
  START_DESTINATION,
  START_FOLDER,
  START_SELECTION,
} from './data';
import { FilesTable } from './files-table';
import { formatFiles } from './format';
import { MoveDialog, pathOf } from './move-dialog';
import { MoveToast } from './move-toast';
import { PageHeader } from './page-header';
import { SelectionBar } from './selection-bar';
import { FilesSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

type DialogState = { key: number; open: boolean; ids: string[] };

/**
 * The screen inside the toasts. It holds the folders, the files and the open folder, so a move,
 * an archive or a new folder changes them in one place and says so in a toast, with Undo.
 */
function FilesScreen() {
  const sidebarId = useId();
  const { showToast, dismissToast } = useToast();
  const made = useRef(0);
  const [collapsed, setCollapsed] = useState(false);
  const [folders, setFolders] = useState(FOLDERS);
  const [files, setFiles] = useState(FILES);
  const [folder, setFolder] = useState(START_FOLDER);
  const [selected, setSelected] = useState(START_SELECTION);
  const [dialog, setDialog] = useState<DialogState>({ key: 0, open: true, ids: START_SELECTION });
  // Where files last went: the dialog opens on it next time.
  const [lastPlace, setLastPlace] = useState(START_DESTINATION);

  const subfolders = folders
    .filter((item) => item.parent === folder)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
  const here = files
    .filter((file) => file.folder === folder && !file.archived)
    .sort((a, b) => b.modified.localeCompare(a.modified));
  const title = folder === ROOT ? 'Files' : folders.find((item) => item.id === folder)!.name;

  /** Files, then each folder down to the open one; every crumb but the last goes there. */
  const crumbs: { id: string; label: string }[] = [];
  for (let at = folders.find((item) => item.id === folder); at;) {
    crumbs.unshift({ id: at.id, label: at.id === ROOT ? 'Files' : at.name });
    at = folders.find((item) => item.id === at?.parent);
  }

  const go = (id: string) => {
    setFolder(id);
    setSelected([]);
  };

  const close = () => setDialog({ ...dialog, open: false });

  const move = (destination: string) => {
    const before = files;
    const { ids } = dialog;
    setFiles((all) =>
      all.map((file) => (ids.includes(file.id) ? { ...file, folder: destination } : file)),
    );
    setSelected([]);
    setLastPlace(destination);
    close();
    const id = showToast({
      variant: 'expanded',
      content: (
        <MoveToast
          message={`Moved ${formatFiles(ids.length)} to ${pathOf(folders, destination)}`}
          onOpenFolder={() => {
            go(destination);
            dismissToast(id);
          }}
          onUndo={() => {
            setFiles(before);
            dismissToast(id);
          }}
        />
      ),
    });
  };

  const archive = (ids: string[]) => {
    const before = files;
    setFiles((all) =>
      all.map((file) => (ids.includes(file.id) ? { ...file, archived: true } : file)),
    );
    setSelected([]);
    close();
    const id = showToast({
      content: `Archived ${formatFiles(ids.length)}`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setFiles(before);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const createFolder = (name: string, parent: string) => {
    const id = `new-folder-${++made.current}`;
    setFolders((all) => [...all, { id, name, parent, owner: 'maya', modified: NOW }]);
    return id;
  };

  return (
    <AppShell direction="inset">
      <FilesSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              {crumbs.map((crumb, n) => (
                <Breadcrumbs.Item
                  key={crumb.id}
                  onClick={n < crumbs.length - 1 ? () => go(crumb.id) : undefined}
                >
                  {crumb.label}
                </Breadcrumbs.Item>
              ))}
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader title={title} />
            {subfolders.length + here.length > 0 ? (
              <FilesTable
                folders={subfolders}
                files={here}
                selected={selected}
                onSelectedChange={setSelected}
                onOpenFolder={go}
              />
            ) : (
              <p className="py-ws-20 typography-body-md text-ws-static-subtle text-center">
                Nothing in this folder yet. Move files here, or upload them.
              </p>
            )}
          </div>
        </div>
      </AppShell.Main>

      <SelectionBar
        count={selected.length}
        onClear={() => setSelected([])}
        onDownload={() =>
          showToast({ content: `Downloading ${formatFiles(selected.length)} as a .zip` })
        }
        onMove={() => setDialog({ key: dialog.key + 1, open: true, ids: selected })}
        onArchive={() => archive(selected)}
      />

      <MoveDialog
        key={dialog.key}
        open={dialog.open}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
        count={dialog.ids.length}
        folders={folders}
        current={folder}
        initialChoice={lastPlace !== folder ? lastPlace : undefined}
        onCreateFolder={createFolder}
        onMove={move}
        onArchive={() => archive(dialog.ids)}
      />
    </AppShell>
  );
}

/**
 * Move dialog (panel over Files, Inset direction): three proposals selected in the Proposals
 * folder and Move pressed in the selection bar, so the dialog is open on load. Its tree opens on
 * where the files are and on where they last went; moving closes it, takes the files off the list
 * and says where they went, with Open folder and Undo. The selection bar's Move opens it again.
 */
export default function MoveDialogBlock() {
  return (
    <ToastProvider>
      <FilesScreen />
    </ToastProvider>
  );
}
