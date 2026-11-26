import { forwardRef } from 'react';

import type { TabsLabelProps } from './Tabs.types';

const TabsLabel = forwardRef<HTMLSpanElement, TabsLabelProps>(({ children, ...props }, ref) => (
  <span ref={ref} data-slot="tabs-label" {...props}>
    {children}
  </span>
));

TabsLabel.displayName = 'Tabs.Label';

export { TabsLabel };
