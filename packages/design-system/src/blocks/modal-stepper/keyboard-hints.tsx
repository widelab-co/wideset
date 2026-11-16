// TODO(custom): keyboard hints (a key chip and what it does) and the keys they name; Wideset has no Kbd / shortcut component, so the key is the box of Button `xs` Border drawn by hand.
import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * The hints in the modal's footer strip, as Figma draws them: moving through the modal, going
 * back to where it was opened from, and closing. Esc is the Modal's own; `modalKeys` wires the
 * other two on `Modal.Content`, so every hint does what it says.
 */
export function KeyboardHints() {
  return (
    <>
      <div className="gap-ws-12 flex items-center">
        <Hint
          keys={
            <span className="gap-ws-3 flex">
              <Key icon={RiArrowUpSLine} name="Up arrow" />
              <Key icon={RiArrowDownSLine} name="Down arrow" />
            </span>
          }
        >
          Navigate
        </Hint>
        <Hint keys={<Key icon={RiArrowLeftLine} name="Left arrow" />}>Return to parent</Hint>
      </div>
      <Hint keys={<Key>esc</Key>}>Close</Hint>
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

/** A key as a `kbd`, 24px high. An icon key names itself for screen readers. */
function Key({
  icon: Icon,
  name,
  children,
}: {
  icon?: RemixiconComponentType;
  name?: string;
  children?: string;
}) {
  return (
    <kbd
      className={cn(
        'font-ws-body border-ws-dynamic-secondary-default bg-ws-static-highlight-subtle shadow-ws-controls-control rounded-ws-control-md h-ws-12 typography-caption-strong-md text-ws-dynamic-secondary-default flex items-center justify-center border',
        Icon ? 'w-ws-12' : 'px-ws-5',
      )}
    >
      {Icon ? (
        <>
          <Icon aria-hidden="true" className="size-ws-8 shrink-0" />
          <span className="sr-only">{name}</span>
        </>
      ) : (
        children
      )}
    </kbd>
  );
}

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
      const controls = [...currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.getClientRects().length > 0,
      );
      const next =
        controls[controls.indexOf(target as HTMLElement) + (key === 'ArrowDown' ? 1 : -1)];
      if (!next) return;
      event.preventDefault();
      next.focus();
    } else if (key === 'ArrowLeft' && !event.shiftKey && caretAtStart(target)) {
      event.preventDefault();
      onBack();
    }
  };
}
