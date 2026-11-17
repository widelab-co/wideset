import {
  RiAddLine,
  RiArchiveLine,
  RiArrowDownSLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiFolderTransferLine,
  RiStackLine,
} from '@remixicon/react';
import { ActionBar, Button, DropdownMenu, ListItem } from '@wideset/react';

import type { Collection } from './data';

type SelectionBarProps = {
  count: number;
  collections: Collection[];
  onClear: () => void;
  onDownload: () => void;
  onMove: () => void;
  onCopy: () => void;
  onAddToCollection: (collectionId: string) => void;
  onNewCollection: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

/**
 * What can be done to every selected file at once, floating over the page while anything is
 * selected: take it, put it somewhere, gather it into a collection, put it away. Delete is last
 * and red; it only moves the files to the trash, with Undo in its toast.
 */
export function SelectionBar({
  count,
  collections,
  onClear,
  onDownload,
  onMove,
  onCopy,
  onAddToCollection,
  onNewCollection,
  onArchive,
  onDelete,
}: SelectionBarProps) {
  return (
    <ActionBar
      isOpen={count > 0}
      amountSelected={count}
      onClose={onClear}
      closeAriaLabel="Clear selection"
    >
      <Button variant="secondary" preset="border" size="sm" onClick={onDownload}>
        <Button.Icon icon={RiDownloadLine} />
        Download
      </Button>
      <Button variant="secondary" preset="border" size="sm" onClick={onMove}>
        <Button.Icon icon={RiFolderTransferLine} />
        Move
      </Button>
      <Button variant="secondary" preset="border" size="sm" onClick={onCopy}>
        <Button.Icon icon={RiFileCopyLine} />
        Copy
      </Button>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" preset="border" size="sm">
            <Button.Icon icon={RiStackLine} />
            Add to collection
            <Button.Icon icon={RiArrowDownSLine} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="top" align="start" className="w-[14rem]">
          {collections.map((collection) => (
            <DropdownMenu.Item
              key={collection.id}
              onSelect={() => onAddToCollection(collection.id)}
            >
              <ListItem.Prefix>
                <RiStackLine className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{collection.name}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={onNewCollection}>
            <ListItem.Prefix>
              <RiAddLine className="size-ws-9" />
            </ListItem.Prefix>
            <ListItem.Content>
              <ListItem.Label>New collection</ListItem.Label>
            </ListItem.Content>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Button variant="secondary" preset="border" size="sm" onClick={onArchive}>
        <Button.Icon icon={RiArchiveLine} />
        Archive
      </Button>
      <Button variant="danger" preset="border" size="sm" onClick={onDelete}>
        <Button.Icon icon={RiDeleteBinLine} />
        Delete
      </Button>
    </ActionBar>
  );
}
