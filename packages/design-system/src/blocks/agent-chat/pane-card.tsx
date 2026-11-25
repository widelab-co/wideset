// TODO(custom): something a turn made (a document, its changes, a pull request), as a card in the transcript that opens it in the pane; FileItem is an upload row with a remove action, not a link to a pane.
import { type RemixiconComponentType, RiLayoutRightLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

type PaneCardProps = {
  icon: RemixiconComponentType;
  title: string;
  /** One quiet line under the title: what it is and how it stands. */
  caption: ReactNode;
  /** Its pane is the one showing. */
  open: boolean;
  paneId: string;
  onToggle: () => void;
};

/**
 * What a turn made, where the turn made it: a tile with its icon, its name, one line about it.
 * The whole card is one button that brings its pane up beside the session, and closes the pane
 * again; while that pane shows it keeps the quiet fill.
 */
export function PaneCard({ icon: Icon, title, caption, open, paneId, onToggle }: PaneCardProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={paneId}
      onClick={onToggle}
      className={cn(
        'border-ws-static-base rounded-ws-container-md gap-ws-7 p-ws-5 pr-ws-7 flex w-full max-w-[24rem] cursor-pointer items-center border text-left',
        'hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default transition-[background-color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
        open && 'bg-ws-static-alpha-subtle',
      )}
    >
      <span className="bg-ws-static-alpha-base rounded-ws-control-lg size-ws-16 flex shrink-0 items-center justify-center">
        <Icon aria-hidden className="size-ws-11 text-ws-static-base" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong truncate">{title}</span>
        <span className="typography-caption-md text-ws-static-subtle truncate">{caption}</span>
      </span>
      <RiLayoutRightLine aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
    </button>
  );
}
