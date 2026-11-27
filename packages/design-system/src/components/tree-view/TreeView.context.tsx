import { createContext, useContext } from 'react';

import type { TreeViewContextType, TreeViewItemContextType } from './TreeView.types';

export const TreeViewContext = createContext<TreeViewContextType | null>(null);

export const useTreeViewContext = () => {
  const context = useContext(TreeViewContext);
  if (!context) throw new Error('useTreeViewContext must be used within a <TreeView>');
  return context;
};

/** How deep the items rendered here sit: 1 at the root, one more inside each group. */
export const TreeViewLevelContext = createContext(1);

export const TreeViewItemContext = createContext<TreeViewItemContextType | null>(null);

export const useTreeViewItemContext = () => {
  const context = useContext(TreeViewItemContext);
  if (!context) throw new Error('useTreeViewItemContext must be used within a <TreeView.Item>');
  return context;
};
