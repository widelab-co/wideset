import {
  type RemixiconComponentType,
  RiArchive2Line,
  RiArrowGoBackLine,
  RiAttachment2,
  RiChat3Line,
  RiDeleteBin6Line,
  RiEmotion2Line,
  RiMoreFill,
  RiPauseMiniFill,
  RiPlayMiniFill,
  RiSendPlaneFill,
  RiSidebarUnfoldLine,
  RiTimeLine,
} from '@remixicon/react';
import {
  Avatar,
  cn,
  IconButton,
  RadioButton,
  RadioButtonGroup,
  Slider,
  Textarea,
  Tooltip,
} from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import { Dot, PersonAvatar } from './chat-list';
import { conversation, type Message, messages } from './data';

const MAX_LENGTH = 500;

const Action = ({
  icon,
  label,
  onClick,
}: {
  icon: RemixiconComponentType;
  label: string;
  onClick?: () => void;
}) => (
  <IconButton
    icon={icon}
    variant="secondary"
    preset="ghost"
    size="sm"
    aria-label={label}
    onClick={onClick}
  />
);

/** Figma's audio message: play, a seek bar and the length. */
function AudioMessage({ duration, progress }: { duration: string; progress: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-ws-dynamic-primary-alpha-strong-default rounded-ws-container-sm px-ws-5 py-ws-7 gap-ws-5 flex w-[15.9375rem] items-center">
      <IconButton
        icon={playing ? RiPauseMiniFill : RiPlayMiniFill}
        size="xs"
        aria-label={playing ? 'Pause' : 'Play'}
        onClick={() => setPlaying(!playing)}
      />
      <Slider defaultValue={[progress]} aria-label="Playback position" className="min-w-0 flex-1" />
      <span className="typography-body-sm text-ws-static-subtle tabular-nums">{duration}</span>
    </div>
  );
}

function Poll({
  question,
  options,
  votes,
}: {
  question: string;
  options: string[];
  votes: number;
}) {
  return (
    <div className="bg-ws-static-alpha-subtle rounded-ws-container-sm p-ws-5 gap-ws-5 flex w-[16.5625rem] flex-col">
      <p className="typography-body-md text-ws-static-base">{question}</p>
      <RadioButtonGroup aria-label={question} className="gap-ws-2">
        {options.map((option) => (
          <div
            key={option}
            className="bg-ws-static-alpha-subtle rounded-ws-container-sm px-ws-5 py-ws-4"
          >
            <RadioButton size="sm" value={option} label={option} />
          </div>
        ))}
      </RadioButtonGroup>
      <p className="typography-body-sm text-ws-static-subtle gap-ws-3 flex items-center justify-end">
        {votes} votes
        <Dot />
        Vote to see results
      </p>
    </div>
  );
}

/** A message: received on the left beside the sender, sent on the right in the brand tint. */
function MessageItem({ message }: { message: Message }) {
  const { from } = message;
  const body =
    message.kind === 'audio' ? (
      <AudioMessage duration={message.duration} progress={message.progress} />
    ) : message.kind === 'poll' ? (
      <Poll question={message.question} options={message.options} votes={message.votes} />
    ) : (
      <p
        className={cn(
          'rounded-ws-container-sm p-ws-5 typography-body-md max-w-[22.25rem] break-words',
          from
            ? 'bg-ws-static-alpha-subtle text-ws-static-base'
            : 'bg-ws-dynamic-primary-alpha-strong-default text-ws-non-semantic-indigo-on-subtle',
        )}
      >
        {message.text}
      </p>
    );

  return (
    <li className={cn('group flex', !from && 'justify-end')}>
      <div className="gap-ws-3 flex flex-col items-start">
        <div className="gap-ws-5 relative flex items-end">
          {from && <PersonAvatar person={from} size="sm" />}
          {body}
          {/* The message's actions, beside the bubble on hover or focus. */}
          <div
            className={cn(
              'gap-ws-5 absolute top-1/2 flex -translate-y-1/2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
              from ? 'ml-ws-5 left-full' : 'mr-ws-5 right-full',
            )}
          >
            <Action icon={RiDeleteBin6Line} label="Delete message" />
            <Action icon={RiMoreFill} label="More actions" />
          </div>
        </div>
        {message.kind !== 'poll' && (
          <p
            className={cn(
              'typography-body-sm text-ws-static-subtle gap-ws-3 flex items-center',
              from && 'pl-ws-14',
            )}
          >
            {message.time}
            {from && (
              <>
                <span aria-hidden="true">•</span>
                {from.name}
              </>
            )}
          </p>
        )}
      </div>
    </li>
  );
}

/** The open chat: header with actions, the messages and the composer. */
export function Conversation({
  onArchive,
  onShowDetails,
}: {
  onArchive: () => void;
  /** Set while the contact panel is closed: shows a button that opens it again. */
  onShowDetails?: () => void;
}) {
  const [thread, setThread] = useState(messages);
  const [draft, setDraft] = useState('');
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [thread.length]);

  const send = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setThread([...thread, { id: String(Date.now()), kind: 'text', time: 'Just now', text }]);
    setDraft('');
  };

  return (
    <section
      aria-labelledby="conversation-title"
      className="border-ws-static-subtle flex min-w-0 flex-1 flex-col border-r"
    >
      <header className="gap-ws-9 px-ws-11 h-ws-19 border-ws-static-base flex shrink-0 items-center border-b">
        <div className="gap-ws-7 flex min-w-0 items-center">
          <Avatar.Group className="w-fit">
            {conversation.people.map(({ name, initials, color, status }) => (
              <Avatar
                key={name}
                initials={initials}
                color={color}
                status={status}
                aria-label={name}
              />
            ))}
          </Avatar.Group>
          <h2
            id="conversation-title"
            className="typography-label-strong-md text-ws-static-strong truncate"
          >
            {conversation.title}
          </h2>
        </div>
        <div className="gap-ws-5 ml-auto flex items-center">
          <Action icon={RiArrowGoBackLine} label="Reply" />
          <Tooltip size="sm">
            <Tooltip.Trigger asChild>
              <IconButton
                icon={RiTimeLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                aria-label="History"
                aria-keyshortcuts="Meta+H"
              />
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Tooltip.Label>History ⌘H</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Action icon={RiArchive2Line} label="Archive chat" onClick={onArchive} />
          <Action icon={RiDeleteBin6Line} label="Delete" />
          <Action icon={RiMoreFill} label="More actions" />
          {onShowDetails && (
            <Action icon={RiSidebarUnfoldLine} label="Show details" onClick={onShowDetails} />
          )}
        </div>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <ol aria-label="Messages" className="p-ws-9 gap-ws-7 flex flex-col">
          {thread.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </ol>
      </div>

      <form onSubmit={send} className="p-ws-5 shrink-0">
        <div className="bg-ws-static-alpha-subtle rounded-ws-container-lg p-ws-3 gap-ws-3 flex flex-col">
          <div className="px-ws-4 flex items-center justify-between">
            <div className="gap-ws-2 flex">
              <Action icon={RiAttachment2} label="Attach a file" />
              <Action icon={RiEmotion2Line} label="Add an emoji" />
              <Action icon={RiChat3Line} label="Reply in a thread" />
            </div>
            <span className="typography-label-sm text-ws-static-subtle tabular-nums">
              {draft.length}/{MAX_LENGTH}
            </span>
          </div>
          <div className="relative">
            <Textarea
              aria-label="Message"
              placeholder="Write a message..."
              rows={6}
              resize="none"
              maxLength={MAX_LENGTH}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) send(event);
              }}
            />
            <IconButton
              type="submit"
              icon={RiSendPlaneFill}
              variant="secondary"
              size="sm"
              aria-label="Send"
              className="right-ws-4 bottom-ws-4 absolute"
            />
          </div>
        </div>
      </form>
    </section>
  );
}
