// TODO(custom): notification row (actor or icon, one sentence with the names strong, the time, an unread dot, inline actions for a request); ListItem is a one-line menu row.
import { RiCheckLine, RiCloseLine } from '@remixicon/react';
import { Avatar, Button, cn } from '@wideset/react';
import type { ReactNode } from 'react';

import type { Notification } from './data';
import { formatTime } from './format';
import { PersonAvatar } from './person-avatar';

/** The names the eye looks for: who did it and what it is about. */
const NAME = 'text-ws-static-strong font-ws-medium';

const ROW = 'gap-ws-7 px-ws-7 py-ws-6 rounded-ws-control-lg flex w-full items-start text-left';

/** The sentence: actor, action, target, trail, with the two names in strong text. */
function Sentence({ notification }: { notification: Notification }) {
  const { actor, action, target, trail } = notification;
  return (
    <>
      {actor && <span className={NAME}>{actor.name}</span>}
      {actor && ' '}
      {action && `${action} `}
      <span className={NAME}>{target}</span>
      {trail && ` ${trail}`}
    </>
  );
}

/** The row's inside: who, the sentence and its time (and what to do about it), the unread dot. */
function Body({ notification, children }: { notification: Notification; children?: ReactNode }) {
  const { actor, icon: Icon, at, read } = notification;
  return (
    <>
      {actor ? (
        <PersonAvatar name={actor.name} initials={actor.initials} aria-hidden />
      ) : (
        <Avatar icon={Icon && <Icon />} aria-hidden />
      )}
      <span className="gap-ws-2 flex min-w-0 flex-1 flex-col">
        <span className="typography-body-md text-ws-static-base">
          <Sentence notification={notification} />
        </span>
        <time dateTime={at} className="typography-caption-md text-ws-static-subtle tabular-nums">
          {formatTime(at)}
        </time>
        {children}
      </span>
      {/* The dot sits on the sentence's first line; the column stays when it goes, so text keeps
          its width. */}
      <span className="mt-ws-4 w-ws-4 flex shrink-0 justify-center">
        {!read && (
          <span className="bg-ws-dynamic-primary-default rounded-ws-control-full size-ws-4">
            <span className="sr-only">Unread</span>
          </span>
        )}
      </span>
    </>
  );
}

type NotificationItemProps = {
  notification: Notification;
  /** Opening a notification reads it (and, in an app, goes to what it is about). */
  onOpen: () => void;
  /** Answering a request; only a request has this. */
  onAnswer: (approved: boolean) => void;
};

/**
 * One notification: a person's avatar, or Orbit's icon for what it reports, the sentence and the
 * time under it, a dot on the right while unread. An ordinary row is one target across its width.
 * An access request is not: its Approve and Decline are the targets, and once answered they give
 * way to a quiet line saying what was decided.
 */
export function NotificationItem({ notification, onOpen, onAnswer }: NotificationItemProps) {
  const { request, actor } = notification;

  if (!request) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          ROW,
          'hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
        )}
      >
        <Body notification={notification} />
      </button>
    );
  }

  return (
    <div className={ROW}>
      <Body notification={notification}>
        {request.status === 'pending' ? (
          <span className="gap-ws-5 pt-ws-5 flex">
            <Button size="sm" onClick={() => onAnswer(true)}>
              Approve
            </Button>
            <Button size="sm" variant="secondary" preset="border" onClick={() => onAnswer(false)}>
              Decline
            </Button>
          </span>
        ) : (
          <span
            role="status"
            className="gap-ws-3 pt-ws-3 typography-body-md text-ws-static-subtle flex items-center"
          >
            {request.status === 'approved' ? (
              <>
                <RiCheckLine aria-hidden="true" className="size-ws-9 shrink-0" />
                {`Approved. ${actor?.name.split(' ')[0]} can view it now.`}
              </>
            ) : (
              <>
                <RiCloseLine aria-hidden="true" className="size-ws-9 shrink-0" />
                Declined
              </>
            )}
          </span>
        )}
      </Body>
    </div>
  );
}
