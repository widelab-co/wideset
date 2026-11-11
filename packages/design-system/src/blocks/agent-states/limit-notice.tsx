import { InlineAlert } from '@wideset/react';

import { limit } from './data';

type LimitNoticeProps = {
  /** Waiting was chosen: the run goes on by itself when the limit resets. */
  waiting: boolean;
  onWait: () => void;
  onCancel: () => void;
  /** Goes on now, on the model that still has room. */
  onSwitch: () => void;
};

/**
 * The usage limit, over the composer it has just disabled: what happened, when it resets (how
 * long and at what time), that nothing is lost, and the two ways on. Going on now with the other
 * model is the filled button; waiting is the quiet one. It is persistent: it leaves when the
 * limit does. Once waiting is chosen it turns into a plain note that says what will happen, with
 * the way to take that back.
 */
export function LimitNotice({ waiting, onWait, onCancel, onSwitch }: LimitNoticeProps) {
  const now = `Continue now with ${limit.fallback.name}`;

  if (waiting) {
    return (
      <InlineAlert
        status="info"
        orientation="vertical"
        persistent
        title={`Tandem continues at ${limit.resetsAt}`}
        message="It picks up at the typecheck, then pushes. You can close this session meanwhile: the edits are saved."
      >
        <InlineAlert.Action onClick={onSwitch}>{now}</InlineAlert.Action>
        <InlineAlert.Action preset="ghost" onClick={onCancel}>
          Cancel
        </InlineAlert.Action>
      </InlineAlert>
    );
  }

  return (
    <InlineAlert
      status="warning"
      orientation="vertical"
      persistent
      title="You have reached your usage limit"
      message={`Tandem stopped after the unit tests, before the typecheck and the push. The limit resets in ${limit.resetsIn}, at ${limit.resetsAt}. The edits to 3 files are saved.`}
    >
      <InlineAlert.Action variant="primary" preset="filled" onClick={onSwitch}>
        {now}
      </InlineAlert.Action>
      <InlineAlert.Action onClick={onWait}>{`Continue at ${limit.resetsAt}`}</InlineAlert.Action>
    </InlineAlert>
  );
}
