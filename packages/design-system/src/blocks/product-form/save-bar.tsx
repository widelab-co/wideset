// TODO(custom): save bar along the card's foot (Cancel, Save draft, Publish); ActionBar is for selections only.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

/**
 * The centred layout's actions: a bar pinned to the card's foot, under the scrolling form, so
 * Publish stays in view however far down the form is filled. It runs on the form's column, so
 * its buttons end where the sections do. Copied from account-settings, always shown here.
 */
export function SaveBar({ column, children }: { column: string; children: ReactNode }) {
  return (
    <div className="border-ws-static-base py-ws-7 shrink-0 border-t">
      <div className={cn(column, 'gap-ws-5 flex items-center justify-end')}>{children}</div>
    </div>
  );
}
