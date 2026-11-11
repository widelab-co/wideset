import { InlineAlert } from '@wideset/react';

import { connector, issueStep } from './data';
import { OpenStep } from './open-step';

type ConnectorStepProps = {
  /** The run still waits at this step. */
  live: boolean;
  /** Signs in to the connector again; the step then runs. */
  onReconnect: () => void;
};

/**
 * A step that could not read from a connector whose access has expired. The step waits (the
 * notice colour, not the negative one: nothing is broken, it needs you), and the alert sits under
 * it, where the cause is: what happened, and Reconnect in place, so the run goes on from this
 * step. Reconnect is the filled button while the run waits for it. Left behind, the step shows
 * as skipped.
 */
export function ConnectorStep({ live, onReconnect }: ConnectorStepProps) {
  if (!live) {
    return <OpenStep step={{ ...issueStep, status: 'skipped', result: 'Not connected' }} />;
  }

  return (
    <OpenStep step={issueStep}>
      <InlineAlert
        status="warning"
        persistent
        title={`${connector.name} needs reconnecting`}
        message={`Its access expired on ${connector.expired}, so ${connector.issue} could not be read. Reconnect and Tandem goes on from this step.`}
      >
        <InlineAlert.Action variant="primary" preset="filled" onClick={onReconnect}>
          Reconnect
        </InlineAlert.Action>
      </InlineAlert>
    </OpenStep>
  );
}
