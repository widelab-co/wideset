/**
 * Small is the default and sits in body text, cards and table rows. Large sets a bigger label
 * for a standalone route that needs more presence, such as the link under a form. Both sizes
 * are the same height.
 */
import { LinkButton } from '@wideset/react';

export default function LinkButtonSizes() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      {(['sm', 'lg'] as const).map((size) => (
        <LinkButton key={size} size={size} href="#invoices">
          View invoices
        </LinkButton>
      ))}
    </div>
  );
}
