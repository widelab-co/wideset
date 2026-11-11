// TODO(custom): keyboard hint (key chips and what they do); no Kbd or shortcut chip in Wideset.
import type { RemixiconComponentType } from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

/** A keyboard hint in the footer: the keys, then what they do. */
export function Hint({ keys, children }: { keys: ReactNode; children: string }) {
  return (
    <span className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      {keys}
      {children}
    </span>
  );
}

/**
 * A key, drawn as Figma draws it here: the box of Button `xs` Border, as a `kbd`, since it names
 * a key and is not pressed. An icon key names itself for screen readers.
 */
export function Key({
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
