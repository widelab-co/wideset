'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useTabsContext } from './Tabs.context';
import type { TabsItemProps } from './Tabs.types';
import { tabsItemMotionVariants, tabsItemVariants } from './Tabs.variants';

const TabsItem = forwardRef<HTMLButtonElement, TabsItemProps>(
  ({ className, children, disabled: propDisabled, ...props }, ref) => {
    const { type, size, disabled: contextDisabled, motion } = useTabsContext();
    const disabled = propDisabled || contextDisabled;

    return (
      <RadixTabs.Trigger
        ref={ref}
        className={cn(
          tabsItemVariants({ type, size }),
          tabsItemMotionVariants({ enabled: motion }),
          className,
        )}
        disabled={disabled}
        data-slot="tabs-item"
        {...props}
      >
        {children}
      </RadixTabs.Trigger>
    );
  },
);

TabsItem.displayName = 'Tabs.Item';

export { TabsItem };
