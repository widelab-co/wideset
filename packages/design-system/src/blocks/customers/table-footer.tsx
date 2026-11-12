// TODO(custom): range label "1–12 of 48" beside Pagination; Pagination has no range label.
import { cn, Pagination } from '@wideset/react';

/** Under the table: which rows are showing, and the pages when there is more than one. */
export function TableFooter({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pagesCount = Math.max(1, Math.ceil(total / pageSize));
  const first = Math.min(total, (page - 1) * pageSize + 1);
  const last = Math.min(total, page * pageSize);

  return (
    <div className="gap-ws-9 min-h-ws-forms-sm flex flex-wrap items-center justify-between">
      {/* With no rows the empty state says it on screen; the status still tells screen readers. */}
      <p
        role="status"
        className={cn(
          'typography-body-md text-ws-static-subtle tabular-nums',
          total === 0 && 'sr-only',
        )}
      >
        {total === 0 ? 'No customers match' : `${first}–${last} of ${total} customers`}
      </p>
      {pagesCount > 1 ? (
        <Pagination
          pagesCount={pagesCount}
          activePage={page}
          onChangeActivePage={onPageChange}
          navigationAriaLabel="Customer pages"
        />
      ) : null}
    </div>
  );
}
