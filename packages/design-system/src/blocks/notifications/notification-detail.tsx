import {
  RiArrowRightLine,
  RiMailOpenLine,
  RiMailUnreadLine,
  RiNotificationOffLine,
} from '@remixicon/react';
import { Button, IconButton, InlineAlert, StatusBadge, Textarea, Tooltip } from '@wideset/react';
import { type FormEvent, type ReactNode, useId, useState } from 'react';

import { CommentThread } from './comment-thread';
import type { Message, Notification } from './data';
import { FactsList } from './facts-list';
import { formatDateTime, formatWhen } from './format';
import { Actor, Sentence } from './notification-row';

/** A ghost icon button with its name in a tooltip: the detail's quiet actions. */
function Action({
  icon,
  label,
  onClick,
}: {
  icon: typeof RiMailOpenLine;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>
        <IconButton
          icon={icon}
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={label}
          onClick={onClick}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}

/** A titled part of the detail. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="gap-ws-9 flex flex-col">
      <h3 id={id} className="typography-label-strong-md text-ws-static-strong">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Answers the thread in place; the reply joins it. */
function ReplyForm({ to, onReply }: { to: string; onReply: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onReply(text);
    setDraft('');
  };
  return (
    <form onSubmit={submit} className="gap-ws-5 flex flex-col">
      <Textarea
        aria-label="Reply"
        placeholder={`Reply to ${to.split(' ')[0]}…`}
        rows={3}
        resize="none"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) submit(event);
        }}
      />
      <Button type="submit" size="sm" variant="secondary" preset="border" className="self-end">
        Reply
      </Button>
    </form>
  );
}

type NotificationDetailProps = {
  notification: Notification;
  /** Replies written here, after the thread's own messages. */
  replies: Message[];
  onReply: (text: string) => void;
  onToggleRead: () => void;
  onMute: () => void;
};

/**
 * The open notification: what it is about and the way to it, what happened (the comment, the
 * change, the alert), and the record's facts.
 */
export function NotificationDetail({
  notification,
  replies,
  onReply,
  onToggleRead,
  onMute,
}: NotificationDetailProps) {
  const { subject, context } = notification;
  const titleId = useId();

  let story: ReactNode;
  if (context.type === 'comment') {
    const thread = [...context.thread, ...replies];
    story = (
      <div className="gap-ws-12 flex flex-col">
        <CommentThread messages={thread} />
        <ReplyForm to={context.thread[context.thread.length - 1].author.name} onReply={onReply} />
      </div>
    );
  } else if (context.type === 'change') {
    story = (
      <div className="gap-ws-7 flex">
        <Actor notification={notification} />
        <div className="gap-ws-5 flex min-w-0 flex-1 flex-col">
          <p className="gap-ws-5 flex items-baseline">
            <span className="typography-body-md text-ws-static-base">
              <Sentence notification={notification} emphasis />
            </span>
            <time
              dateTime={notification.at}
              title={formatDateTime(notification.at)}
              className="typography-label-sm text-ws-static-subtle shrink-0"
            >
              {formatWhen(notification.at)}
            </time>
          </p>
          <div className="gap-ws-5 flex items-center">
            <span className="typography-label-sm text-ws-static-subtle">{context.field}</span>
            <StatusBadge size="sm" color="neutral">
              <StatusBadge.Label>{context.from}</StatusBadge.Label>
            </StatusBadge>
            <RiArrowRightLine aria-hidden className="size-ws-9 text-ws-static-subtle" />
            <span className="sr-only">to</span>
            <StatusBadge size="sm" color="neutral">
              <StatusBadge.Label>{context.to}</StatusBadge.Label>
            </StatusBadge>
          </div>
        </div>
      </div>
    );
  } else {
    story = (
      <InlineAlert
        status={context.status}
        orientation="vertical"
        persistent
        title={context.title}
        message={context.text}
      />
    );
  }

  return (
    <section aria-labelledby={titleId} className="flex min-w-0 flex-1 flex-col">
      <header className="h-ws-24 border-ws-static-subtle shrink-0 border-b">
        <div className="gap-ws-9 px-ws-12 mx-auto flex h-full w-full max-w-[48rem] items-center justify-between">
          <div className="gap-ws-2 flex min-w-0 flex-col">
            <p className="typography-label-sm text-ws-static-subtle">{subject.kind}</p>
            <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong truncate">
              {subject.name}
            </h2>
          </div>
          <div className="gap-ws-5 flex shrink-0 items-center">
            <Action
              icon={notification.read ? RiMailUnreadLine : RiMailOpenLine}
              label={notification.read ? 'Mark as unread' : 'Mark as read'}
              onClick={onToggleRead}
            />
            <Action icon={RiNotificationOffLine} label="Mute this thread" onClick={onMute} />
            <Button size="sm" asChild>
              <a href={`#${notification.thread}`}>Open {subject.kind.toLowerCase()}</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="gap-ws-16 px-ws-12 py-ws-12 mx-auto flex w-full max-w-[48rem] flex-col">
          {story}
          <Section title="Details">
            <FactsList facts={subject.facts} />
          </Section>
        </div>
      </div>
    </section>
  );
}
