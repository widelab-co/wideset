// TODO(custom): the messages waiting their turn, as a short list over the composer, each one editable and removable; Wideset has no message or queue part.
import { RiCloseLine, RiPencilLine, RiTimeLine } from '@remixicon/react';

import { IconAction } from './icon-action';

type MessageQueueProps = {
  /** In the order they go out. */
  messages: string[];
  /** Who they wait for: "Tandem". */
  agent: string;
  /** Takes the message back into the composer to be changed. */
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

/**
 * What you sent while the agent was working: one bordered list attached to the composer, a line
 * a message, in the order they will go out when the run ends. They are not in the transcript
 * yet, because they have not been said yet: each can still be taken back into the composer or
 * removed. Each row is one line; the whole message is its tooltip.
 */
export function MessageQueue({ messages, agent, onEdit, onRemove }: MessageQueueProps) {
  return (
    <section aria-label="Queued messages" className="gap-ws-3 flex flex-col">
      <p className="typography-label-sm text-ws-static-subtle px-ws-3">
        {`Queued, sent in this order when ${agent} is done`}
      </p>
      <ol className="border-ws-static-base divide-ws-static-base rounded-ws-container-md flex flex-col divide-y border">
        {messages.map((text, index) => (
          <li
            key={`${index}-${text}`}
            className="gap-ws-5 pl-ws-7 pr-ws-3 min-h-ws-16 flex items-center"
          >
            <RiTimeLine aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
            <span
              title={text}
              className="typography-body-md text-ws-static-base min-w-0 flex-1 truncate"
            >
              {text}
            </span>
            <IconAction
              label="Edit in the composer"
              icon={RiPencilLine}
              iconClassName="text-ws-static-subtle"
              size="xs"
              onClick={() => onEdit(index)}
            />
            <IconAction
              label="Remove from the queue"
              icon={RiCloseLine}
              iconClassName="text-ws-static-subtle"
              size="xs"
              onClick={() => onRemove(index)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
