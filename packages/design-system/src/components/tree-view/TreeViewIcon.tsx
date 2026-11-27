import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { useTreeViewItemContext } from './TreeView.context';
import type { TreeViewIconProps } from './TreeView.types';
import { treeViewQuietPartClassName } from './TreeView.variants';

const TreeViewIcon = forwardRef<SVGSVGElement, TreeViewIconProps>(
  ({ icon, expandedIcon, className, ...props }, ref) => {
    const { expanded } = useTreeViewItemContext();
    const Icon = expanded && expandedIcon ? expandedIcon : icon;

    return (
      <Icon
        ref={ref}
        aria-hidden="true"
        data-slot="tree-view-icon"
        className={cn('size-ws-9 mr-ws-2 shrink-0', treeViewQuietPartClassName, className)}
        {...props}
      />
    );
  },
);

TreeViewIcon.displayName = 'TreeViewIcon';

export { TreeViewIcon };
