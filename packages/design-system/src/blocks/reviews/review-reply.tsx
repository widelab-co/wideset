// TODO(custom): a reply under a review (who answered, when, the text, set in behind a line); no Comment or quote component in Wideset.
import { type Reply, workspace } from './data';
import { formatDate } from './format';

/**
 * The company's answer under a review: set in behind a line and a tone quieter than the review,
 * so the customer's words stay the loudest thing in the row.
 */
export function ReviewReply({ reply }: { reply: Reply }) {
  return (
    <div className="border-ws-static-base gap-ws-2 pl-ws-9 flex max-w-[40rem] flex-col border-l">
      <p className="typography-label-sm text-ws-static-subtle">
        <span className="typography-label-strong-sm text-ws-static-base">{workspace.name}</span>
        {` · ${reply.author} · `}
        <time dateTime={reply.date}>{formatDate(reply.date)}</time>
      </p>
      <p className="typography-body-md text-ws-static-subtle">{reply.text}</p>
    </div>
  );
}
