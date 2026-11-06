import { forwardRef } from 'react';

import { cn } from '../../lib/utils';
import type { ActionBarActionsProps } from './ActionBar.types';

// Figma 15244:10638. Padding (6/12), radius (10) and the 4px gap between actions are unbound
// in Figma: Gap/4, Gap/7, Control/xl and Gap/3 carry them. Its Shadow/sm effect style has no
// token; Controls/Control is the same 0 1 1 shadow, lighter.
const ActionBarActions = forwardRef<HTMLDivElement, ActionBarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="action-bar-actions"
      className={cn(
        'gap-ws-3 px-ws-7 py-ws-4 flex items-center self-stretch',
        'rounded-ws-control-xl bg-ws-static-foreground shadow-ws-controls-control',
        className,
      )}
      {...props}
    />
  ),
);

ActionBarActions.displayName = 'ActionBar.Actions';

export { ActionBarActions };
