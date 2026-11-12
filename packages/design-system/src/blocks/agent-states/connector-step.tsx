import { InlineAlert } from '@wideset/react';

import { connector } from './data';

/**
 * Under a step that cannot read from a connector whose access has expired. The step waits (the
 * notice colour, not the negative one: nothing is broken, it needs you), and the alert sits
 * where the cause is: what happened, and Reconnect in place, so the run goes on from this step.
 * Reconnect is the alert's own action, bordered in the alert's colour: an action in an alert is
 * never filled. Left behind, the step shows as not finished, without the alert.
 */
export function ConnectorStep({ onReconnect }: { onReconnect: () => void }) {
  return (
    <InlineAlert
      status="warning"
      persistent
      title={`${connector.name} needs reconnecting`}
      message={`Its access expired on ${connector.expired}, so ${connector.issue} could not be read. Reconnect and Tandem goes on from this step.`}
    >
      <InlineAlert.Action onClick={onReconnect}>Reconnect</InlineAlert.Action>
    </InlineAlert>
  );
}
