import { cn } from 'src/lib/utils';

import { useTreeViewItemContext } from './TreeView.context';
import type { TreeViewIconProps } from './TreeView.types';

const TreeViewIcon = ({ icon, expandedIcon, className, ...props }: TreeViewIconProps) => {
  const { expanded } = useTreeViewItemContext();
  const Icon = expanded && expandedIcon ? expandedIcon : icon;

  return (
    <Icon
      aria-hidden="true"
      data-slot="tree-view-icon"
      className={cn('size-ws-9 text-ws-static-subtle mr-ws-2 shrink-0', className)}
      {...props}
    />
  );
};

TreeViewIcon.displayName = 'TreeViewIcon';

export { TreeViewIcon };
