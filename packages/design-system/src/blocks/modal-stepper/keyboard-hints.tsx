// TODO(custom): keyboard hints (a key chip and what it does); Wideset has no Kbd / shortcut component, so the key is the box of Button `xs` Border drawn by hand.
import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

/**
 * The hints in the modal's footer strip, as Figma draws them: moving through the modal, going
 * back to where it was opened from, and closing. They only say what the keys do: Esc is the
 * Modal's own, the others are yours to wire to what the modal holds.
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
