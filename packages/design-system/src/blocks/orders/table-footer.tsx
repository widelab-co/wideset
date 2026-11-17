// TODO(custom): range label "1–12 of 36 orders" beside Pagination; Pagination has no range label.
import { Pagination } from '@wideset/react';

/**
 * Under the table: which rows are showing, and the pages when there is more than one. With no
 * rows it says nothing: the empty state in the table's place announces that.
 */
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
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);

  return (
    <div className="gap-ws-9 min-h-ws-forms-sm flex flex-wrap items-center justify-between">
      {total > 0 && (
        <p role="status" className="typography-body-md text-ws-static-subtle tabular-nums">
          {first}–{last} of {total} orders
        </p>
      )}
      {pagesCount > 1 && (
        <Pagination
          pagesCount={pagesCount}
          activePage={page}
          onChangeActivePage={onPageChange}
          navigationAriaLabel="Order pages"
        />
      )}
    </div>
  );
}
