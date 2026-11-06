import { forwardRef } from 'react';

import { cn } from '../../lib/utils';
import type { ActionBarCountProps } from './ActionBar.types';

// Figma 15244:10659 / 10529: Label/Small, 12px inline padding. The text fill is unbound
// (#000) in Figma; Static/Text/Strong is the nearest token.
const ActionBarCount = forwardRef<HTMLParagraphElement, ActionBarCountProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="action-bar-count"
      role="status"
      className={cn(
        'px-ws-7 typography-label-sm text-ws-static-strong whitespace-nowrap',
        className,
      )}
      {...props}
    />
  ),
);

ActionBarCount.displayName = 'ActionBar.Count';

export { ActionBarCount };
