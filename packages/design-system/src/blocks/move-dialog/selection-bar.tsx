import { RiArchiveLine, RiDownloadLine, RiFolderTransferLine } from '@remixicon/react';
import { ActionBar, Button } from '@wideset/react';

type SelectionBarProps = {
  count: number;
  onClear: () => void;
  onDownload: () => void;
  onMove: () => void;
  onArchive: () => void;
};

/**
 * What can be done to every selected file at once, floating over the page while anything is
 * selected: take it, put it somewhere, or put it away. Move opens the dialog.
 */
export function SelectionBar({ count, onClear, onDownload, onMove, onArchive }: SelectionBarProps) {
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
      <Button variant="secondary" preset="border" size="sm" onClick={onArchive}>
        <Button.Icon icon={RiArchiveLine} />
        Archive
      </Button>
    </ActionBar>
  );
}
