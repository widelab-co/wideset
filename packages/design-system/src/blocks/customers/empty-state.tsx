// TODO(custom): empty state (title, line, action); no EmptyState in Wideset.
import { Button } from '@wideset/react';

/**
 * What the table shows when the search and filters leave nothing. Wideset has no empty state: a
 * title, a line that says why, and the one action that brings the rows back, centred.
 */
export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="gap-ws-9 py-ws-20 flex flex-col items-center text-center">
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">No customers match</p>
        <p className="typography-body-md text-ws-static-subtle">
          Try another name or domain, or clear the filters.
        </p>
      </div>
      <Button variant="secondary" preset="border" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
