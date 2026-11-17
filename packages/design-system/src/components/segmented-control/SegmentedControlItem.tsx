import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RadioGroup from '@radix-ui/react-radio-group';
import React, { Children, Fragment, isValidElement, useEffect, useRef } from 'react';
import { cn } from 'src/lib/utils';

import { useSegmentedControlContext } from './SegmentedControl.context';
import type { SegmentedControlItemProps } from './SegmentedControl.types';
import {
  segmentedControlItemMotionVariants,
  segmentedControlItemVariants,
} from './SegmentedControl.variants';
import { SegmentedControlIcon } from './SegmentedControlIcon';

const isIconChild = (child: React.ReactNode) =>
  isValidElement(child) && child.type === SegmentedControlIcon;

const flattenFragments = (children: React.ReactNode): React.ReactNode[] =>
  Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: React.ReactNode }>(child) && child.type === Fragment
      ? flattenFragments(child.props.children)
      : [child],
  );

// Elements that can name the item without text, e.g. `<img alt="Map" />`.
const NAMED_CONTENT_SELECTOR = 'img[alt], [aria-label]';

const hasOwnName = (element: Element) =>
  Boolean(
    element.getAttribute('aria-label')?.trim() ||
    (element.matches('img') && element.getAttribute('alt')?.trim()),
  );

// Attributes only: reading computed styles here would force a style recalculation on every render,
// so content hidden by CSS alone still counts.
// Stops at the item: an aria-hidden ancestor outside it (e.g. behind an open modal) says nothing
// about whether the item's content names it.
const isHiddenWithin = (element: Element | null, item: Element) => {
  for (let node = element; node && node !== item; node = node.parentElement) {
    if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden')) return true;
  }
  return false;
};

const hasVisibleName = (item: Element) => {
  const walker = item.ownerDocument.createTreeWalker(item, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent?.trim() && !isHiddenWithin(node.parentElement, item)) return true;
  }
  return Array.from(item.querySelectorAll(NAMED_CONTENT_SELECTOR)).some(
    (element) => hasOwnName(element) && !isHiddenWithin(element, item),
  );
};

// A directly referenced element supplies its name even when it is aria-hidden itself, so only
// what is hidden inside it is skipped.
const hasReferencedName = (item: HTMLElement, id: string) => {
  const label = item.ownerDocument.getElementById(id);
  return Boolean(label && (hasOwnName(label) || hasVisibleName(label)));
};

const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ className, children, icon: Icon, ...props }, ref) => {
    const { size, variant, motion } = useSegmentedControlContext();
    // Children.toArray drops null/undefined/booleans (e.g. `{showLabel && 'Map'}` when false),
    // but keeps empty/whitespace-only strings — those don't count as a label either.
    // A `SegmentedControl.Icon` child is an icon, not a label.
    const childArray = flattenFragments(children);
    const hasIconChild = childArray.some(isIconChild);
    const hasLabel = childArray.some((child) =>
      typeof child === 'string' ? child.trim() !== '' : !isIconChild(child),
    );
    const iconOnly = !hasLabel && (Boolean(Icon) || hasIconChild);
    const ariaLabel = props['aria-label'];
    const ariaLabelledby = props['aria-labelledby'];
    const itemRef = useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(ref, itemRef);
    const warned = useRef(false);

    // Reads the rendered item, so a wrapper component around the icon is caught too. Runs after
    // every render because the content can change; `warned` keeps it to one warning, StrictMode's
    // repeated effects included.
    useEffect(() => {
      const item = itemRef.current;
      if (!item) return;

      const unnamed =
        !ariaLabel?.trim() &&
        !ariaLabelledby?.split(/\s+/).some((id) => hasReferencedName(item, id)) &&
        !hasVisibleName(item);

      if (unnamed && !warned.current) {
        // eslint-disable-next-line no-console
        console.warn(
          'SegmentedControl.Item: icon-only items require a non-empty `aria-label` or `aria-labelledby` to have an accessible name.',
        );
      }
      warned.current = unnamed;
    });

    return (
      <RadioGroup.Item
        ref={composedRef}
        className={cn(
          segmentedControlItemVariants({ size, variant, iconOnly }),
          segmentedControlItemMotionVariants({ enabled: motion }),
          className,
        )}
        data-slot="segmented-control-item"
        {...props}
      >
        {Icon && (
          <Icon
            data-slot="segmented-control-icon"
            aria-hidden="true"
            focusable="false"
            className="size-ws-9 shrink-0"
          />
        )}
        {children}
      </RadioGroup.Item>
    );
  },
);

SegmentedControlItem.displayName = 'SegmentedControl.Item';

export { SegmentedControlItem };
