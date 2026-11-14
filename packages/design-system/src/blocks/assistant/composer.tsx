// TODO(custom): assistant composer (text and actions in one field frame); Textarea has no ghost preset and no slot for actions inside its frame.
import { RiArrowUpLine, RiStopFill } from '@remixicon/react';
import { Button, IconButton } from '@wideset/react';
import { type FormEvent, type KeyboardEvent, useRef, useState } from 'react';

type ComposerProps = {
  /** An answer is streaming in: the field waits and Send becomes Stop. */
  streaming: boolean;
  /** Whether Send is the screen's one filled button (not while a change waits to be applied). */
  primary: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

/**
 * Where Maya asks: the question and Send in one frame drawn as a Wideset field, as in the chat
 * block. It grows with the text up to a few lines. Enter sends, Shift + Enter starts a new line.
 * While an answer streams in, Send turns into Stop, which keeps what is written so far.
 */
export function Composer({ streaming, primary, onSend, onStop }: ComposerProps) {
  const [draft, setDraft] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  const send = (event: FormEvent | KeyboardEvent) => {
    event.preventDefault();
    const text = draft.trim();
    // Nothing to send, or an answer still coming: keep the cursor where the question goes.
    if (!text || streaming) return field.current?.focus();
    onSend(text);
    setDraft('');
  };

  return (
    <form
      onSubmit={send}
      aria-label="Ask the assistant"
      className="bg-ws-static-highlight-base border-ws-dynamic-secondary-default rounded-ws-container-sm hover:not-has-[textarea:focus]:border-ws-dynamic-secondary-hover has-[textarea:focus]:border-ws-dynamic-primary-strong-default has-[textarea:focus]:shadow-ws-forms-active flex flex-col border"
    >
      <textarea
        ref={field}
        aria-label="Question"
        placeholder="Ask about this deal"
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
      <div className="px-ws-5 pb-ws-5 flex justify-end">
        {streaming ? (
          <Button variant="secondary" preset="border" size="sm" onClick={onStop}>
            <Button.Icon icon={RiStopFill} />
            Stop
          </Button>
        ) : (
          <IconButton
            type="submit"
            icon={RiArrowUpLine}
            variant={primary ? 'primary' : 'secondary'}
            preset={primary ? 'filled' : 'border'}
            size="sm"
            aria-label="Send"
          />
        )}
      </div>
    </form>
  );
}
