// TODO(custom): your message in the transcript (a brand-tinted bubble on the right, with what it was sent with); Wideset has no message component.
import type { UserTurn } from './model';

/**
 * What you wrote, as Figma draws a sent message (the Communication and AI chat screens): a
 * bubble in the brand tint on the right, no avatar and no name, since everything on the left is
 * the agent's. It may run wider than Figma's 356px: what is asked of an agent is often a
 * paragraph, and a narrow bubble would stand taller than the answer. What it was sent with (a
 * tool that explains the answer, the files attached) is a quiet caption under it.
 */
export function UserMessage({ turn }: { turn: UserTurn }) {
  return (
    <div className="gap-ws-3 flex flex-col items-end">
      <p className="typography-body-md text-ws-non-semantic-indigo-on-subtle bg-ws-dynamic-primary-alpha-strong-default rounded-ws-container-sm p-ws-5 max-w-[85%] break-words whitespace-pre-line">
        <span className="sr-only">You: </span>
        {turn.text}
      </p>
      {turn.sentWith && turn.sentWith.length > 0 && (
        <p className="typography-caption-md text-ws-static-subtle">
          <span className="sr-only">Sent with </span>
          {turn.sentWith.join(' · ')}
        </p>
      )}
    </div>
  );
}
