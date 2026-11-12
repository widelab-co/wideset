// TODO(custom): reply composer (recipient, text and actions in one field frame); Textarea has no ghost preset and no slot for actions inside its frame.
import { RiAttachment2 } from '@remixicon/react';
import { Button, IconButton, Tooltip } from '@wideset/react';
import { type FormEvent, useRef, useState } from 'react';

import type { Person } from './data';

/**
 * The reply, always under the thread: who it goes to, the text, and Send, the page's one filled
 * button. One frame drawn as a Wideset field, so the composer reads as one thing; it grows with
 * the text up to a few lines, then scrolls. Enter starts a new line; Ctrl or ⌘ + Enter sends.
 */
export function ReplyComposer({ to, onSend }: { to: Person; onSend: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    // Nothing to send yet: put the cursor where the reply goes.
    if (!text) return field.current?.focus();
    onSend(text);
    setDraft('');
  };

  return (
    <form
      onSubmit={send}
      aria-label={`Reply to ${to.name}`}
      className="bg-ws-static-highlight-base border-ws-dynamic-secondary-default rounded-ws-container-sm hover:not-has-[textarea:focus]:border-ws-dynamic-secondary-hover has-[textarea:focus]:border-ws-dynamic-primary-strong-default has-[textarea:focus]:shadow-ws-forms-active flex flex-col border"
    >
      <p className="gap-ws-5 px-ws-9 pt-ws-7 typography-body-md flex items-baseline">
        <span className="text-ws-static-subtle">To</span>
        <span className="text-ws-static-strong">{to.name}</span>
        <span className="text-ws-static-subtle truncate">{to.email}</span>
      </p>
      <textarea
        ref={field}
        aria-label="Reply"
        placeholder="Write a reply"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) send(event);
        }}
        className="typography-body-md text-ws-static-strong placeholder:text-ws-static-subtle px-ws-9 py-ws-5 min-h-ws-22 max-h-ws-28 block field-sizing-content w-full resize-none bg-transparent outline-hidden"
      />
      <div className="gap-ws-5 px-ws-5 pb-ws-5 flex items-center justify-between">
        <Tooltip size="sm">
          <Tooltip.Trigger asChild>
            <IconButton
              icon={RiAttachment2}
              variant="secondary"
              preset="ghost"
              size="sm"
              aria-label="Attach a file"
            />
          </Tooltip.Trigger>
          <Tooltip.Content side="top">
            <Tooltip.Label>Attach a file</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
        <Button type="submit" size="sm">
          Send
        </Button>
      </div>
    </form>
  );
}
