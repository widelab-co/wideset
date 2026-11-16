// TODO(custom): content that folds open and shut under a transcript row; Accordion folds only under its own titled trigger, and the library exports no bare collapsible.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

/**
 * What a row opens to. The height runs on a one-row grid going from `0fr` to `1fr`, so it needs
 * no measuring; it opens at the `fast` beat and shuts at `quick`, as menus do. Shut, the content
 * stays in the page but is inert: out of the tab order and unseen by a screen reader.
 */
export function Fold({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows,opacity] ease-(--ws-motion-ease-smooth-out)',
        open
          ? 'grid-rows-[1fr] opacity-100 duration-(--ws-motion-duration-fast)'
          : 'grid-rows-[0fr] opacity-0 duration-(--ws-motion-duration-quick)',
      )}
    >
      <div inert={!open} className="min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
