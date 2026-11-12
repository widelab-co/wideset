// TODO(custom): a quiet one-line row in the transcript (a thought, a step) that opens what is under it; Accordion's trigger is a full-width title with its chevron at the far end.
import { RiArrowRightSLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

type RowProps = {
  /** The 16px mark the row starts with: what it is, or how it went. */
  mark: ReactNode;
  children: ReactNode;
  /** Given `onToggle`, the row is a button that opens and shuts what is under it. */
  open?: boolean;
  onToggle?: () => void;
};

/**
 * One line of the agent's work. A row with something under it is one target across its whole
 * width, with a chevron after its text that turns when it opens; a row with nothing to open is
 * plain text.
 */
export function Row({ mark, children, open = false, onToggle }: RowProps) {
  const className =
    'gap-ws-5 px-ws-3 min-h-ws-13 rounded-ws-control-md typography-body-md flex w-full items-center text-left';
  if (!onToggle) {
    return (
      <div className={className}>
        {mark}
        {children}
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        className,
        'hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer transition-[background-color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out) focus-visible:-outline-offset-2',
      )}
    >
      {mark}
      {children}
      <RiArrowRightSLine
        aria-hidden
        className={cn(
          'size-ws-9 text-ws-static-subtle shrink-0 transition-transform duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
          open && 'rotate-90',
        )}
      />
    </button>
  );
}
