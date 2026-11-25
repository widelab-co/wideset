import React from 'react';
import { cn } from 'src/lib/utils';

import { useTreeViewItemContext } from './TreeView.context';
import type { TreeViewLabelProps } from './TreeView.types';

const TreeViewLabel = React.forwardRef<HTMLSpanElement, TreeViewLabelProps>(
  ({ id, className, ...props }, ref) => {
    const { labelId } = useTreeViewItemContext();

    return (
      <span
        ref={ref}
        id={id ?? labelId}
        data-slot="tree-view-label"
        className={cn('min-w-0 flex-1 truncate', className)}
        {...props}
      />
    );
  },
);

TreeViewLabel.displayName = 'TreeViewLabel';

export { TreeViewLabel };
