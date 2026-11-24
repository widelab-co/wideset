import React from 'react';
import { cn } from 'src/lib/utils';

import type { TreeViewSuffixProps } from './TreeView.types';

// A column at least an icon wide, so single letters and dots line up down the tree.
const TreeViewSuffix = React.forwardRef<HTMLSpanElement, TreeViewSuffixProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="tree-view-suffix"
      className={cn(
        'min-w-ws-9 typography-label-sm text-ws-static-subtle flex shrink-0 items-center justify-center tabular-nums',
        className,
      )}
      {...props}
    />
  ),
);

TreeViewSuffix.displayName = 'TreeViewSuffix';

export { TreeViewSuffix };
