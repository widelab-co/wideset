import { forwardRef } from 'react';

import { cn } from '../../lib/utils';
import { useDefaultMotion } from '../../motion/MotionProvider';
import type { ActionBarProps, ActionBarWithSubComponents } from './ActionBar.types';
import { actionBarMotionVariants, actionBarVariants } from './ActionBar.variants';
import { ActionBarActions } from './ActionBarActions';
import { ActionBarCount } from './ActionBarCount';
import { ActionBarSelectAll } from './ActionBarSelectAll';

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ isOpen, position, align, className, defaultMotion, ...props }, ref) => {
    const motion = useDefaultMotion(defaultMotion);

    return (
      <div
        ref={ref}
        data-slot="action-bar"
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden={isOpen ? undefined : true}
        inert={isOpen ? undefined : true}
        className={cn(
          actionBarVariants({ position, align }),
          actionBarMotionVariants({ enabled: motion, position }),
          className,
        )}
        {...props}
      />
    );
  },
) as ActionBarWithSubComponents;

ActionBar.displayName = 'ActionBar';
ActionBar.Count = ActionBarCount;
ActionBar.Actions = ActionBarActions;
ActionBar.SelectAll = ActionBarSelectAll;
