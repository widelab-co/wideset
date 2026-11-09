'use client';

import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/wideset/utils';

import { useTabsContext } from './Tabs.context';
import { useTabsIndicator } from './Tabs.hooks';
import type { TabsListProps } from './Tabs.types';
import { tabsIndicatorVariants, tabsListVariants } from './Tabs.variants';

const TabsList = ({ className, children, ref, ...props }: TabsListProps) => {
  const { size, type, divider, motion } = useTabsContext();
  const travels = type !== 'pills';
  const underline = travels && type !== 'ghost';
  const { ref: indicatorRef, indicator } = useTabsIndicator(travels);
  const composedRef = useComposedRefs(ref, indicatorRef);

  return (
    <RadixTabs.List
      ref={composedRef}
      className={cn(
        tabsListVariants({ size, type }),
        // The divider spans the container; the tabs stay left-aligned on it.
        { 'border-ws-static-subtle w-full border-b': divider && underline },
        className,
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
      {travels && indicator && (
        <span
          aria-hidden
          className={cn(
            tabsIndicatorVariants({ type, animate: motion && indicator.animate }),
            !indicator.visible && 'opacity-0',
          )}
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
        />
      )}
    </RadixTabs.List>
  );
};

TabsList.displayName = 'Tabs.List';

export { TabsList };
