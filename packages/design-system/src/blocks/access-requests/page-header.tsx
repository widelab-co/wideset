// TODO(custom): page header (title, a line of description, the primary action); no PageHeader in Wideset.
import { RiUserAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import { workspace } from './data';

/**
 * The page's title, what it is for in one line, and the screen's one filled button: inviting is
 * the way in that does not wait for anyone to ask. While a dialog holds the filled button,
 * Invite people steps back to a bordered one (`quiet`), so the screen keeps one.
 */
export function PageHeader({ onInvite, quiet }: { onInvite: () => void; quiet?: boolean }) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Access</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Who gets into {workspace.name}: people asking to join, invitations you sent and anyone who
          is blocked.
        </p>
      </div>
      <Button
        size="sm"
        variant={quiet ? 'secondary' : 'primary'}
        preset={quiet ? 'border' : 'filled'}
        onClick={onInvite}
      >
        <Button.Icon icon={RiUserAddLine} />
        Invite people
      </Button>
    </header>
  );
}
