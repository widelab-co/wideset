// TODO(custom): a link inside a sentence; Wideset has no inline text link (LinkButton is a control with its own padding and height).
import { cn } from '@wideset/react';
import type { AnchorHTMLAttributes } from 'react';

/**
 * A link inside a sentence, as Figma draws the terms link: the sentence's own type in the primary
 * colour. The underline comes on hover and focus.
 */
export function TextLink({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default decoration-from-font hover:underline focus-visible:underline',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
