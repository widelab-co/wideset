// TODO(custom): a document the agent wrote, as a card in the transcript that opens it in the pane; FileItem is an upload row with a remove action, not a link to a pane.
import { RiFileTextLine, RiLayoutRightLine } from '@remixicon/react';
import { cn } from '@wideset/react';

type DocumentCardProps = {
  title: string;
  /** Which version this answer wrote, counted from 1. */
  version: number;
  /** This version is the one open in the pane. */
  open: boolean;
  paneId: string;
  onToggle: () => void;
};

/**
 * What an answer made, where the answer made it: the document's name and the version that turn
 * wrote. The whole card is one button that opens that version in the pane beside the chat, and
 * closes the pane again; while its version is open it keeps the quiet fill.
 */
export function DocumentCard({ title, version, open, paneId, onToggle }: DocumentCardProps) {
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
        <RiFileTextLine aria-hidden className="size-ws-11 text-ws-static-base" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong truncate">{title}</span>
        <span className="typography-caption-md text-ws-static-subtle">
          Document · Version {version}
        </span>
      </span>
      <RiLayoutRightLine aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />
    </button>
  );
}
