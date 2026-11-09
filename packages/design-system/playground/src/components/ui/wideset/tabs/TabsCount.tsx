'use client';

import { Count } from '@/components/ui/wideset/count/Count';
import { cn } from '@/lib/wideset/utils';

import { useTabsContext } from './Tabs.context';
import type { TabsCountProps } from './Tabs.types';
import { tabsCountVariants } from './Tabs.variants';

const TabsCount = ({ children, className }: TabsCountProps) => {
  const { type, size } = useTabsContext();

  return (
    <Count data-slot="tabs-count" className={cn(tabsCountVariants({ type, size }), className)}>
      {children}
    </Count>
  );
};

TabsCount.displayName = 'Tabs.Count';

export { TabsCount };
