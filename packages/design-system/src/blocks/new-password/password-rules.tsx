// TODO(custom): a password's rules as a checklist that ticks as you type; Wideset has no password requirements list (HelperText holds one line of text).
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from '@remixicon/react';

export type PasswordRule = { label: string; met: boolean };

/**
 * The rules a new password must meet, under its field, each ticked the moment it is met. Drawn as
 * Wideset's helper text draws a line (small body text, a 16px icon, 4px above and below), so it
 * reads as part of the field; the tick is the only colour, because met is a judgement. The field
 * points at the list with `aria-describedby`, and each rule says in words whether it is met.
 */
export function PasswordRules({ id, rules }: { id: string; rules: PasswordRule[] }) {
  return (
    <ul id={id} className="flex flex-col">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className="typography-body-sm text-ws-static-subtle gap-ws-3 py-ws-3 flex items-center"
        >
          {rule.met ? (
            <RiCheckboxCircleFill
              aria-hidden="true"
              className="text-ws-semantic-positive size-ws-control-sm shrink-0"
            />
          ) : (
            <RiCheckboxBlankCircleLine
              aria-hidden="true"
              className="text-ws-static-subtle size-ws-control-sm shrink-0"
            />
          )}
          {rule.label}
          <span className="sr-only">{rule.met ? ', done' : ', not yet'}</span>
        </li>
      ))}
    </ul>
  );
}
