import { useComposedRefs } from '@radix-ui/react-compose-refs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { TreeViewContext } from './TreeView.context';
import { parentItem, typeAheadTarget, visibleItems } from './TreeView.logic';
import type { TreeViewProps, TreeViewWithSubComponents } from './TreeView.types';
import { TreeViewGroup } from './TreeViewGroup';
import { TreeViewIcon } from './TreeViewIcon';
import { TreeViewItem } from './TreeViewItem';
import { TreeViewLabel } from './TreeViewLabel';
import { TreeViewSuffix } from './TreeViewSuffix';

const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      expanded,
      defaultExpanded = [],
      onExpandedChange,
      defaultMotion,
      className,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const tree = useRef<HTMLUListElement>(null);
    const composedRef = useComposedRefs(ref, tree);

    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isExpandedControlled = expanded !== undefined;
    const currentExpanded = isExpandedControlled ? expanded : internalExpanded;

    // The one item in the Tab order (roving tabindex): the last one focused, else the selected.
    const [focused, setFocused] = useState<string>();
    const tabStop = focused ?? currentValue;

    const toggle = (item: string) => {
      const next = currentExpanded.includes(item)
        ? currentExpanded.filter((open) => open !== item)
        : [...currentExpanded, item];
      if (!isExpandedControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    };

    /** A branch folds open or shut; a leaf is selected. A disabled item does neither. */
    const activate = (item: HTMLElement) => {
      if (item.getAttribute('aria-disabled') === 'true') return;
      const itemValue = item.dataset.value ?? '';
      if (item.hasAttribute('aria-expanded')) return toggle(itemValue);
      if (!isControlled) setInternalValue(itemValue);
      onValueChange?.(itemValue);
    };

    /** A click on an item's row; the item is the row's parent. */
    const handleClick = (event: React.MouseEvent<HTMLUListElement>) => {
      onClick?.(event);
      const row = (event.target as HTMLElement).closest('[data-slot="tree-view-item-row"]');
      if (!event.defaultPrevented && row?.parentElement) activate(row.parentElement);
    };

    // A tab stop that is not on screen (nothing selected yet, or its folder shut) moves to the
    // first item, so Tab always lands in the tree.
    useEffect(() => {
      const root = tree.current;
      if (!root || root.querySelector('[role="treeitem"][tabindex="0"]')) return;
      const first = visibleItems(root)[0]?.dataset.value;
      if (first !== undefined) setFocused(first);
    }, [tabStop, currentExpanded, children]);

    const focusElement = (item: HTMLElement | null | undefined) => {
      if (!item) return;
      item.focus();
      setFocused(item.dataset.value);
    };

    /** Arrow keys, Home, End, Enter, Space and type-ahead, as the WAI-ARIA tree pattern has them. */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
      onKeyDown?.(event);
      const root = tree.current;
      const item = event.target as HTMLElement;
      if (event.defaultPrevented || !root || item.getAttribute('role') !== 'treeitem') return;

      const items = visibleItems(root);
      const index = items.indexOf(item);
      const isOpen = item.getAttribute('aria-expanded') === 'true';
      const isShut = item.getAttribute('aria-expanded') === 'false';

      switch (event.key) {
        case 'ArrowDown':
          focusElement(items[index + 1]);
          break;
        case 'ArrowUp':
          focusElement(items[index - 1]);
          break;
        case 'Home':
          focusElement(items[0]);
          break;
        case 'End':
          focusElement(items[items.length - 1]);
          break;
        case 'ArrowRight':
          if (isOpen) focusElement(items[index + 1]);
          else if (isShut) activate(item);
          break;
        case 'ArrowLeft':
          // A disabled open branch cannot shut, so Left goes on to its parent.
          if (isOpen && item.getAttribute('aria-disabled') !== 'true') activate(item);
          else focusElement(parentItem(item));
          break;
        case 'Enter':
        case ' ':
          activate(item);
          break;
        default: {
          const isChar =
            event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
          if (!isChar) return;
          focusElement(typeAheadTarget(items, index, event.key));
        }
      }
      event.preventDefault();
    };

    const context = useMemo(
      () => ({ currentValue, currentExpanded, tabStop, motion, focusItem: setFocused }),
      [currentValue, currentExpanded, tabStop, motion],
    );

    return (
      <TreeViewContext.Provider value={context}>
        <ul
          ref={composedRef}
          role="tree"
          data-slot="tree-view"
          className={cn('flex flex-col', className)}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </ul>
      </TreeViewContext.Provider>
    );
  },
) as TreeViewWithSubComponents;

TreeView.displayName = 'TreeView';
TreeView.Item = TreeViewItem;
TreeView.Group = TreeViewGroup;
TreeView.Icon = TreeViewIcon;
TreeView.Label = TreeViewLabel;
TreeView.Suffix = TreeViewSuffix;

export { TreeView, TreeViewGroup, TreeViewIcon, TreeViewItem, TreeViewLabel, TreeViewSuffix };
