import { forwardRef } from 'react';
import { Count } from 'src/components/count/Count';
import { cn } from 'src/lib/utils';

import { useTabsContext } from './Tabs.context';
import type { TabsCountProps } from './Tabs.types';
import { tabsCountVariants } from './Tabs.variants';

const TabsCount = forwardRef<HTMLSpanElement, TabsCountProps>(
  ({ children, className, ...props }, ref) => {
    const { type, size } = useTabsContext();

    return (
      <Count
        ref={ref}
        data-slot="tabs-count"
        className={cn(tabsCountVariants({ type, size }), className)}
        {...props}
      >
        {children}
      </Count>
    );
  },
);

TabsCount.displayName = 'Tabs.Count';

export { TabsCount };
