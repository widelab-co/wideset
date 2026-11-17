import type { Item } from './data';
import { FileTile } from './file-tile';
import type { RowAction } from './row-menu';

type FileGridProps = {
  rows: Item[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onOpen: (item: Item) => void;
  onAction: (item: Item, action: RowAction) => void;
};

/**
 * The files as tiles: folders first, as a row of short tiles with nothing to preview, then the
 * files with their drawn shape. As many columns as fit, since the sidebar opens and closes.
 */
export function FileGrid({ rows, selected, onSelectedChange, onOpen, onAction }: FileGridProps) {
  const folders = rows.filter((row) => row.kind === 'folder');
  const files = rows.filter((row) => row.kind !== 'folder');
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  const tile = (item: Item) => (
    <li key={item.id}>
      <FileTile
        item={item}
        selected={selected.includes(item.id)}
        selecting={selected.length > 0}
        onToggle={() => toggle(item.id)}
        onOpen={() => onOpen(item)}
        onAction={(action) => onAction(item, action)}
      />
    </li>
  );

  return (
    <div className="gap-ws-9 flex flex-col">
      {folders.length > 0 && (
        <ul
          aria-label="Folders"
          className="gap-ws-7 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]"
        >
          {folders.map(tile)}
        </ul>
      )}
      {files.length > 0 && (
        <ul
          aria-label="Files"
          className="gap-ws-7 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]"
        >
          {files.map(tile)}
        </ul>
      )}
    </div>
  );
}
