// TODO(custom): empty state (title, line, action); no EmptyState in Wideset.
import { Button } from '@wideset/react';

/**
 * What the list shows when the filter and the search leave nothing: a title, a line that says
 * why, and the one action that brings the sessions back, centred.
 */
export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="gap-ws-9 py-ws-20 flex flex-col items-center text-center">
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-strong-md text-ws-static-strong">No sessions match</p>
        <p className="typography-body-md text-ws-static-subtle">
          Try another name or branch, or clear the filter.
        </p>
      </div>
      <Button variant="secondary" preset="border" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
