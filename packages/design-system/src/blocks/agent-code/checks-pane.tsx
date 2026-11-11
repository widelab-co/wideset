import { CheckList } from './checks-check-list';
import { CommentList } from './checks-comment-list';
import { PullRequestHeader } from './checks-pr-header';
import { ReadySummary } from './checks-ready-summary';

/**
 * The Checks pane: the session's pull request and what it still needs. Its heading, then two
 * cards that are each something to act on (the checks, with the failing one open on its log, and
 * the unresolved review comments), scrolling inside the pane; and under them, always in view, the
 * line that sums up what stands between the draft and its review, with Mark ready held back.
 */
export function ChecksPane() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="gap-ws-9 p-ws-11 flex flex-col">
          <PullRequestHeader />
          <CheckList />
          <CommentList />
        </div>
      </div>
      <ReadySummary />
    </div>
  );
}
