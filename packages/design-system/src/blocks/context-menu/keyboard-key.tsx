// TODO(custom): keyboard keys (a key chip, and a shortcut as a row of them); Wideset has no Kbd / shortcut component, so the key is the box of Button `xs` Border drawn by hand.
import { type RemixiconComponentType, RiCornerDownLeftLine } from '@remixicon/react';
import { cn } from '@wideset/react';

/** ⌘ on Apple keyboards, Ctrl elsewhere. */
export const MODIFIER =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

/** Keys drawn as a glyph rather than spelled out. */
const GLYPHS: Record<string, RemixiconComponentType> = { Enter: RiCornerDownLeftLine };

/**
 * A key as a `kbd`, 24px high, copied from the command palette's hints. An icon key names itself
 * for screen readers.
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

/**
 * A shortcut as the keys pressed together, on the right of a menu row. The keys are text in the
 * row, so a screen reader reads them after its label.
 */
export function Shortcut({ keys }: { keys: string[] }) {
  return (
    <span className="gap-ws-2 flex">
      {keys.map((key) =>
        GLYPHS[key] ? <Key key={key} icon={GLYPHS[key]} name={key} /> : <Key key={key}>{key}</Key>,
      )}
    </span>
  );
}
