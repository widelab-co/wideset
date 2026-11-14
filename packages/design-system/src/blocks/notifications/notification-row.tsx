// TODO(custom): notification row (actor, sentence, preview, age, unread dot); ListItem is a one-line menu row with a brand-tinted checked state.
import { RiBankCardLine, RiCalendarScheduleLine } from '@remixicon/react';
import { Avatar, cn } from '@wideset/react';
import { forwardRef } from 'react';

import type { Notification } from './data';
import { formatAge, formatDateTime } from './format';
import { PersonAvatar } from './person-avatar';

/**
 * Who did it: a person's initials, or, when Orbit itself reports it, an icon for what it is about
 * (a payment, a renewal) in the same neutral circle.
 */
export function Actor({ notification }: { notification: Notification }) {
  const { actor, subject } = notification;
  if (actor) return <PersonAvatar name={actor.name} initials={actor.initials} aria-hidden />;
  const Icon = subject.kind === 'Invoice' ? RiBankCardLine : RiCalendarScheduleLine;
  return <Avatar icon={<Icon />} aria-hidden />;
}

/**
 * The notification as one sentence: who, what, and on what. The actor and the target are what the
 * eye looks for: `emphasis` gives them weight (an unread row, the open detail).
 */
export function Sentence({
  notification,
  emphasis,
}: {
  notification: Notification;
  emphasis: boolean;
}) {
  const { actor, action, target, trail } = notification;
  const name = emphasis ? 'text-ws-static-strong font-ws-medium' : undefined;
  return (
    <>
      {actor && <span className={name}>{actor.name}</span>}
      {actor && ' '}
      {action && `${action} `}
      <span className={name}>{target}</span>
      {trail && ` ${trail}`}
    </>
  );
}

type NotificationRowProps = {
  notification: Notification;
  selected: boolean;
  onSelect: () => void;
};

/**
 * One notification in the list: one target across the whole row. Unread rows carry weight and a
 * dot; the open one takes the neutral selected fill of the sidebar's active item.
 */
export const NotificationRow = forwardRef<HTMLButtonElement, NotificationRowProps>(
  ({ notification, selected, onSelect }, ref) => {
    const unread = !notification.read;
    return (
      <button
        ref={ref}
        type="button"
        aria-current={selected || undefined}
        onClick={onSelect}
        className={cn(
          'gap-ws-7 px-ws-7 py-ws-6 rounded-ws-control-lg flex w-full items-start text-left',
          'hover:bg-ws-static-alpha-subtle aria-[current=true]:bg-ws-dynamic-tertiary-alpha-strong-default',
          'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
        )}
      >
        <Actor notification={notification} />
        <span className="gap-ws-2 flex min-w-0 flex-1 flex-col">
          <span className="gap-ws-5 flex items-start">
            <span className="typography-body-md text-ws-static-base line-clamp-2 min-w-0 flex-1">
              <Sentence notification={notification} emphasis={unread} />
            </span>
            <time
              dateTime={notification.at}
              title={formatDateTime(notification.at)}
              className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums"
            >
              {formatAge(notification.at)}
            </time>
          </span>
          <span className="gap-ws-5 flex items-center">
            <span className="typography-label-sm text-ws-static-subtle min-w-0 flex-1 truncate">
              {notification.preview}
            </span>
            {unread && (
              <span className="bg-ws-dynamic-primary-default rounded-ws-control-full size-ws-4 shrink-0">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </span>
        </span>
      </button>
    );
  },
);
NotificationRow.displayName = 'NotificationRow';
