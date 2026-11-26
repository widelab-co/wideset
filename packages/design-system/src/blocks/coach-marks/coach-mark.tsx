// TODO(custom): a coach mark (one step of a tour: a step count, Back, Next, Skip, arrow keys between steps); Wideset has no tour or step popover, so it is composed from Popup.
import { Button, Popup } from '@wideset/react';
import { type RefObject, useEffect, useRef } from 'react';

import type { TourStep } from './data';

type CoachMarkProps = {
  steps: TourStep[];
  step: number;
  /** Whether the tour is showing; the mark plays its exit while it turns false. */
  open: boolean;
  onStepChange: (step: number) => void;
  /** Skip, Done and Esc all end the tour. */
  onClose: () => void;
  /** Where focus goes when the tour ends: the menu that starts it again. */
  returnFocusRef: RefObject<HTMLElement | null>;
};

/**
 * One step of the tour, anchored under the control its `TourSpot` rings. It reads as a sentence
 * about that control: a title and one or two lines, the step count beside the title, Skip tour on
 * the left of the footer and Back and Next on the right, Next being the mark's one filled button
 * (Done on the last step). Each step mounts a new surface, so the mark enters again at its new
 * target with Popup's own short motion, which the motion tokens cut to nothing for reduced motion.
 * Focus lands on the mark itself, which reads its title and lines out and draws no second ring
 * beside the target's; there Enter is Next, the arrow keys step back and forth and Esc skips.
 * Clicks on the page leave the mark where it is: the reader may be trying the control it shows.
 */
export function CoachMark({
  steps,
  step,
  open,
  onStepChange,
  onClose,
  returnFocusRef,
}: CoachMarkProps) {
  const surface = useRef<HTMLDivElement>(null);
  // A surface that leaves because the step changed must not pull focus out of the next one.
  const showing = useRef(open);
  useEffect(() => {
    showing.current = open;
  }, [open]);

  const { title, body, align } = steps[step];
  const last = step === steps.length - 1;
  const go = (to: number) => to >= 0 && to < steps.length && onStepChange(to);

  return (
    <Popup.Container
      key={step}
      ref={surface}
      side="bottom"
      align={align}
      sideOffset={12}
      collisionPadding={16}
      // Wide enough that every step's text sets in two lines; still under Popup's own 492px.
      className="w-[26rem]"
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        surface.current?.focus();
      }}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        if (!showing.current) returnFocusRef.current?.focus();
      }}
      onEscapeKeyDown={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(step + 1);
        if (event.key === 'ArrowLeft') go(step - 1);
        // On the mark itself (not on one of its buttons), Enter is Next.
        if (event.key === 'Enter' && event.target === event.currentTarget) {
          if (last) onClose();
          else go(step + 1);
        }
      }}
    >
      <Popup.Content contentClassName="gap-ws-3 flex flex-col">
        <div className="gap-ws-7 flex items-baseline justify-between">
          <Popup.Title>{title}</Popup.Title>
          <span className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums">
            {`${step + 1} of ${steps.length}`}
          </span>
        </div>
        <Popup.Description>{body}</Popup.Description>
      </Popup.Content>
      <Popup.Footer className="justify-between">
        <Button variant="secondary" preset="ghost" size="sm" onClick={onClose}>
          Skip tour
        </Button>
        <div className="gap-ws-5 flex items-center">
          {step > 0 && (
            <Button variant="secondary" preset="border" size="sm" onClick={() => go(step - 1)}>
              Back
            </Button>
          )}
          <Button size="sm" onClick={() => (last ? onClose() : go(step + 1))}>
            {last ? 'Done' : 'Next'}
          </Button>
        </div>
      </Popup.Footer>
    </Popup.Container>
  );
}
