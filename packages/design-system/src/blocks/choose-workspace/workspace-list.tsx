import { RiArrowRightLine, RiLoader4Line } from '@remixicon/react';
import { ActionTile, Avatar } from '@wideset/react';

import type { Workspace } from './data';
import { workspaceFacts } from './format';

type WorkspaceListProps = {
  /** Each tile's id is this plus the workspace's, so the screen can move focus to one. */
  idPrefix: string;
  workspaces: Workspace[];
  /** The workspace opened last, marked in words. */
  lastUsed: string;
  /** The workspace being opened. */
  busy?: string;
  onChoose: (workspace: Workspace) => void;
};

/**
 * The workspaces an account belongs to, one `ActionTile` each: the whole tile opens it. A square
 * avatar (a workspace, not a person), the name, its size and plan as plain text, and "Last used"
 * in words on the one opened last. The one being opened swaps its arrow for a spinner and says it
 * is busy; the others stay as they are, so nothing jumps.
 */
export function WorkspaceList({
  idPrefix,
  workspaces,
  lastUsed,
  busy,
  onChoose,
}: WorkspaceListProps) {
  return (
    <ul className="gap-ws-5 flex flex-col">
      {workspaces.map((workspace) => {
        const opening = busy === workspace.id;
        return (
          <li key={workspace.id}>
            <ActionTile
              id={`${idPrefix}${workspace.id}`}
              aria-busy={opening || undefined}
              onClick={() => onChoose(workspace)}
            >
              <Avatar
                aria-hidden="true"
                shape="square"
                initials={workspace.initials}
                color={workspace.color}
              />
              <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
                <ActionTile.Title className="truncate">{workspace.name}</ActionTile.Title>
                <ActionTile.Description className="truncate">
                  {workspaceFacts(workspace)}
                </ActionTile.Description>
              </div>
              {workspace.id === lastUsed && (
                <span className="typography-body-sm text-ws-static-subtle shrink-0">Last used</span>
              )}
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
