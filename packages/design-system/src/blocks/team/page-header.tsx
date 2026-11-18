// TODO(custom): page header (title, a line of description, the primary action); no PageHeader in Wideset.
import { RiUserAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import type { Ref } from 'react';

import { workspace } from './data';

/** The page's title, how many seats the plan has left, and the one primary action. */
export function PageHeader({
  seatsUsed,
  onInvite,
  inviteRef,
}: {
  seatsUsed: number;
  onInvite: () => void;
  inviteRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <header className="gap-ws-9 flex items-center justify-between">
      <div className="gap-ws-3 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">Team</h1>
        <p className="typography-body-md text-ws-static-base">
          <span className="tabular-nums">
            {seatsUsed} of {workspace.seats}
          </span>{' '}
          seats used on the {workspace.plan} plan
        </p>
      </div>
      <Button ref={inviteRef} size="sm" onClick={onInvite}>
        <Button.Icon icon={RiUserAddLine} />
        Invite people
      </Button>
    </header>
  );
}
