import { FormField, RadioButton, RadioButtonGroup, Textarea } from '@wideset/react';
import { useId } from 'react';

import { type ReasonId, reasons } from './data';
import { Section } from './section';

const QUESTION = 'Why are you leaving?';

type LeavingReasonProps = {
  /** The reason picked, if any: the question can be skipped. */
  reason?: ReasonId;
  onReasonChange: (reason: ReasonId) => void;
  /** What was written under "Something else". */
  note: string;
  onNoteChange: (note: string) => void;
  disabled?: boolean;
};

/**
 * The second step: the reason, as a short visible set of radio buttons with nothing picked for
 * the reader. It is optional and says so, and cancelling never waits for it. "Something else"
 * opens a text field under the list, optional too.
 */
export function LeavingReason({
  reason,
  onReasonChange,
  note,
  onNoteChange,
  disabled,
}: LeavingReasonProps) {
  const noteId = useId();

  return (
    <Section title={QUESTION} description="Optional. It does not change what happens.">
      <RadioButtonGroup
        aria-label={QUESTION}
        value={reason ?? ''}
        onValueChange={(value) => onReasonChange(value as ReasonId)}
        disabled={disabled}
      >
        {reasons.map(({ id, label }) => (
          <RadioButton key={id} value={id} label={label} />
        ))}
      </RadioButtonGroup>
      {reason === 'other' && (
        <FormField label="What should we know?" suffix="(optional)" htmlFor={noteId}>
          <Textarea
            id={noteId}
            name="note"
            size="sm"
            rows={3}
            resize="none"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            disabled={disabled}
          />
        </FormField>
      )}
    </Section>
  );
}
