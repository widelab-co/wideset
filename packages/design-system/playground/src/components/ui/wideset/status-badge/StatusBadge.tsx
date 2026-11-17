'use client';

import React from 'react';
import { cn } from '@/lib/wideset/utils';

import { StatusBadgeContext } from './StatusBadge.context';
import type { StatusBadgeProps, StatusBadgeWithSubComponents } from './StatusBadge.types';
import { statusBadgeVariants } from './StatusBadge.variants';
import { StatusBadgeIcon } from './StatusBadgeIcon';
import { StatusBadgeLabel } from './StatusBadgeLabel';

const isText = (node: unknown): node is string | number =>
  typeof node === 'string' || typeof node === 'number';

/**
 * The icon-only styles match `>svg:only-child`, and CSS does not see text nodes: an icon beside
 * bare text would collapse the badge to an icon-sized square. So each run of bare text next to an
 * element is wrapped in a Label, which counts as a child.
 */
function labelBareText(children: React.ReactNode) {
  const items = React.Children.toArray(children);
  const hasText = items.some((item) => isText(item) && String(item).trim() !== '');
  // `items`, not `children`: keys stay the same whether or not bare text shows up.
  if (!hasText || !items.some((item) => React.isValidElement(item))) return items;

  const out: React.ReactNode[] = [];
  let text = '';
  const flush = () => {
    if (text.trim() !== '') {
      out.push(<StatusBadgeLabel key={`text-${out.length}`}>{text}</StatusBadgeLabel>);
    }
    text = '';
  };
  for (const item of items) {
    if (isText(item)) {
      text += item;
    } else {
      flush();
      out.push(item);
    }
  }
  flush();
  return out;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ children, color, size, className, emphasis, shape, ...props }, ref) => {
    return (
      <StatusBadgeContext.Provider value={{ size }}>
        <div
          ref={ref}
          data-slot="status-badge"
          className={cn(statusBadgeVariants({ color, size, emphasis, shape }), className)}
          {...props}
        >
          {labelBareText(children)}
        </div>
      </StatusBadgeContext.Provider>
    );
  },
) as StatusBadgeWithSubComponents;

StatusBadge.displayName = 'StatusBadge';
StatusBadge.Icon = StatusBadgeIcon;
StatusBadge.Label = StatusBadgeLabel;

export { StatusBadge };
