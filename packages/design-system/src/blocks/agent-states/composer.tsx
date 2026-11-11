// TODO(custom): the composer (a growing text area, the mode's tools, the model and Send in one field frame); Textarea does not grow and has no slot for actions inside its frame.
import { RiArrowUpLine, RiStopFill } from '@remixicon/react';
import { cn } from '@wideset/react';
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { IconAction } from './icon-action';
import { SWAP } from './motion';

type ComposerProps = {
  /** The form's name: "Message Tandem". */
  label: string;
  placeholder: string;
  /** Text the field starts with (a way to start that was picked); the cursor goes to its end. */
  defaultValue?: string;
  /** Left of the bar under the text: attach and the mode's tools. */
  tools?: ReactNode;
  /** Right of the bar, before Send: the model. */
  model?: ReactNode;
  /** The agent is working: Send becomes Stop, Esc stops too, and what is sent meanwhile queues. */
  running?: boolean;
  /** Whether Send or Stop is the screen's one filled button (not while an approval waits). */
  primary?: boolean;
  /** On a new-chat screen, where the composer is the page: room for a few lines from the start. */
  roomy?: boolean;
  onSend: (text: string) => void;
  onStop?: () => void;
};

/**
 * Where you write: a bordered box that takes the focus ring of a field, the text growing with
 * what is typed up to a few lines, and one bar under it: the tools on the left, the model and
 * Send on the right. Enter sends, Shift + Enter starts a new line. While the agent works Send is
 * Stop, in the same place, and Enter still sends: the message waits its turn.
 */
export function Composer({
  label,
  placeholder,
  defaultValue = '',
  tools,
  model,
  running = false,
  primary = true,
  roomy = false,
  onSend,
  onStop,
}: ComposerProps) {
  const [draft, setDraft] = useState(defaultValue);
  const field = useRef<HTMLTextAreaElement>(null);

  // Send and Stop trade places with a short grow-in, but only once a run has begun: on opening,
  // Send is simply there.
  const [swapped, setSwapped] = useState(false);
  useEffect(() => {
    if (running) setSwapped(true);
  }, [running]);

  // A picked start is there to be finished: the cursor waits at its end.
  useEffect(() => {
    if (!defaultValue) return;
    field.current?.focus();
    field.current?.setSelectionRange(defaultValue.length, defaultValue.length);
  }, [defaultValue]);

  // Esc stops the run from anywhere on the screen, unless it is closing a menu or a dialog.
  useEffect(() => {
    if (!running || !onStop) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const inOverlay =
        event.target instanceof Element &&
        event.target.closest('[role="menu"], [role="dialog"], [role="listbox"]');
      if (event.key === 'Escape' && !event.defaultPrevented && !inOverlay) onStop();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, onStop]);

  const send = (event: FormEvent | KeyboardEvent) => {
    event.preventDefault();
    const text = draft.trim();
    // Nothing to send: keep the cursor where the message goes.
    if (!text) return field.current?.focus();
    onSend(text);
    setDraft('');
  };

  return (
    <form
      onSubmit={send}
      aria-label={label}
      className="bg-ws-static-highlight-base border-ws-dynamic-secondary-default rounded-ws-container-md hover:not-has-[textarea:focus]:border-ws-dynamic-secondary-hover has-[textarea:focus]:border-ws-dynamic-primary-strong-default has-[textarea:focus]:shadow-ws-forms-active flex flex-col border transition-[border-color,box-shadow] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)"
    >
      <textarea
        ref={field}
        aria-label="Message"
        placeholder={placeholder}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          // Shift + Enter keeps the browser's new line; Enter that confirms an IME word is not a send.
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            send(event);
          }
        }}
        className={cn(
          'typography-body-md text-ws-static-strong placeholder:text-ws-static-subtle px-ws-9 pt-ws-7 pb-ws-3 max-h-ws-28 block field-sizing-content w-full resize-none bg-transparent outline-hidden',
          roomy ? 'min-h-ws-21' : 'min-h-ws-17',
        )}
      />
      <div className="gap-ws-3 px-ws-5 pb-ws-5 flex items-center">
        {tools}
        <div className="gap-ws-3 ml-auto flex shrink-0 items-center">
          {model}
          {running ? (
            <IconAction
              label="Stop"
              icon={RiStopFill}
              iconClassName={swapped ? SWAP : undefined}
              variant={primary ? 'primary' : 'secondary'}
              preset={primary ? 'filled' : 'border'}
              onClick={onStop}
            />
          ) : (
            <IconAction
              type="submit"
              label="Send"
              icon={RiArrowUpLine}
              iconClassName={swapped ? SWAP : undefined}
              variant={primary ? 'primary' : 'secondary'}
              preset={primary ? 'filled' : 'border'}
            />
          )}
        </div>
      </div>
    </form>
  );
}
