'use client';

import { Count } from '@/components/ui/wideset/count/Count';
import { cn } from '@/lib/wideset/utils';

import { useTabsContext } from './Tabs.context';
import type { TabsCountProps } from './Tabs.types';

const TabsCount = ({ children, className }: TabsCountProps) => {
  const { type, size } = useTabsContext();

  // At sm Figma nests the icon and label in a `Label` frame with Gap/3, while the
  // count sits outside it at the item's Gap/5. The item carries the smaller gap, so
  // the count makes up the 4px difference itself.
  const isUnderlined = type !== 'pills';
  const needsOffset = isUnderlined && size !== 'lg';

  return (
    <Count data-slot="tabs-count" className={cn(needsOffset && 'ml-ws-3', className)}>
      {children}
    </Count>
  );
};

TabsCount.displayName = 'Tabs.Count';

export { TabsCount };
