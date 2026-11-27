import React from 'react';
import { cn } from 'src/lib/utils';

import { useTreeViewItemContext } from './TreeView.context';
import type { TreeViewSuffixProps } from './TreeView.types';
import { treeViewQuietPartClassName } from './TreeView.variants';

// A column at least an icon wide, so single letters and dots line up down the tree.
const TreeViewSuffix = React.forwardRef<HTMLSpanElement, TreeViewSuffixProps>(
  ({ id, className, ...props }, ref) => {
    const { suffixId } = useTreeViewItemContext();

    return (
      <span
        ref={ref}
        id={id ?? suffixId}
        data-slot="tree-view-suffix"
        className={cn(
          'min-w-ws-9 typography-label-sm flex shrink-0 items-center justify-center tabular-nums',
          treeViewQuietPartClassName,
          className,
        )}
        {...props}
      />
    );
  },
);

TreeViewSuffix.displayName = 'TreeViewSuffix';

export { TreeViewSuffix };
