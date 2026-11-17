'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useDefaultMotion } from '@/lib/wideset/motion/MotionProvider';
import { TabsContext } from './Tabs.context';
import type { TabsProps } from './Tabs.types';
import { tabsVariants } from './Tabs.variants';
import { TabsContent } from './TabsContent';
import { TabsCount } from './TabsCount';
import { TabsIcon } from './TabsIcon';
import { TabsItem } from './TabsItem';
import { TabsLabel } from './TabsLabel';
import { TabsList } from './TabsList';

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, size, type, divider = true, className, disabled, defaultMotion, ...props }, ref) => {
    const motion = useDefaultMotion(defaultMotion);

    return (
      <TabsContext.Provider value={{ size, type, divider, disabled, motion }}>
        <RadixTabs.Root
          ref={ref}
          data-slot="tabs"
          className={cn(tabsVariants({ size, type }), className)}
          {...props}
        >
          {children}
        </RadixTabs.Root>
      </TabsContext.Provider>
    );
  },
);

TabsRoot.displayName = 'Tabs';

const Tabs = Object.assign(TabsRoot, {
  Icon: TabsIcon,
  Label: TabsLabel,
  Count: TabsCount,
  List: TabsList,
  Item: TabsItem,
  Content: TabsContent,
});

export { Tabs };
