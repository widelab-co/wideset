import { RiArrowRightSLine } from '@remixicon/react';
import React, {
  Children,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { cn } from 'src/lib/utils';

import { TreeViewItemContext, TreeViewLevelContext, useTreeViewContext } from './TreeView.context';
import type { TreeViewItemProps } from './TreeView.types';
import {
  treeViewChevronVariants,
  treeViewItemRowVariants,
  treeViewItemVariants,
} from './TreeView.variants';
import { TreeViewGroup } from './TreeViewGroup';
import { TreeViewSuffix } from './TreeViewSuffix';

const TreeViewItem = React.forwardRef<HTMLLIElement, TreeViewItemProps>(
  ({ value, disabled = false, className, children, onFocus, ...props }, ref) => {
    const { currentValue, currentExpanded, tabStop, motion, focusItem, releaseTabStop } =
      useTreeViewContext();
    const level = useContext(TreeViewLevelContext);
    const labelId = useId();
    const suffixId = useId();

    // The group goes under the row; everything else (icon, label, suffix) is the row.
    // Wrapping TreeView.Group or TreeView.Suffix in your own component hides it from this:
    // pass them directly.
    const all = Children.toArray(children);
    const group = all.find((child) => isValidElement(child) && child.type === TreeViewGroup);
    const row = all.filter((child) => child !== group);
    const suffix = row.find(
      (child): child is React.ReactElement<{ id?: string }> =>
        isValidElement(child) && child.type === TreeViewSuffix,
    );

    const isBranch = group !== undefined;
    const expanded = isBranch && currentExpanded.includes(value);
    const selected = !isBranch && currentValue === value;

    // Leaving while it holds the tab stop, the item asks the tree to pick another one, so Tab
    // still lands in the tree when nothing else re-renders it.
    const isTabStop = tabStop === value;
    const holdsTabStop = useRef(isTabStop);
    useEffect(() => {
      holdsTabStop.current = isTabStop;
    }, [isTabStop]);
    useEffect(() => {
      const holds = holdsTabStop;
      return () => {
        if (holds.current) releaseTabStop();
      };
    }, [releaseTabStop]);

    const itemContext = useMemo(
      () => ({ expanded, labelId, suffixId }),
      [expanded, labelId, suffixId],
    );

    return (
      <TreeViewItemContext.Provider value={itemContext}>
        <li
          ref={ref}
          role="treeitem"
          data-slot="tree-view-item"
          data-value={value}
          aria-level={level}
          aria-labelledby={labelId}
          // The suffix (a count, "modified") is read after the name, not as part of it.
          aria-describedby={suffix ? (suffix.props.id ?? suffixId) : undefined}
          aria-expanded={isBranch ? expanded : undefined}
          aria-selected={isBranch ? undefined : selected}
          aria-disabled={disabled || undefined}
          tabIndex={isTabStop ? 0 : -1}
          className={cn(treeViewItemVariants(), className)}
          // Clicks and keys are handled once, on the tree (TreeView.tsx).
          onFocus={(event) => {
            if (event.target === event.currentTarget) focusItem(value);
            onFocus?.(event);
          }}
          {...props}
        >
          <div
            data-slot="tree-view-item-row"
            data-disabled={disabled || undefined}
            className={treeViewItemRowVariants({ selected, branch: isBranch, motion })}
          >
            {isBranch ? (
              <RiArrowRightSLine
                aria-hidden="true"
                data-slot="tree-view-item-chevron"
                className={treeViewChevronVariants({ expanded, motion })}
              />
            ) : (
              // No chevron on a leaf: the space keeps its icon in line with a branch's.
              <span aria-hidden="true" className="size-ws-9 shrink-0" />
            )}
            {row}
          </div>
          {expanded && group}
        </li>
      </TreeViewItemContext.Provider>
    );
  },
);

TreeViewItem.displayName = 'TreeViewItem';

export { TreeViewItem };
