import { RiDeleteBinLine, RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  Button,
  cn,
  FileUpload,
  IconButton,
  Toast,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { type DragEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

import {
  type Collection,
  COLLECTIONS,
  type Item,
  ITEMS,
  kindOf,
  ME,
  NOW,
  PLACE_LABEL,
  type PlaceId,
  RECENT_DAYS,
  type SortKey,
  TRASH_DAYS,
  type View,
} from './data';
import { EmptyState } from './empty-state';
import { EmptyTrashDialog } from './empty-trash-dialog';
import { FileGrid } from './file-grid';
import { FileToolbar } from './file-toolbar';
import { FilesTable } from './files-table';
import { FolderDialog } from './folder-dialog';
import { daysAgo, formatFiles } from './format';
import { NameDialog } from './name-dialog';
import { PageHeader } from './page-header';
import { PlacesNav } from './places-nav';
import { RestoreTable } from './restore-table';
import type { RowAction } from './row-menu';
import { SelectionBar } from './selection-bar';
import { FilesSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
const MB = 1024 * 1024;

type FolderDialogState = { key: number; mode: 'move' | 'copy'; ids: string[]; open: boolean };
type NameDialogState = { key: number; open: boolean } & (
  { kind: 'rename'; id: string } | { kind: 'collection'; ids: string[] }
);

const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes('Files');

/** Small files arrive in a few ticks, large ones take longer. */
const advance = (item: Item): Item => {
  if (item.progress === undefined) return item;
  const next = item.progress + Math.max(0.04, 0.22 - (item.size ?? 0) / (60 * MB));
  return next >= 1 ? { ...item, progress: undefined, modified: NOW } : { ...item, progress: next };
};

const compare = (sort: SortKey, foldersFirst: boolean) => (a: Item, b: Item) => {
  if (foldersFirst && (a.kind === 'folder') !== (b.kind === 'folder')) {
    return a.kind === 'folder' ? -1 : 1;
  }
  if (sort === 'name') return a.name.localeCompare(b.name);
  if (sort === 'size') return (b.size ?? 0) - (a.size ?? 0);
  return b.modified.localeCompare(a.modified);
};

/**
 * The page inside the card, under the toasts. It holds every file and where the page is looking,
 * so each action changes the files in one place and says so in a toast, with Undo where it can
 * be undone.
 */
function FilesPage() {
  const { showToast, dismissToast } = useToast();
  const picker = useRef<HTMLInputElement>(null);
  const opened = useRef(0);
  const uploadBatch = useRef<{ count: number; where: string } | undefined>(undefined);
  // New files, copies and collections take ids from a counter, never from a list's length, which
  // returns to an earlier value after a deletion.
  const lastId = useRef(0);
  const newId = (prefix: string) => `${prefix}-new-${++lastId.current}`;
  const [items, setItems] = useState(ITEMS);
  const [collections, setCollections] = useState(COLLECTIONS);
  const [place, setPlace] = useState<PlaceId>('all');
  const [folder, setFolder] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('modified');
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [folderDialog, setFolderDialog] = useState<FolderDialogState>();
  const [nameDialog, setNameDialog] = useState<NameDialogState>();
  const [emptying, setEmptying] = useState(false);

  const byId = (id: string | null) => items.find((item) => item.id === id);
  /**
   * In use: active, and so is every folder above it. Archiving, trashing or deleting a folder
   * takes everything inside with it, and restoring it brings them back, without touching them.
   */
  const isLive = (item: Item | undefined): boolean =>
    !!item && item.state === 'active' && (item.parent === null || isLive(byId(item.parent)));
  /** An item and everything inside it, for copies and permanent deletion. */
  const subtree = (id: string): Item[] => [
    byId(id)!,
    ...items.filter((item) => item.parent === id).flatMap((child) => subtree(child.id)),
  ];
  const folderName = (id: string | null) => byId(id)?.name ?? PLACE_LABEL.all;
  const collectionOf = (id: PlaceId) =>
    id.startsWith('c:') ? collections.find((c) => `c:${c.id}` === id) : undefined;
  const placeLabel = (id: PlaceId) =>
    collectionOf(id)?.name ?? PLACE_LABEL[id as keyof typeof PLACE_LABEL];
  const what = (ids: string[]) => (ids.length === 1 ? byId(ids[0])!.name : formatFiles(ids.length));
  const putAway = place === 'archive' || place === 'trash';

  // ——— What is on screen ———
  const search = query.trim().toLowerCase();
  const inPlace = (item: Item) => {
    const active = isLive(item);
    if (place === 'all') return active && (search ? true : item.parent === folder);
    if (place === 'pinned') return active && Boolean(item.pinned);
    if (place === 'shared') return active && Boolean(item.sharedWithMe);
    if (place === 'recent')
      return active && item.kind !== 'folder' && daysAgo(item.modified) <= RECENT_DAYS;
    if (place === 'archive') return item.state === 'archived';
    if (place === 'trash') return item.state === 'trashed';
    return active && item.collections.includes(place.slice(2));
  };
  const here = items.filter(inPlace);
  const rows = here
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search) &&
        (types.length === 0 || types.includes(item.kind)),
    )
    .sort(compare(sort, place !== 'recent'));

  /** The folder path under All files; anywhere else, the place alone. */
  const path: { label: string; to: () => void }[] = [];
  if (place === 'all') {
    for (let id = folder; id; id = byId(id)?.parent ?? null) {
      const at = id;
      path.unshift({ label: folderName(at), to: () => go('all', at) });
    }
  }
  path.unshift({ label: placeLabel(place), to: () => go(place) });

  // ——— Moving around ———
  function go(next: PlaceId, nextFolder: string | null = null) {
    setPlace(next);
    setFolder(nextFolder);
    setSelected([]);
    setQuery('');
  }
  const open = (item: Item) => item.kind === 'folder' && go('all', item.id);

  // ——— Changing files ———
  const change = (ids: string[], patch: (item: Item) => Partial<Item>) =>
    setItems((all) =>
      all.map((item) => (ids.includes(item.id) ? { ...item, ...patch(item) } : item)),
    );

  /**
   * A toast whose Undo reverses this action only: the items it changed go back as they were and
   * the ones it added go, while anything changed since (an upload, a rename) stays.
   */
  const toastWithUndo = (content: string, changed: string[], added: string[] = []) => {
    const before = new Map(items.filter((item) => changed.includes(item.id)).map((i) => [i.id, i]));
    const id = showToast({
      content,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setItems((all) =>
              all
                .filter((item) => !added.includes(item.id))
                .map((item) => before.get(item.id) ?? item),
            );
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const download = (ids: string[]) =>
    showToast({
      content: ids.length === 1 ? `Downloading ${what(ids)}` : `Downloading ${what(ids)} as a .zip`,
    });

  const moveTo = (ids: string[], parent: string | null) => {
    change(ids, () => ({ parent }));
    setSelected([]);
    toastWithUndo(`Moved ${what(ids)} to ${folderName(parent)}`, ids);
  };

  /**
   * Copies sit beside the original as "Copy of …"; elsewhere they keep the name. A folder is
   * copied with everything inside it, each copy under its copied folder.
   */
  const copyTo = (ids: string[], parent: string | null, announce = true) => {
    const taken = new Set(items.filter((i) => i.parent === parent).map((i) => i.name));
    const copies: Item[] = [];
    const copy = (source: Item, into: string | null, top: boolean) => {
      const id = newId(`${source.id}-copy`);
      const name = top && taken.has(source.name) ? `Copy of ${source.name}` : source.name;
      copies.push({
        ...source,
        id,
        name,
        parent: into,
        owner: ME,
        modified: NOW,
        pinned: false,
        sharedWithMe: false,
      });
      items
        .filter((item) => item.parent === source.id && item.state === 'active')
        .forEach((child) => copy(child, id, false));
    };
    ids.forEach((id) => copy(byId(id)!, parent, true));
    setItems((all) => [...copies, ...all]);
    setSelected([]);
    if (announce) {
      toastWithUndo(
        `Copied ${what(ids)} to ${folderName(parent)}`,
        [],
        copies.map((item) => item.id),
      );
    }
  };

  const archive = (ids: string[]) => {
    change(ids, () => ({ state: 'archived', putAway: NOW }));
    setSelected([]);
    toastWithUndo(`Archived ${what(ids)}`, ids);
  };

  const trash = (ids: string[]) => {
    change(ids, () => ({ state: 'trashed', putAway: NOW }));
    setSelected([]);
    toastWithUndo(`Moved ${what(ids)} to the trash`, ids);
  };

  const restore = (item: Item) => {
    // Back where it was, unless that folder is gone too: then to the top of All files.
    const parent = isLive(byId(item.parent)) ? item.parent : null;
    change([item.id], () => ({ state: 'active', putAway: undefined, parent }));
    toastWithUndo(`Restored ${item.name} to ${folderName(parent)}`, [item.id]);
  };

  const addToCollection = (ids: string[], collection: Collection) => {
    change(ids, (item) => ({ collections: [...new Set([...item.collections, collection.id])] }));
    setSelected([]);
    toastWithUndo(`Added ${what(ids)} to ${collection.name}`, ids);
  };

  const createCollection = (name: string, ids: string[]) => {
    const collection = {
      id: newId(name.toLowerCase().replace(/\W+/g, '-')),
      name,
    };
    setCollections((all) => [...all, collection]);
    if (ids.length > 0) addToCollection(ids, collection);
    else go(`c:${collection.id}`);
  };

  const upload = (files: File[]) => {
    if (files.length === 0) return;
    const collection = collectionOf(place);
    const parent = place === 'all' ? folder : null;
    const added = files.map((file): Item => ({
      id: newId('upload'),
      name: file.name,
      kind: kindOf(file.name),
      parent,
      owner: ME,
      modified: NOW,
      size: file.size,
      collections: collection ? [collection.id] : [],
      state: 'active',
      progress: 0,
    }));
    setItems((all) => [...added, ...all]);
    // Where the new files would not show, the page goes to where they land.
    const where = collection?.name ?? folderName(parent);
    if (!collection && place !== 'all' && place !== 'recent') go('all');
    uploadBatch.current = {
      count: (uploadBatch.current?.count ?? 0) + files.length,
      where,
    };
  };

  const act = (item: Item, action: RowAction) => {
    if (action === 'open') open(item);
    if (action === 'download') download([item.id]);
    if (action === 'duplicate') copyTo([item.id], item.parent, false);
    if (action === 'pin') change([item.id], () => ({ pinned: !item.pinned }));
    if (action === 'delete') trash([item.id]);
    if (action === 'move') {
      setFolderDialog({ key: ++opened.current, mode: 'move', ids: [item.id], open: true });
    }
    if (action === 'rename') {
      setNameDialog({ key: ++opened.current, kind: 'rename', id: item.id, open: true });
    }
  };

  // ——— Uploads in progress ———
  const uploading = items.some((item) => item.progress !== undefined);
  useEffect(() => {
    if (!uploading) return;
    const timer = window.setInterval(() => setItems((all) => all.map(advance)), 160);
    return () => window.clearInterval(timer);
  }, [uploading]);
  useEffect(() => {
    if (uploading || !uploadBatch.current) return;
    const { count, where } = uploadBatch.current;
    uploadBatch.current = undefined;
    showToast({ status: 'success', content: `Uploaded ${formatFiles(count)} to ${where}` });
  }, [uploading, showToast]);

  // ——— Dropping files ———
  const dropProps = {
    onDragOver: (event: DragEvent) => event.preventDefault(),
    onDragLeave: (event: DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      setDragging(false);
      upload([...event.dataTransfer.files]);
    },
  };
  const browse = () => picker.current?.click();
  /** Where an upload lands: the open folder, the open collection, or the top of All files. */
  const dropTarget =
    collectionOf(place)?.name ?? (place === 'all' ? folderName(folder) : PLACE_LABEL.all);

  // ——— What the list area shows ———
  const clearSearch = () => {
    setQuery('');
    setTypes([]);
  };
  let content: ReactNode;
  if (rows.length > 0) {
    content = putAway ? (
      <RestoreTable rows={rows} trash={place === 'trash'} onRestore={restore} />
    ) : view === 'list' ? (
      <FilesTable
        rows={rows}
        selected={selected}
        onSelectedChange={setSelected}
        onOpen={open}
        onAction={act}
      />
    ) : (
      <FileGrid
        rows={rows}
        selected={selected}
        onSelectedChange={setSelected}
        onOpen={open}
        onAction={act}
      />
    );
  } else if (here.length > 0 || search) {
    content = (
      <div className="py-ws-20">
        <EmptyState
          title={search ? `No files match “${query.trim()}”` : 'No files of this type here'}
          description={
            search
              ? 'Check the spelling, or look for part of the name.'
              : 'Choose another type, or clear the filter to see everything here.'
          }
        >
          <Button size="sm" variant="secondary" preset="border" onClick={clearSearch}>
            {search ? 'Clear search' : 'Clear filter'}
          </Button>
        </EmptyState>
      </div>
    );
  } else if (place === 'all') {
    content = (
      <FileUpload
        browse
        isDragActive={dragging}
        onBrowse={browse}
        zoneProps={{ ...dropProps, className: 'min-h-[18rem]' }}
        labels={{
          dropzoneBrowse: `Nothing in ${folderName(folder)} yet. Drop files here to upload them, or`,
          browse: 'Choose files',
          dropzoneActive: `Drop to upload to ${dropTarget}`,
        }}
      />
    );
  } else {
    const empty: Record<string, [string, string]> = {
      pinned: ['Nothing pinned', 'Pin a file from its menu to keep it here, wherever it lives.'],
      shared: [
        'Nothing shared with you',
        'Files a teammate shares with you directly show up here.',
      ],
      recent: [
        'Nothing changed lately',
        `Files changed in the last ${RECENT_DAYS} days show up here.`,
      ],
      archive: [
        'The archive is empty',
        'Archived files leave the folders but stay until you delete them.',
      ],
      trash: [
        'The trash is empty',
        `Deleted files stay here for ${TRASH_DAYS} days, then go for good.`,
      ],
    };
    const [title, description] = empty[place] ?? [
      'Nothing in this collection yet',
      'Select files anywhere and choose Add to collection. They stay in their folders.',
    ];
    content = (
      <div className="py-ws-20">
        <EmptyState title={title} description={description} />
      </div>
    );
  }

  const folderItems = folderDialog?.ids.map((id) => byId(id)!).filter(Boolean) ?? [];
  const renaming = nameDialog?.kind === 'rename' ? byId(nameDialog.id) : undefined;
  const trashCount = items.filter((item) => item.state === 'trashed').length;

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader
        onUpload={browse}
        quiet={Boolean(folderDialog?.open || nameDialog?.open || emptying)}
      />
      <input
        ref={picker}
        type="file"
        multiple
        hidden
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          upload([...(event.target.files ?? [])]);
          // Emptied, so picking the same file again still reports a change.
          event.target.value = '';
        }}
      />

      <div className="gap-ws-16 grid grid-cols-1 items-start md:grid-cols-[13rem_minmax(0,1fr)]">
        <PlacesNav
          place={place}
          collections={collections}
          onSelect={(next) => go(next)}
          onNewCollection={() =>
            setNameDialog({ key: ++opened.current, kind: 'collection', ids: [], open: true })
          }
        />

        <section aria-label={placeLabel(place)} className="gap-ws-9 flex min-w-0 flex-col">
          <div className="gap-ws-5 min-h-ws-forms-sm flex flex-wrap items-center justify-between">
            <Breadcrumbs separator="slash" className="-ml-ws-6">
              {path.map((crumb, n) => (
                <Breadcrumbs.Item
                  key={crumb.label}
                  onClick={n < path.length - 1 ? crumb.to : undefined}
                >
                  {crumb.label}
                </Breadcrumbs.Item>
              ))}
            </Breadcrumbs>
            {place === 'trash' && (
              <Button
                size="sm"
                variant="danger"
                preset="border"
                disabled={trashCount === 0}
                onClick={() => setEmptying(true)}
              >
                <Button.Icon icon={RiDeleteBinLine} />
                Empty trash
              </Button>
            )}
          </div>

          <FileToolbar
            query={query}
            onQueryChange={setQuery}
            types={types}
            onTypesChange={setTypes}
            sort={sort}
            onSortChange={setSort}
            view={putAway ? undefined : view}
            onViewChange={setView}
          />

          {/* The list takes dropped files: while files are held over it, the drop zone covers it. */}
          <div
            className="relative"
            onDragEnter={(event) => hasFiles(event) && setDragging(true)}
            onDragOver={(event) => hasFiles(event) && event.preventDefault()}
          >
            {content}
            {dragging && rows.length > 0 && (
              <div className="bg-ws-static-foreground inset-ws-0 z-ws-base absolute flex">
                <FileUpload
                  isDragActive
                  onBrowse={browse}
                  zoneProps={{ ...dropProps, className: 'flex-1 min-h-[12rem]' }}
                  labels={{ dropzoneActive: `Drop to upload to ${dropTarget}` }}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <SelectionBar
        count={putAway ? 0 : selected.length}
        collections={collections}
        onClear={() => setSelected([])}
        onDownload={() => download(selected)}
        onMove={() =>
          setFolderDialog({ key: ++opened.current, mode: 'move', ids: selected, open: true })
        }
        onCopy={() =>
          setFolderDialog({ key: ++opened.current, mode: 'copy', ids: selected, open: true })
        }
        onAddToCollection={(id) =>
          addToCollection(
            selected,
            collections.find((c) => c.id === id)!,
          )
        }
        onNewCollection={() =>
          setNameDialog({ key: ++opened.current, kind: 'collection', ids: selected, open: true })
        }
        onArchive={() => archive(selected)}
        onDelete={() => trash(selected)}
      />

      {folderDialog && (
        <FolderDialog
          key={folderDialog.key}
          mode={folderDialog.mode}
          items={folderItems}
          folders={items.filter((item) => item.kind === 'folder' && isLive(item))}
          open={folderDialog.open}
          onOpenChange={(next) => setFolderDialog({ ...folderDialog, open: next })}
          onConfirm={(parent) =>
            folderDialog.mode === 'move'
              ? moveTo(folderDialog.ids, parent)
              : copyTo(folderDialog.ids, parent)
          }
        />
      )}

      {nameDialog && (
        <NameDialog
          key={nameDialog.key}
          title={
            renaming ? `Rename ${renaming.kind === 'folder' ? 'folder' : 'file'}` : 'New collection'
          }
          description={
            renaming
              ? `Everyone in the workspace sees the new name. Links to it keep working.`
              : nameDialog.kind === 'collection' && nameDialog.ids.length > 0
                ? `Gather ${what(nameDialog.ids)} in a new collection. Files stay in their folders.`
                : 'A collection gathers files from any folder. Files stay where they are.'
          }
          label="Name"
          initial={renaming?.name ?? ''}
          submit={renaming ? 'Rename' : 'Create collection'}
          taken={
            renaming
              ? items
                  .filter(
                    (i) =>
                      i.parent === renaming.parent && i.state === 'active' && i.id !== renaming.id,
                  )
                  .map((i) => i.name)
              : collections.map((c) => c.name)
          }
          open={nameDialog.open}
          onOpenChange={(next) => setNameDialog({ ...nameDialog, open: next })}
          onSubmit={(name) =>
            nameDialog.kind === 'rename'
              ? change([nameDialog.id], () => ({ name, modified: NOW }))
              : createCollection(name, nameDialog.ids)
          }
        />
      )}

      <EmptyTrashDialog
        count={trashCount}
        open={emptying}
        onOpenChange={setEmptying}
        onConfirm={() => {
          // Deleting a folder for good deletes what was inside it too.
          const gone = new Set(
            items
              .filter((item) => item.state === 'trashed')
              .flatMap((item) => subtree(item.id))
              .map((item) => item.id),
          );
          setItems((all) => all.filter((item) => !gone.has(item.id)));
          showToast({ content: `Deleted ${formatFiles(trashCount)} for good` });
        }}
      />
    </div>
  );
}

/**
 * Files (Inset direction): the workspace's shared files on the raised page beside the workspace
 * sidebar. Upload is the one filled button; a narrow column of places sits beside the files,
 * which show as a list or a grid under their folder path and the toolbar. Selecting files brings
 * up the action bar; anything put away waits in the archive or the trash.
 */
export default function Files() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <FilesSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <AppShell.Main>
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
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
                <Breadcrumbs.Item>Files</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <FilesPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
