// TODO(custom): a changed file as a section that folds (its path, counts and a Viewed tick in a header that stays in view, the diff under it); Accordion's trigger cannot hold a second control, and Wideset has no file header.
import { RiArrowRightSLine } from '@remixicon/react';
import { Checkbox, cn, StatusBadge } from '@wideset/react';
import { type ReactNode, useId } from 'react';

import { ChangeCounts } from './changes-counts';
import { type ChangedFile, splitPath } from './changes-data';

type FileSectionProps = {
  file: ChangedFile;
  open: boolean;
  viewed: boolean;
  onOpenChange: (open: boolean) => void;
  onViewedChange: (viewed: boolean) => void;
  /** The file's diff. */
  children: ReactNode;
};

/**
 * One changed file: a header row, then its diff. The row does one thing, fold the file, so the
 * path is a button stretched over the whole row and the chevron turns; the Viewed tick sits above
 * it as the row's second control. The header stays at the top of the pane while its diff scrolls
 * under it, so the file's name and its tick are always at hand. The folder is quiet and gives
 * way first; the file's name is what the eye looks for. A file new on this branch says so in the
 * info colour, which is what the status badge keeps for news.
 */
export function FileSection({
  file,
  open,
  viewed,
  onOpenChange,
  onViewedChange,
  children,
}: FileSectionProps) {
  const diffId = useId();
  const { folder, name } = splitPath(file.path);

  return (
    <section aria-label={file.path} className="border-ws-static-subtle border-b">
      <div
        className={cn(
          'bg-ws-static-foreground top-ws-0 z-ws-base h-ws-16 gap-ws-7 px-ws-11 border-ws-static-subtle sticky flex items-center',
          open && 'border-b',
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={diffId}
          onClick={() => onOpenChange(!open)}
          className="gap-ws-3 typography-label-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 hover:after:bg-ws-dynamic-secondary-alpha-hover flex min-w-0 flex-1 cursor-pointer items-center text-left after:absolute"
        >
          <RiArrowRightSLine
            aria-hidden="true"
            className={cn(
              'size-ws-9 text-ws-dynamic-secondary-default shrink-0 transition-transform duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)',
              open && 'rotate-90',
            )}
          />
          <span className="flex min-w-0 items-baseline">
            <span className="text-ws-static-subtle truncate">{folder}</span>
            <span className="typography-label-strong-sm text-ws-static-strong shrink-0">
              {name}
            </span>
          </span>
        </button>
        {file.isNew && (
          <StatusBadge size="sm" color="info">
            New
          </StatusBadge>
        )}
        <ChangeCounts added={file.added} removed={file.removed} />
        {/* Over the row's button, so the tick is its own target. */}
        <div className="relative shrink-0">
          <Checkbox
            size="sm"
            label="Viewed"
            checked={viewed}
            onCheckedChange={(checked) => onViewedChange(checked === true)}
          />
        </div>
      </div>
      {open && <div id={diffId}>{children}</div>}
    </section>
  );
}
