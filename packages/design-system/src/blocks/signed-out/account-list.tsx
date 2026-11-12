import { RiArrowRightLine, RiLoader4Line } from '@remixicon/react';
import { ActionTile, Avatar } from '@wideset/react';

import type { Account } from './data';

type AccountListProps = {
  accounts: Account[];
  /** The account being continued as, while it signs in. */
  busy?: string;
  onContinue: (account: Account) => void;
};

/**
 * The accounts still signed in on this device, one `ActionTile` each: the whole tile continues as
 * that person, the way an account chooser works, and its name reads "Continue as …" to a screen
 * reader. The one being opened swaps its arrow for a spinner and says it is busy; the others stay
 * as they are, so nothing jumps.
 */
export function AccountList({ accounts, busy, onContinue }: AccountListProps) {
  return (
    <ul className="gap-ws-5 flex flex-col">
      {accounts.map((account) => {
        const opening = busy === account.id;
        return (
          <li key={account.id}>
            <ActionTile aria-busy={opening || undefined} onClick={() => onContinue(account)}>
              <Avatar aria-hidden="true" initials={account.initials} color={account.color} />
              <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
                <ActionTile.Title className="truncate">
                  <span className="sr-only">Continue as </span>
                  {account.name}
                </ActionTile.Title>
                <ActionTile.Description className="truncate">
                  {account.email}
                </ActionTile.Description>
              </div>
              <ActionTile.Icon
                icon={opening ? RiLoader4Line : RiArrowRightLine}
                className={opening ? 'animate-spin motion-reduce:animate-none' : undefined}
              />
            </ActionTile>
          </li>
        );
      })}
    </ul>
  );
}
