// TODO(custom): chat composer (text and actions in one field frame); Textarea has no ghost preset and no slot for actions inside its frame.
import { type RemixiconComponentType, RiAttachment2, RiEmotionLine } from '@remixicon/react';
import { Button, IconButton, Tooltip } from '@wideset/react';
import { type FormEvent, type KeyboardEvent, useRef, useState } from 'react';

/** A quiet tool in the composer, named by its label and a tooltip. */
function Tool({ icon, label }: { icon: RemixiconComponentType; label: string }) {
  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>
        <IconButton icon={icon} variant="secondary" preset="ghost" size="sm" aria-label={label} />
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}

type ComposerProps = {
  /** Where the message goes, for the placeholder: "#halcyon-renewal", "Jonas Weber". */
  to: string;
  onSend: (text: string) => void;
};

/**
 * Where a message is written: the text, what to add to it, and Send, the page's one filled
 * button, in one frame drawn as a Wideset field. It grows with the text up to a few lines, then
 * scrolls. Enter sends; Shift + Enter starts a new line.
 */
export function Composer({ to, onSend }: ComposerProps) {
  const [draft, setDraft] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  const send = (event: FormEvent | KeyboardEvent) => {
    event.preventDefault();
    const text = draft.trim();
    // Nothing to send yet: put the cursor where the message goes.
    if (!text) return field.current?.focus();
    onSend(text);
    setDraft('');
  };

  return (
    <form
      onSubmit={send}
      aria-label={`Message ${to}`}
      className="bg-ws-static-highlight-base border-ws-dynamic-secondary-default rounded-ws-container-sm hover:not-has-[textarea:focus]:border-ws-dynamic-secondary-hover has-[textarea:focus]:border-ws-dynamic-primary-strong-default has-[textarea:focus]:shadow-ws-forms-active flex flex-col border"
    >
      <textarea
        ref={field}
        aria-label="Message"
        placeholder={`Message ${to}`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          // Shift + Enter keeps the browser's new line; Enter that confirms an IME word is not a send.
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            send(event);
          }
        }}
        className="typography-body-md text-ws-static-strong placeholder:text-ws-static-subtle px-ws-9 pt-ws-7 pb-ws-3 min-h-ws-18 max-h-ws-28 block field-sizing-content w-full resize-none bg-transparent outline-hidden"
      />
      <div className="gap-ws-5 px-ws-5 pb-ws-5 flex items-center justify-between">
        <div className="gap-ws-2 flex">
          <Tool icon={RiAttachment2} label="Attach a file" />
          <Tool icon={RiEmotionLine} label="Add an emoji" />
        </div>
        <Button type="submit" size="sm">
          Send
        </Button>
      </div>
    </form>
  );
}
