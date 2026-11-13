import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { ScrollAreaProps } from './ScrollArea.types';

/** `ref` points at the viewport, the element that scrolls. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', indicatorHidden, children, className, ...props }, ref) => (
    <RadixScrollArea.Root
      data-slot="scroll-area"
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {/* Radix positions the scrollbar absolutely over the viewport, so the
        viewport reserves the bar's footprint (8px track + 2px gap) on its
        scrolling edge — content never sits under the indicator. With `both`,
        only the vertical edge is reserved: the horizontal bar appears over the
        bottom edge only while wide content overflows. */}
      <RadixScrollArea.Viewport
        ref={ref}
        data-slot="scroll-area-viewport"
        className={cn(
          'h-full w-full max-w-full min-w-0',
          !indicatorHidden && (orientation === 'horizontal' ? 'pb-ws-6' : 'pr-ws-6'),
        )}
      >
        {children}
      </RadixScrollArea.Viewport>
      {(orientation === 'both' ? (['vertical', 'horizontal'] as const) : [orientation]).map(
        (barOrientation) => (
          <RadixScrollArea.Scrollbar
            key={barOrientation}
            data-slot="scroll-area-scrollbar"
            className={cn(
              'bg-ws-static-alpha-subtle hover:bg-ws-static-alpha-base p-ws-1 flex touch-none rounded-[0.75rem] transition-colors select-none',
              barOrientation === 'horizontal' ? 'h-ws-5 flex-col' : 'w-ws-5',
              indicatorHidden && 'h-0 w-0 bg-transparent',
            )}
            orientation={barOrientation}
          >
            <RadixScrollArea.Thumb
              data-slot="scroll-area-thumb"
              className="bg-ws-dynamic-secondary-alpha-strong-default relative flex-1 rounded-[0.5rem]"
            />
          </RadixScrollArea.Scrollbar>
        ),
      )}
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  ),
);

ScrollArea.displayName = 'ScrollArea';
