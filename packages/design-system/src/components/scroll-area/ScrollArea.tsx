import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef, type MouseEvent, useRef } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { useScrollTabStop } from './ScrollArea.hooks';
import type { ScrollAreaProps } from './ScrollArea.types';
import {
  scrollAreaClassName,
  scrollAreaScrollbarMotionVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbClassName,
  scrollAreaViewportVariants,
} from './ScrollArea.variants';

// A native scrollbar never takes focus, so pressing this one must not either: in a combobox the
// field would blur and close the list under the pointer.
const keepFocus = (event: MouseEvent) => event.preventDefault();

/** `ref` points at the viewport, the element that scrolls (`scrollTo`, a virtualiser's element). */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      orientation = 'vertical',
      scrollbarVisibility = 'hover',
      scrollbarGutter = false,
      tabIndex,
      defaultMotion,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const viewportRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ref, viewportRef);
    const tabStop = useScrollTabStop(viewportRef);
    const bars = orientation === 'both' ? (['vertical', 'horizontal'] as const) : [orientation];

    return (
      <RadixScrollArea.Root
        data-slot="scroll-area"
        type={scrollbarVisibility === 'never' ? 'always' : scrollbarVisibility}
        className={cn(scrollAreaClassName, className)}
        {...props}
      >
        <RadixScrollArea.Viewport
          ref={composedRef}
          data-slot="scroll-area-viewport"
          tabIndex={tabIndex ?? (tabStop ? 0 : undefined)}
          className={scrollAreaViewportVariants({ orientation, scrollbarGutter })}
        >
          {children}
        </RadixScrollArea.Viewport>
        {bars.map((bar) => (
          <RadixScrollArea.Scrollbar
            key={bar}
            data-slot="scroll-area-scrollbar"
            orientation={bar}
            // Mounted while hidden too, so it fades out instead of vanishing.
            forceMount
            onMouseDown={keepFocus}
            className={cn(
              scrollAreaScrollbarVariants({
                orientation: bar,
                hidden: scrollbarVisibility === 'never',
              }),
              scrollAreaScrollbarMotionVariants({ enabled: motion }),
            )}
          >
            <RadixScrollArea.Thumb
              data-slot="scroll-area-thumb"
              className={scrollAreaThumbClassName}
            />
          </RadixScrollArea.Scrollbar>
        ))}
        {orientation === 'both' && <RadixScrollArea.Corner data-slot="scroll-area-corner" />}
      </RadixScrollArea.Root>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
