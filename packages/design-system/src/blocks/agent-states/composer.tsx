// TODO(custom): the composer (the message card on a grey tray: a growing text area, the mode's tools, the model and Send, the attachments under it); Textarea does not grow and has no slot for actions inside its frame.
import { RiArrowRightLine, RiCloseLine, RiFileLine, RiStopFill } from '@remixicon/react';
import { Chip, cn, IconButton, Tooltip } from '@wideset/react';
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { IconAction } from './icon-action';
import { SWAP } from './motion';

type ComposerProps = {
  /** The form's name: "Message Tandem". */
  label: string;
  placeholder: string;
  /**
   * Words put in the field from outside (a way to start that was picked, a queued message taken
   * back, a request from a pane). A new `id` puts them there again, with the cursor in the field.
   */
  draft?: { text: string; id: number };
  /** Left of the bar under the text: the mode's tools. */
  tools?: ReactNode;
  /** Right of the bar, before Send: the model. */
  model?: ReactNode;
  /** The files that go with the message, by name: removable chips on the tray. */
  attachments?: string[];
  onDetach?: (index: number) => void;
  /** The agent is working: Send becomes Stop, Esc stops too, and what is sent meanwhile queues. */
  running?: boolean;
  /** Whether Send or Stop is the screen's one filled button (not while something waits for you). */
  primary?: boolean;
  /**
   * Why nothing can be sent right now ("You are offline"). Send is disabled and says it; the text
   * stays editable, so a draft is not lost.
   */
  blocked?: string;
  /** On a new-chat screen, where the composer is the page: room for a few lines from the start. */
  roomy?: boolean;
  onSend: (text: string) => void;
  onStop?: () => void;
};

/**
 * Where you write, in the anatomy of the AI chat starting point (Figma's prompt composer): the
 * message card, white and raised, on a grey tray that also holds the attachments as removable
 * chips. In the card the text grows with what is typed, up to a few lines, over one bar: the
 * mode's tools on the left; on the right the keyboard hint, the model and Send. The hint is the
 * first to give way: when the bar has no room for it, it is not shown, and nothing wraps.
 *
 * Enter sends, Shift + Enter starts a new line. While the agent works Send is Stop, in the same
 * place, and Enter still sends: the message waits its turn. When sending is blocked the reason
 * is the placeholder, Send's tooltip and a hidden description of the field. What Figma's card
 * does not draw is added: the card takes a field's focus ring while the text has the focus.
 */
export function Composer({
  label,
  placeholder,
  draft,
  tools,
  model,
  attachments = [],
  onDetach,
  running = false,
  primary = true,
  blocked,
  roomy = false,
  onSend,
  onStop,
}: ComposerProps) {
  const reasonId = useId();
  const attachmentsId = useId();
  const [text, setText] = useState(draft?.text ?? '');
  const field = useRef<HTMLTextAreaElement>(null);

  // Send and Stop trade places with a short grow-in, but only once a run has begun: on opening,
  // Send is simply there.
  const [swapped, setSwapped] = useState(false);
  useEffect(() => {
    if (running) setSwapped(true);
  }, [running]);

  // Words put in from outside are there to be finished: the cursor waits in the field, once
  // whatever was pressed to put them there has given the focus up.
  const applied = useRef(draft?.id);
  useEffect(() => {
    if (!draft || draft.id === applied.current) return;
    applied.current = draft.id;
    setText(draft.text);
    const id = window.setTimeout(() => field.current?.focus());
    return () => window.clearTimeout(id);
  }, [draft]);

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
    const message = text.trim();
    // Nothing to send, or nowhere to send it: keep the cursor where the message goes.
    if (!message || blocked) return field.current?.focus();
    onSend(message);
    setText('');
  };

  const look = {
    variant: primary ? ('primary' as const) : ('secondary' as const),
    preset: primary ? ('filled' as const) : ('border' as const),
  };

  return (
    <form
      onSubmit={send}
      aria-label={label}
      className="bg-ws-static-alpha-subtle p-ws-3 gap-ws-5 relative flex flex-col rounded-(--ws-radius-600)"
    >
      <div className="bg-ws-static-overlay shadow-ws-low rounded-ws-container-xl p-ws-5 gap-ws-3 has-[textarea:focus]:border-ws-dynamic-primary-strong-default has-[textarea:focus]:shadow-ws-forms-active flex flex-col border border-transparent transition-[border-color,box-shadow] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)">
        <div className="p-ws-3">
          <textarea
            ref={field}
            aria-label="Message"
            aria-describedby={blocked ? reasonId : undefined}
            placeholder={blocked ?? placeholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              // Shift + Enter keeps the browser's new line; Enter that confirms an IME word is not a send.
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                send(event);
              }
            }}
            className={cn(
              'typography-body-lg text-ws-static-strong placeholder:text-ws-static-subtle max-h-ws-28 block field-sizing-content w-full resize-none bg-transparent outline-hidden',
              roomy ? 'min-h-ws-23' : 'min-h-ws-12',
            )}
          />
        </div>
        <div className="gap-ws-5 flex items-center">
          <div className="gap-ws-5 flex shrink-0 items-center">{tools}</div>
          <div className="gap-ws-5 flex min-w-0 flex-1 items-center justify-end">
            {/* The hint sits on the first line of a wrapping row one line high: when it does not
                fit beside the empty item before it, it wraps out of sight instead of truncating. */}
            <div className="h-ws-11 flex min-w-0 flex-1 flex-wrap justify-end overflow-hidden">
              <span className="h-ws-11" />
              <p className="typography-body-md text-ws-static-subtle whitespace-nowrap">
                Shift + Enter for a new line
              </p>
            </div>
            {model}
            {blocked ? (
              // A disabled button takes no hover, so the tooltip hangs on a wrapper that does. The
              // keyboard and a screen reader have the reason from the field: its placeholder and
              // its description.
              <Tooltip size="sm">
                <Tooltip.Trigger asChild>
                  <span className="flex">
                    <IconButton
                      icon={RiArrowRightLine}
                      size="sm"
                      disabled
                      aria-label="Send"
                      aria-describedby={reasonId}
                      {...look}
                    />
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Tooltip.Label>{blocked}</Tooltip.Label>
                </Tooltip.Content>
              </Tooltip>
            ) : running ? (
              <IconAction
                label="Stop"
                icon={RiStopFill}
                iconClassName={swapped ? SWAP : undefined}
                onClick={onStop}
                {...look}
              />
            ) : (
              <IconAction
                type="submit"
                label="Send"
                icon={RiArrowRightLine}
                iconClassName={swapped ? SWAP : undefined}
                {...look}
              />
            )}
          </div>
        </div>
      </div>

      {attachments.length > 0 && (
        <div role="group" aria-labelledby={attachmentsId} className="py-ws-5">
          <p
            id={attachmentsId}
            className="typography-label-strong-sm text-ws-static-subtle px-ws-7 py-ws-3"
          >
            Attachments
          </p>
          <div className="gap-ws-3 px-ws-7 flex flex-wrap">
            {attachments.map((name, index) => (
              <Chip
                key={name}
                variant="secondary"
                style="border"
                aria-label={`Remove ${name}`}
                onClick={() => onDetach?.(index)}
              >
                <Chip.Icon icon={RiFileLine} />
                {name}
                <Chip.Icon icon={RiCloseLine} />
              </Chip>
            ))}
          </div>
        </div>
      )}

      {blocked && (
        <p id={reasonId} className="sr-only">
          {blocked}
        </p>
      )}
    </form>
  );
}
