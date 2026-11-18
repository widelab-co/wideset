// TODO(custom): the permission a step waits for (what it wants to run, why, allow or deny); Wideset's InlineAlert is a message with one action and Popup is anchored to a control.
import { Button } from '@wideset/react';

import type { Approval, ApprovalAnswer } from './model';

type ApprovalCardProps = {
  approval: Approval;
  onAnswer: (answer: ApprovalAnswer) => void;
};

/**
 * What the agent asks before a step that needs permission: a bordered card in the transcript with
 * the command or path in monospace, the reason in a sentence, and the three answers. Allow once
 * is the screen's filled button while the card waits; Stop in the composer steps back for it.
 */
export function ApprovalCard({ approval, onAnswer }: ApprovalCardProps) {
  return (
    <div
      role="group"
      aria-label={approval.title}
      className="border-ws-static-base rounded-ws-container-md p-ws-9 gap-ws-7 ml-ws-12 mt-ws-2 mb-ws-3 flex flex-col border"
    >
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-strong-sm text-ws-static-strong">{approval.title}</p>
        <code className="font-ws-mono typography-body-sm tracking-ws-normal text-ws-static-strong bg-ws-static-alpha-subtle rounded-ws-control-md px-ws-5 py-ws-3 break-all">
          {approval.command}
        </code>
        <p className="typography-body-md text-ws-static-subtle">{approval.reason}</p>
      </div>
      <div className="gap-ws-3 flex flex-wrap">
        <Button size="sm" onClick={() => onAnswer('once')}>
          Allow once
        </Button>
        <Button size="sm" variant="secondary" preset="border" onClick={() => onAnswer('always')}>
          {`Always allow in ${approval.scope}`}
        </Button>
        <Button size="sm" variant="secondary" preset="ghost" onClick={() => onAnswer('denied')}>
          Deny
        </Button>
      </div>
    </div>
  );
}
