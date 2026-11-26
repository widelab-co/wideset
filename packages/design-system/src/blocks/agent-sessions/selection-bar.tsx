import { RiArchiveLine, RiStopCircleLine } from '@remixicon/react';
import { ActionBar, Button } from '@wideset/react';

type SelectionBarProps = {
  count: number;
  /** Whether any selected session is still at work or waiting: only those can be stopped. */
  canStop: boolean;
  onClear: () => void;
  onStop: () => void;
  onArchive: () => void;
};

/**
 * The actions on the selected sessions, floating over the page while anything is selected: Stop
 * for the ones still at work, Archive to clear them from the list. Neither is filled.
 */
export function SelectionBar({ count, canStop, onClear, onStop, onArchive }: SelectionBarProps) {
  return (
    <ActionBar
      isOpen={count > 0}
      amountSelected={count}
      onClose={onClear}
      closeAriaLabel="Clear selection"
    >
      <Button variant="secondary" preset="border" size="sm" disabled={!canStop} onClick={onStop}>
        <Button.Icon icon={RiStopCircleLine} />
        Stop
      </Button>
      <Button variant="secondary" preset="border" size="sm" onClick={onArchive}>
        <Button.Icon icon={RiArchiveLine} />
        Archive
      </Button>
    </ActionBar>
  );
}
