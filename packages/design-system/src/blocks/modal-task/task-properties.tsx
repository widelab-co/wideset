// TODO(custom): property rows (a name beside its value) and a priority dot; no DescriptionList or status dot in Wideset.
import { Avatar, ProgressBar } from '@wideset/react';
import type { ReactNode } from 'react';

import type { Person } from './data';

type TaskPropertiesProps = {
  assignee: Person;
  priority: string;
  /** 0–100, worked out from the subtasks. */
  progress: number;
};

/** The task's properties, one to a 32px row: who has it, how urgent it is, how far along. */
export function TaskProperties({ assignee, priority, progress }: TaskPropertiesProps) {
  return (
    <dl className="flex flex-col">
      <Property label="Assigned to">
        {/* One letter: at 24px the status dot would sit on a second one. */}
        <Avatar
          size="sm"
          initials={assignee.initials.charAt(0)}
          color={assignee.color}
          status="online"
        />
        {assignee.name}
      </Property>
      <Property label="Priority">
        {/* Figma's dot (#a11c2a) is unbound: the strong negative fill stands in. */}
        <span
          aria-hidden="true"
          className="size-ws-5 rounded-ws-control-full bg-ws-semantic-inverse-negative shrink-0"
        />
        {priority}
      </Property>
      <Property label="Progress">
        <ProgressBar type="circle" value={progress} aria-label="Task progress" />
      </Property>
    </dl>
  );
}

/** A property row: its name in a 120px column, the value 16px after it. */
function Property({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-ws-14 flex items-center">
      <dt className="typography-body-md text-ws-static-subtle w-[7.5rem] shrink-0">{label}</dt>
      <dd className="gap-ws-5 pl-ws-9 typography-label-strong-sm text-ws-static-base flex items-center">
        {children}
      </dd>
    </div>
  );
}
