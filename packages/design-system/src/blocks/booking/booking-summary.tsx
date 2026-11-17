// TODO(custom): a summary of choices, each with a way back to change it; Wideset has no DescriptionList.
import { Button } from '@wideset/react';
import type { ReactNode } from 'react';

export type Choice = {
  label: string;
  value: ReactNode;
  /** Takes the reader back to where this was chosen; a fact without it is fixed. */
  onChange?: () => void;
};

/**
 * What was chosen, read back before booking: each fact its label above its value, and a quiet
 * Change on the label's line that goes back to the choice. The buttons are ghost: the way forward
 * is the form beside it.
 */
export function BookingSummary({ choices }: { choices: Choice[] }) {
  return (
    <dl className="gap-ws-9 flex flex-col">
      {choices.map(({ label, value, onChange }) => (
        <div key={label} className="gap-ws-2 flex flex-col">
          {/* Change sits on the label's line, so the value keeps the column's full width. */}
          <dt className="gap-ws-5 min-h-ws-12 flex items-center justify-between">
            <span className="typography-label-sm text-ws-static-subtle">{label}</span>
            {onChange ? (
              <Button
                variant="secondary"
                preset="ghost"
                size="sm"
                aria-label={`Change ${label.toLowerCase()}`}
                onClick={onChange}
                className="-my-ws-3"
              >
                Change
              </Button>
            ) : null}
          </dt>
          <dd className="typography-body-md text-ws-static-base tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
