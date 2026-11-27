// TODO(custom): mail row (avatar, sender and company, subject, one line of the message, time, star, unread dot, attached files); ListItem is a one-line menu row with a brand-tinted checked state.
import { RiAttachment2, RiStarFill } from '@remixicon/react';
import { cn, Tag } from '@wideset/react';
import { forwardRef } from 'react';

import { account, type Conversation } from './data';
import { formatDateTime, formatListTime } from './format';
import { PersonAvatar } from './person-avatar';

type ConversationRowProps = {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
};

/**
 * One conversation in the list: one target across the whole row. The sender's avatar leads, so
 * the list scans by person; their company follows the name, quieter. The preview runs the whole
 * message on, past the greeting, and a file sent in the conversation shows as a tag under it. An
 * unread one carries weight and a dot, never a count; the open one takes the neutral selected
 * fill of the sidebar's active item.
 */
export const ConversationRow = forwardRef<HTMLButtonElement, ConversationRowProps>(
  ({ conversation, selected, onSelect }, ref) => {
    const { contact, customer, subject, messages, unread, starred } = conversation;
    const last = messages[messages.length - 1];
    const files = messages.flatMap((message) => message.attachments ?? []);
    return (
      <button
        ref={ref}
        type="button"
        aria-current={selected || undefined}
        onClick={onSelect}
        className={cn(
          'gap-ws-7 px-ws-7 py-ws-6 rounded-ws-control-lg flex w-full text-left',
          'hover:bg-ws-static-alpha-subtle aria-[current=true]:bg-ws-dynamic-tertiary-alpha-strong-default',
          'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
        )}
      >
        <PersonAvatar
          name={contact.name}
          initials={contact.initials}
          color={contact.color}
          aria-hidden
        />
        <span className="gap-ws-2 flex min-w-0 flex-1 flex-col">
          <span className="gap-ws-5 flex items-center">
            <span className="gap-ws-3 flex min-w-0 flex-1 items-baseline">
              <span
                className={cn(
                  'shrink-0',
                  unread
                    ? 'typography-body-strong-md text-ws-static-strong'
                    : 'typography-body-md text-ws-static-base',
                )}
              >
                {contact.name}
              </span>
              <span className="typography-caption-md text-ws-static-subtle truncate">
                {customer}
              </span>
            </span>
            {starred && (
              <RiStarFill
                role="img"
                aria-label="Starred"
                className="size-ws-7 text-ws-static-subtle shrink-0"
              />
            )}
            <time
              dateTime={last.at}
              title={formatDateTime(last.at)}
              className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
            >
              {formatListTime(last.at)}
            </time>
          </span>
          <span className="gap-ws-5 flex items-center">
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                unread
                  ? 'typography-body-strong-md text-ws-static-strong'
                  : 'typography-body-md text-ws-static-base',
              )}
            >
              {subject}
            </span>
            {unread && (
              <span className="bg-ws-dynamic-primary-default rounded-ws-control-full size-ws-4 shrink-0">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </span>
          <span className="typography-body-md text-ws-static-subtle truncate">
            {last.from === account && 'You: '}
            {last.body.join(' ')}
          </span>
          {files.length > 0 && (
            <span className="gap-ws-3 pt-ws-3 flex flex-wrap">
              {files.map((file) => (
                <Tag key={file.name} size="sm" color="secondary">
                  <Tag.Icon icon={RiAttachment2} />
                  {file.name}
                </Tag>
              ))}
            </span>
          )}
        </span>
      </button>
    );
  },
);
ConversationRow.displayName = 'ConversationRow';
