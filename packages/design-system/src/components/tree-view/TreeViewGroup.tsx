import React, { useContext } from 'react';
import { cn } from 'src/lib/utils';

import { TreeViewLevelContext } from './TreeView.context';
import type { TreeViewGroupProps } from './TreeView.types';
import { treeViewGroupVariants } from './TreeView.variants';

const TreeViewGroup = React.forwardRef<HTMLUListElement, TreeViewGroupProps>(
  ({ className, children, ...props }, ref) => {
    const level = useContext(TreeViewLevelContext);

    return (
      <TreeViewLevelContext.Provider value={level + 1}>
        <ul
          ref={ref}
          role="group"
          data-slot="tree-view-group"
          className={cn(treeViewGroupVariants(), className)}
          {...props}
        >
          {children}
        </ul>
      </TreeViewLevelContext.Provider>
    );
  },
);

TreeViewGroup.displayName = 'TreeViewGroup';

export { TreeViewGroup };
