// TODO(custom): a tour's target ring, which is also its coach mark's anchor; Wideset's Popup anchors only to its own trigger (there is no Popup.Anchor), and nothing marks a target.
import { cn, Popup } from '@wideset/react';
import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react';

import type { TourTarget } from './data';

/** Which control the tour points at now, and whether the tour is showing. */
export const TourContext = createContext<{ target?: TourTarget; open: boolean }>({ open: false });

/** Whether the device asks for less motion; where there is no `matchMedia` (a test), it does not. */
const reducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Wraps a control the tour can point at. While it is the current step, a ring in the brand colour
 * sits 4px outside the control, and the ring is the coach mark's anchor (a `Popup.Trigger` nobody
 * can click), so the mark follows the control when the page scrolls or the window resizes. The
 * ring stays (unringed) while the tour closes, so the mark leaves from where it was. The control
 * itself is untouched: it still works under the ring.
 */
export function TourSpot({
  id,
  className,
  children,
}: {
  id: TourTarget;
  className?: string;
  children: ReactNode;
}) {
  const { target, open } = useContext(TourContext);
  const ring = useRef<HTMLSpanElement>(null);
  const current = target === id;

  // Bring the target into view; smoothly, unless the device asks for less motion.
  useEffect(() => {
    if (!current || !open || typeof ring.current?.scrollIntoView !== 'function') return;
    ring.current.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: reducedMotion() ? 'auto' : 'smooth',
    });
  }, [current, open]);

  return (
    <div className={cn('relative', className)}>
      {children}
      {current && (
        <Popup.Trigger asChild>
          <span
            ref={ring}
            aria-hidden="true"
            tabIndex={-1}
            className={cn(
              '-inset-ws-3 rounded-ws-container-sm pointer-events-none absolute',
              open && 'outline-ws-dynamic-primary-default outline-2',
            )}
          />
        </Popup.Trigger>
      )}
    </div>
  );
}
