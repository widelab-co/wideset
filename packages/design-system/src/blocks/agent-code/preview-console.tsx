// TODO(custom): a console drawer (a bar with Clear and Close over the page's messages in monospace, each with its level and source); Wideset has no console or log part and no drawer that is not modal.
import {
  type RemixiconComponentType,
  RiAlertLine,
  RiArrowRightSLine,
  RiCloseCircleLine,
  RiCloseLine,
  RiEraserLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';
import { useEffect, useRef } from 'react';

import { PreviewBarAction } from './preview-bar-action';
import type { ConsoleMessage } from './preview-data';

/** A level's mark, in its meaning's colour, and its name for a screen reader. */
const LEVEL: Record<
  ConsoleMessage['level'],
  { Icon: RemixiconComponentType; className: string; name: string }
> = {
  log: { Icon: RiArrowRightSLine, className: 'text-ws-static-subtle', name: 'Log' },
  warning: { Icon: RiAlertLine, className: 'text-ws-semantic-notice', name: 'Warning' },
  error: { Icon: RiCloseCircleLine, className: 'text-ws-semantic-negative', name: 'Error' },
};

type PreviewConsoleProps = {
  id: string;
  messages: ConsoleMessage[];
  onClear: () => void;
  onClose: () => void;
};

/**
 * The page's console, in a drawer under the page: what it logged since it loaded, a line each,
 * the level as a mark in its meaning's colour and the file that logged it at the end. It takes a
 * third of the pane at most and scrolls inside itself, following the newest line.
 */
export function PreviewConsole({ id, messages, onClear, onClose }: PreviewConsoleProps) {
  const scroller = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  return (
    <section
      id={id}
      aria-label="Console"
      className="border-ws-static-base animate-in fade-in-0 slide-in-from-bottom-ws-5 flex max-h-[33%] shrink-0 flex-col border-t duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)"
    >
      <div className="h-ws-16 px-ws-11 flex shrink-0 items-center justify-between">
        <h3 className="typography-label-strong-sm text-ws-static-strong">Console</h3>
        <div className="gap-ws-2 flex items-center">
          <PreviewBarAction
            icon={RiEraserLine}
            label="Clear console"
            disabled={messages.length === 0}
            onClick={onClear}
          />
          <PreviewBarAction icon={RiCloseLine} label="Close console" onClick={onClose} />
        </div>
      </div>
      {messages.length === 0 ? (
        <p className="typography-body-md text-ws-static-subtle px-ws-11 pb-ws-9">
          Nothing logged since the page loaded
        </p>
      ) : (
        <ol
          ref={scroller}
          role="log"
          aria-label="Messages"
          className="font-ws-mono typography-body-sm tracking-ws-normal text-ws-static-base pb-ws-5 min-h-0 overflow-y-auto"
        >
          {messages.map(({ id: key, level, text, source }) => {
            const { Icon, className, name } = LEVEL[level];
            return (
              <li
                key={key}
                className="border-ws-static-subtle gap-ws-5 px-ws-11 py-ws-4 flex items-start border-t"
              >
                <Icon aria-hidden="true" className={cn('w-ws-8 h-[1lh] shrink-0', className)} />
                <span className="sr-only">{name}:</span>
                <span className="min-w-0 flex-1 wrap-anywhere">{text}</span>
                {source && <span className="text-ws-static-subtle shrink-0">{source}</span>}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
