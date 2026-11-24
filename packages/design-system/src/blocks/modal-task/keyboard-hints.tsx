import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
} from '@remixicon/react';
import { Button, IconButton, Modal } from '@wideset/react';
import { forwardRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

type Step = 1 | -1;

type KeyboardHintsProps = {
  /** Up and Down; by default they move the focus to the previous or next control of the modal. */
  onMove?: (step: Step) => void;
  /** Left: back to where the modal was opened from. */
  onBack: () => void;
};

/**
 * The hints in the modal's footer strip, as Figma draws them: moving through the modal, going
 * back to where it was opened from, and closing. Each key is a button that does what the key
 * does, for the pointer; from the keyboard, `modalKeys` on `Modal.Content` answers the keys and
 * Esc is the Modal's own.
 */
export function KeyboardHints({ onMove, onBack }: KeyboardHintsProps) {
  const move = (step: Step) => (event: MouseEvent<HTMLButtonElement>) => {
    if (onMove) onMove(step);
    else {
      const dialog = event.currentTarget.closest<HTMLElement>('[role="dialog"]');
      if (dialog) moveFocus(dialog, document.activeElement, step);
    }
  };

  return (
    <>
      <div className="gap-ws-12 flex items-center">
        <Hint
          keys={
            <span className="gap-ws-3 flex">
              <KeyButton icon={RiArrowUpSLine} name="Up arrow" onClick={move(-1)} />
              <KeyButton icon={RiArrowDownSLine} name="Down arrow" onClick={move(1)} />
            </span>
          }
        >
          Navigate
        </Hint>
        <Hint keys={<KeyButton icon={RiArrowLeftLine} name="Left arrow" onClick={onBack} />}>
          Return to parent
        </Hint>
      </div>
      <Hint
        keys={
          <Modal.Close asChild>
            <KeyButton>Esc</KeyButton>
          </Modal.Close>
        }
      >
        Close
      </Hint>
    </>
  );
}

/** One hint: the keys, then what they do. */
function Hint({ keys, children }: { keys: ReactNode; children: string }) {
  return (
    <span className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      {keys}
      {children}
    </span>
  );
}

/** A pointer press on a key keeps the focus where it was, so the key acts from there. */
const keepFocus = (event: MouseEvent) => event.preventDefault();

type KeyButtonProps = {
  /** An icon key (the arrows); its `name` is what screen readers hear. */
  icon?: RemixiconComponentType;
  name?: string;
  /** A key written as text (`Esc`). */
  children?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

/**
 * A key the hint names, drawn as Figma draws it here: an `xs` Border button, clickable for the
 * pointer. Out of the Tab order: from the keyboard, the key itself does the job.
 */
const KeyButton = forwardRef<HTMLButtonElement, KeyButtonProps>(
  ({ icon, name, children, onClick, ...props }, ref) =>
    icon ? (
      <IconButton
        ref={ref}
        icon={icon}
        aria-label={name}
        size="xs"
        variant="secondary"
        preset="border"
        tabIndex={-1}
        onMouseDown={keepFocus}
        onClick={onClick}
        {...props}
      />
    ) : (
      <Button
        ref={ref}
        size="xs"
        variant="secondary"
        preset="border"
        tabIndex={-1}
        onMouseDown={keepFocus}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    ),
);
KeyButton.displayName = 'KeyButton';

/** Places where the arrows already mean something: a list, a choice, tabs, a menu, a number. */
const OWN_ARROWS =
  'textarea, select, [role="combobox"], [aria-haspopup], [role="listbox"], [role="radiogroup"], [role="radio"], [role="tablist"], [role="tab"], [role="menu"], [role="slider"], input[type="number"], input[type="range"]';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** In a text field the caret moves with Left, unless it stands at the very start. */
const caretAtStart = (target: Element) =>
  !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) ||
  (target.selectionStart === 0 && target.selectionEnd === 0);

/**
 * Moves the focus to the previous or next visible control of `container`, from `from`; from
 * outside it (nothing focused yet), Down goes to the first control and Up to the last.
 */
function moveFocus(container: HTMLElement, from: Element | null, step: Step): boolean {
  const controls = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.getClientRects().length > 0,
  );
  const index = controls.indexOf(from as HTMLElement);
  const next =
    index === -1 ? controls[step === 1 ? 0 : controls.length - 1] : controls[index + step];
  if (!next) return false;
  next.focus();
  return true;
}

/**
 * The keys the hints name, for `Modal.Content`'s `onKeyDown`: Up and Down move to the previous or
 * next control in the modal, Left goes back with `onBack`. Neither takes a key from a place that
 * uses it (a select, a radio group, tabs, a list, a menu), nor one already handled; Left in a text
 * field only once the caret is at its start, so it still moves the caret.
 */
export function modalKeys(onBack: () => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    const { key, target, currentTarget } = event;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!(target instanceof Element) || target.closest(OWN_ARROWS)) return;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      if (moveFocus(currentTarget, target, key === 'ArrowDown' ? 1 : -1)) event.preventDefault();
    } else if (key === 'ArrowLeft' && !event.shiftKey && caretAtStart(target)) {
      event.preventDefault();
      onBack();
    }
  };
}
