import { RiAddLine } from '@remixicon/react';
import { Avatar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { account, workspaces } from './data';

/**
 * The workspace rail left of the sidebar: switch between workspaces, add one, reach the account.
 * Figma's `Workspaces` frame: Static/Fill/Background with Elevation/Low, which also draws its edge.
 * `z-ws-base` lifts it so that edge paints over the sidebar beside it.
 */
export function WorkspaceRail() {
  const [current, setCurrent] = useState('wideset');

  return (
    <nav
      aria-label="Workspaces"
      className="bg-ws-static-background shadow-ws-low z-ws-base py-ws-9 relative flex w-[4.1875rem] shrink-0 flex-col items-center justify-between"
    >
      <div className="gap-ws-7 flex flex-col items-center">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            type="button"
            aria-label={workspace.name}
            aria-current={current === workspace.id ? 'true' : undefined}
            onClick={() => setCurrent(workspace.id)}
            className="rounded-ws-control-lg focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex"
          >
            {workspace.id === 'wideset' ? (
              // The product's own workspace shows its mark; the ring is Avatar's selection ring.
              <span className="relative flex">
                <BrandMark />
                {current === workspace.id && (
                  <span
                    aria-hidden="true"
                    className="outline-ws-dynamic-primary-strong-default rounded-ws-control-lg pointer-events-none absolute inset-0 outline-2 outline-offset-2 outline-solid"
                  />
                )}
              </span>
            ) : (
              <Avatar
                shape="square"
                initials={workspace.initials}
                color={workspace.color}
                selected={current === workspace.id}
              />
            )}
          </button>
        ))}
        <button
          type="button"
          aria-label="Add workspace"
          className="group size-ws-14 rounded-ws-control-full focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-center justify-center"
        >
          <span className="bg-ws-dynamic-secondary-default group-hover:bg-ws-dynamic-secondary-hover size-ws-11 rounded-ws-control-full text-ws-static-strong flex items-center justify-center">
            <RiAddLine aria-hidden="true" className="size-ws-7" />
          </span>
        </button>
      </div>
      <Avatar initials={account.initials} status="online" title={account.name} />
    </nav>
  );
}
