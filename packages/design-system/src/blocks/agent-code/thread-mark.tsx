// TODO(custom): the state of a chat or session as one small mark at the end of its sidebar row (working, needs you, paused, unread, a pull request, failed); Wideset has no spinner, and StatusBadge is a labelled badge.
import {
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiGitPullRequestLine,
  RiLoader4Line,
  RiPauseCircleLine,
} from '@remixicon/react';

import type { Thread } from './model';

/**
 * One mark per row, each a different shape, so the state reads without its colour: a spinner
 * while the agent works, the notice sign when it waits for you, a grey pause when it stands
 * still by itself (a limit reached, stopped by you), Figma's unread dot for an answer not yet
 * read, the negative sign when it failed. A session with a pull request shows it with the review
 * comments still open. Every mark has its name for screen readers.
 */
export function ThreadMark({ thread, working }: { thread: Thread; working: boolean }) {
  const state = working ? 'working' : thread.state;

  if (state === 'working') {
    return (
      <>
        <RiLoader4Line aria-hidden className="size-ws-8 motion-safe:animate-spin" />
        <span className="sr-only">Working</span>
      </>
    );
  }
  if (state === 'needs-you') {
    return (
      <RiErrorWarningFill
        role="img"
        aria-label="Needs you"
        className="size-ws-8 text-ws-semantic-notice"
      />
    );
  }
  if (state === 'failed') {
    return (
      <RiCloseCircleFill
        role="img"
        aria-label="Failed"
        className="size-ws-8 text-ws-semantic-negative"
      />
    );
  }
  if (state === 'paused') {
    return <RiPauseCircleLine role="img" aria-label="Paused" className="size-ws-8" />;
  }
  if (thread.pullRequest) {
    const { number, comments } = thread.pullRequest;
    return (
      <span className="gap-ws-2 flex items-center">
        <RiGitPullRequestLine aria-hidden className="size-ws-8" />
        <span className="sr-only">Pull request {number}, open comments:</span>
        {comments}
      </span>
    );
  }
  if (state === 'unread') {
    return (
      <span className="bg-ws-non-semantic-indigo-strong rounded-ws-control-full size-ws-4 mx-ws-2">
        <span className="sr-only">Unread</span>
      </span>
    );
  }
  return null;
}
