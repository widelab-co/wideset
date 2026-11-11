// TODO(custom): an invitation row with Accept and Decline, drawn on ActionTile's border box; ActionTile is one control and may not hold buttons, and ListItem reads as clickable.
import { Avatar, Button } from '@wideset/react';
import { useId } from 'react';

import type { Invitation } from './data';

/**
 * ActionTile's `border` box, without its hover: the row is not a control, its buttons are. On a
 * narrow card the buttons wrap under the name instead of squeezing it.
 */
const BOX =
  'rounded-ws-container-md bg-ws-static-highlight-base inset-ring inset-ring-[var(--ws-dynamic-stroke-secondary-default)] min-h-ws-20 gap-ws-7 px-ws-9 py-ws-7 flex flex-wrap items-center';

type InvitationListProps = {
  invitations: Invitation[];
  onAccept: (invitation: Invitation) => void;
  onDecline: (invitation: Invitation) => void;
};

/**
 * Invitations waiting for this account, as their own short group under the workspaces: the same
 * box and square avatar as a workspace tile, so the two read as one kind of thing, with who
 * invited you under the name and Accept and Decline in place of the arrow. Accept is the bordered
 * one, Decline the quiet one; both name the workspace for a screen reader.
 */
export function InvitationList({ invitations, onAccept, onDecline }: InvitationListProps) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-7 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        Invitations
      </h2>
      <ul className="gap-ws-5 flex flex-col">
        {invitations.map((invitation) => (
          <li key={invitation.id} className={BOX}>
            <Avatar
              aria-hidden="true"
              shape="square"
              initials={invitation.initials}
              color={invitation.color}
            />
            <div className="gap-ws-3 flex min-w-[8rem] flex-1 flex-col">
              <p className="typography-label-strong-sm text-ws-static-strong truncate">
                {invitation.name}
              </p>
              <p className="typography-body-sm text-ws-static-subtle truncate">
                Invited by {invitation.invitedBy}
              </p>
            </div>
            <div className="gap-ws-5 ml-auto flex shrink-0">
              <Button
                variant="secondary"
                preset="ghost"
                aria-label={`Decline ${invitation.name}`}
                onClick={() => onDecline(invitation)}
              >
                Decline
              </Button>
              <Button
                variant="secondary"
                preset="border"
                aria-label={`Accept ${invitation.name}`}
                onClick={() => onAccept(invitation)}
              >
                Accept
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
