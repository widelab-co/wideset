import type * as RadixScrollArea from '@radix-ui/react-scroll-area';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ScrollAreaProps = Omit<
  ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
  'children'
> & {
  children: ReactNode;
  /** Which edges scroll. `both` adds a horizontal scrollbar for content wider than the area. */
  orientation?: 'horizontal' | 'vertical' | 'both';
  indicatorHidden?: boolean;
};
