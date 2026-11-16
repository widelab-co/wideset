// TODO(custom): a numbered citation mark (in a sentence it is a button that points at its source); Wideset's Count is not interactive and Tag is a labelled category.
import { cn } from '@wideset/react';

/** What links the report and the sources: the source in focus, and how a mark changes it. */
export type Citing = {
  /** The source a pointer or the keyboard is on, or else the pinned one. */
  active: number | null;
  /** Points at a source for as long as the pointer or the focus stays; null when it leaves. */
  onPeek: (source: number | null) => void;
  /** Keeps a source in focus and brings it into view in the pane; again lets it go. */
  onPin: (source: number) => void;
};

type CitationProps = {
  /** The number of the source it stands for. */
  source: number;
  /** Its source is the one in focus: the mark takes the brand tint of a selected thing. */
  active: boolean;
  /** In the report: the mark is a button. Without it (in the sources list) it is only the number. */
  citing?: Citing;
};

/**
 * A source's number in a small square. In the report it follows the words it backs: resting on
 * it lights its source in the pane, and a press keeps it lit and scrolls it into view. In the
 * sources list the same square is the source's number, lit while that source is in focus, so the
 * two ends of a citation look alike.
 */
export function Citation({ source, active, citing }: CitationProps) {
  const className = cn(
    'typography-caption-md rounded-ws-control-sm min-w-ws-9 h-ws-9 px-ws-2 inline-flex shrink-0 items-center justify-center tabular-nums',
    'transition-[background-color,color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
    active
      ? 'bg-ws-dynamic-primary-alpha-strong-default text-ws-dynamic-primary-default'
      : 'bg-ws-static-alpha-base text-ws-static-base',
  );
  if (!citing) {
    return (
      <span className={className}>
        <span className="sr-only">Source </span>
        {source}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Source ${source}`}
      onClick={() => citing.onPin(source)}
      onPointerEnter={() => citing.onPeek(source)}
      onPointerLeave={() => citing.onPeek(null)}
      onFocus={() => citing.onPeek(source)}
      onBlur={() => citing.onPeek(null)}
      className={cn(
        className,
        'ml-ws-2 focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer align-[0.0625rem]',
        !active && 'hover:bg-ws-static-alpha-strong',
      )}
    >
      {source}
    </button>
  );
}
