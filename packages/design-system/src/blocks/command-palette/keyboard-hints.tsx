// TODO(custom): keyboard hints (a key chip and what it does); Wideset has no Kbd / shortcut component, so the key is the box of Button `xs` Border drawn by hand.
import type { RemixiconComponentType } from '@remixicon/react';
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

/** One hint: the keys, then what they do. */
export function Hint({ keys, children }: { keys: ReactNode; children: string }) {
  return (
    <span className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      {keys}
      {children}
    </span>
  );
}

/**
 * A key as a `kbd`, 24px high, copied from the form modal's hints. An icon key names itself for
 * screen readers.
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
        'font-ws-body border-ws-dynamic-secondary-default bg-ws-static-highlight-subtle shadow-ws-controls-control rounded-ws-control-md h-ws-12 typography-caption-strong-md text-ws-dynamic-secondary-default flex shrink-0 items-center justify-center border',
        Icon || children?.length === 1 ? 'min-w-ws-12' : 'px-ws-5',
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
