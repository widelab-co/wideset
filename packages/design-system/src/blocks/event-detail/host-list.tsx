// TODO(custom): person rows with an e-mail action; Wideset has no person row (ListItem is a 32px menu row with its own hover).
import { RiMailLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';

import type { Host } from './data';
import { PersonAvatar } from './person-avatar';

/**
 * The hosts, each with a way to reach them: a quiet e-mail button at the row's end, named for the
 * person it writes to.
 */
export function HostList({ hosts }: { hosts: Host[] }) {
  return (
    <ul className="gap-ws-7 flex flex-col">
      {hosts.map((host) => (
        <li key={host.id} className="gap-ws-5 flex items-center">
          <PersonAvatar
            name={host.name}
            initials={host.initials}
            color={host.color}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-strong truncate">
              {host.name}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {host.role}
            </span>
          </div>
          <IconButton asChild icon={RiMailLine} variant="secondary" preset="ghost" size="sm">
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- IconButton slots its icon into the anchor, which is named by its label */}
            <a href={`mailto:${host.email}`} aria-label={`E-mail ${host.name}`} />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
