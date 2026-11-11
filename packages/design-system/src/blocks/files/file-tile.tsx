// TODO(custom): a file as a selectable tile with a preview, a checkbox and a menu; Tile.Checkbox is one button with no room for a menu, and Card has no selected state.
import { RiPushpinFill } from '@remixicon/react';
import { Checkbox, cn, ProgressBar } from '@wideset/react';
import { useId } from 'react';

import { type Item, PEOPLE } from './data';
import { FileIcon } from './file-icon';
import { FilePreview } from './file-preview';
import { formatModified } from './format';
import { type RowAction, RowMenu } from './row-menu';

type FileTileProps = {
  item: Item;
  selected: boolean;
  /** Something is selected: every tile then shows its checkbox, not only on hover. */
  selecting: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onAction: (action: RowAction) => void;
};

/** The whole tile is the target of its name: a stretched layer under the tile's own controls. */
const STRETCH = 'after:inset-ws-0 after:absolute cursor-pointer';

/**
 * One file or folder in the grid. A file draws its shape and, under it, its name, owner and
 * date; a folder is one row, since it has nothing to preview. A click anywhere selects a file
 * (the brand outline, as on a selected Tile) and opens a folder; the checkbox shows on hover and
 * stays while anything is selected. A file still uploading shows its progress instead.
 */
export function FileTile({ item, selected, selecting, onToggle, onOpen, onAction }: FileTileProps) {
  const checkboxId = useId();
  const folder = item.kind === 'folder';
  const uploading = item.progress !== undefined;
  const owner = PEOPLE[item.owner];
  const showCheckbox = selected || selecting;

  const checkbox = (
    <Checkbox
      id={checkboxId}
      checked={selected}
      onCheckedChange={onToggle}
      aria-label={`Select ${item.name}`}
      className={cn(
        'relative z-10',
        !showCheckbox && 'opacity-0 group-hover/tile:opacity-100 focus-visible:opacity-100',
      )}
    />
  );

  // A file's name is the label of its checkbox, so a click on the tile selects it; a folder's
  // name is the button that opens it.
  const name = folder ? (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        STRETCH,
        'typography-label-strong-sm text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default truncate text-left',
      )}
    >
      {item.name}
    </button>
  ) : (
    <label
      htmlFor={uploading ? undefined : checkboxId}
      title={item.name}
      className={cn(
        !uploading && STRETCH,
        'typography-label-strong-sm text-ws-static-strong truncate',
      )}
    >
      {item.name}
    </label>
  );

  return (
    <div
      className={cn(
        'group/tile rounded-ws-container-md border-ws-static-base relative flex flex-col overflow-hidden border',
        !uploading && 'hover:border-ws-static-strong',
        selected &&
          'border-ws-dynamic-primary-strong-default hover:border-ws-dynamic-primary-strong-default outline-ws-dynamic-primary-default/20 outline-2',
      )}
    >
      {!folder && (
        <>
          <FilePreview kind={item.kind as Exclude<Item['kind'], 'folder'>} />
          {!uploading && <div className="top-ws-5 left-ws-5 absolute flex">{checkbox}</div>}
          {item.pinned && (
            <RiPushpinFill
              role="img"
              aria-label="Pinned"
              className="size-ws-9 text-ws-static-base top-ws-5 right-ws-5 absolute"
            />
          )}
        </>
      )}

      <div
        className={cn(
          'gap-ws-5 py-ws-5 pr-ws-5 flex items-center',
          folder ? 'pl-ws-5' : 'border-ws-static-subtle pl-ws-7 border-t',
        )}
      >
        {/* A folder's icon gives way to its checkbox on hover, so the row keeps its width. */}
        {folder && (
          <div className="grid shrink-0 place-items-center *:col-start-1 *:row-start-1">
            <FileIcon
              kind="folder"
              className={cn(showCheckbox ? 'opacity-0' : 'group-hover/tile:opacity-0')}
            />
            {checkbox}
          </div>
        )}
        <div className="gap-ws-1 flex min-w-0 flex-1 flex-col">
          {name}
          {uploading ? (
            <ProgressBar
              value={Math.round((item.progress ?? 0) * 100)}
              aria-label={`Uploading ${item.name}`}
              className="my-ws-3"
            />
          ) : (
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {owner.name} · {formatModified(item.modified)}
            </span>
          )}
        </div>
        {!uploading && (
          <div className="relative z-10 flex">
            <RowMenu item={item} onAction={onAction} />
          </div>
        )}
      </div>
    </div>
  );
}
