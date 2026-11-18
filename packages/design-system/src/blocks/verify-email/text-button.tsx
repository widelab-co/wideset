// TODO(custom): an action drawn as the help line's text link; Wideset has no text-style button for an action inside a sentence (LinkButton is an anchor with control padding).
import { cn } from '@wideset/react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * An action inside a sentence (resend, change the address, switch the method), drawn as
 * `TextLink` draws a link: body text in the primary colour, underlined. It is a `button`, so it
 * never navigates or submits.
 */
export function TextButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer underline decoration-from-font',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
