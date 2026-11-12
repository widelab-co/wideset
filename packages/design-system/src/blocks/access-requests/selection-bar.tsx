import { RiCheckLine, RiCloseLine } from '@remixicon/react';
import { ActionBar, Button } from '@wideset/react';

import { ApprovePopup } from './approve-popup';
import type { Role } from './data';

/**
 * The answer for every selected request at once, floating over the page while anything is
 * selected. Approve asks for one role for all of them first, as in the row; Decline declines
 * at once, with Undo in its toast.
 */
export function SelectionBar({
  count,
  seatsUsed,
  onClear,
  onApprove,
  onDecline,
}: {
  count: number;
  seatsUsed: number;
  onClear: () => void;
  onApprove: (role: Role) => void;
  onDecline: () => void;
}) {
  return (
    <ActionBar
      isOpen={count > 0}
      amountSelected={count}
      onClose={onClear}
      closeAriaLabel="Clear selection"
    >
      <ApprovePopup
        title={count === 1 ? 'Approve 1 person' : `Approve ${count} people`}
        count={count}
        seatsUsed={seatsUsed}
        side="top"
        onApprove={onApprove}
      >
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiCheckLine} />
          Approve
        </Button>
      </ApprovePopup>
      <Button variant="secondary" preset="border" size="sm" onClick={onDecline}>
        <Button.Icon icon={RiCloseLine} />
        Decline
      </Button>
    </ActionBar>
  );
}
