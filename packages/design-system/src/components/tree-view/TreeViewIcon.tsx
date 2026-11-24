import { cn } from 'src/lib/utils';

import { useTreeViewItemContext } from './TreeView.context';
import type { TreeViewIconProps } from './TreeView.types';
import { treeViewQuietPartClassName } from './TreeView.variants';

const TreeViewIcon = ({ icon, expandedIcon, className, ...props }: TreeViewIconProps) => {
  const { expanded } = useTreeViewItemContext();
  const Icon = expanded && expandedIcon ? expandedIcon : icon;

  return (
    <Icon
      aria-hidden="true"
      data-slot="tree-view-icon"
      className={cn('size-ws-9 mr-ws-2 shrink-0', treeViewQuietPartClassName, className)}
      {...props}
    />
  );
};

TreeViewIcon.displayName = 'TreeViewIcon';

export { TreeViewIcon };
