// TODO(custom): a command row (icon, name, quiet context, shortcut keys) driven by the palette's field; ListItem is a menu row that takes focus itself and has no keys slot.
import { cn } from '@wideset/react';

import type { Command } from './data';
import { Highlight } from './highlight';
import { Key } from './keyboard-hints';

/**
 * One command, an option of the list the palette's field drives: the field keeps the focus, so the
 * row never takes it and `active` (the arrow keys, or the pointer) is its only highlight. One line,
 * 40px: the icon, the name, the context after it in the quiet colour, and the shortcut on the
 * right, so a long list stays compact and the names line up.
 */
export function CommandRow({
  command,
  query,
  active,
  id,
  onActivate,
  onRun,
}: {
  command: Command;
  query: string;
  active: boolean;
  id: string;
  onActivate: () => void;
  onRun: () => void;
}) {
  const { icon: Icon, name, context, keys } = command;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- the field holds the focus and its Enter runs the active option
    <div
      id={id}
      role="option"
      aria-selected={active}
      onPointerMove={onActivate}
      onClick={onRun}
      className={cn(
        'h-ws-16 gap-ws-9 px-ws-7 rounded-ws-control-lg flex cursor-pointer items-center',
        active && 'bg-ws-dynamic-tertiary-alpha-hover',
      )}
    >
      <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
      <span className="gap-ws-5 flex min-w-0 flex-1 items-baseline">
        <span className="typography-label-sm text-ws-static-strong max-w-[60%] shrink-0 truncate">
          <Highlight text={name} query={query} />
        </span>
        <span className="typography-body-sm text-ws-static-subtle min-w-0 truncate">
          <Highlight text={context} query={query} />
        </span>
      </span>
      {keys && (
        <span className="gap-ws-2 flex shrink-0">
          {keys.map((key) => (
            <Key key={key}>{key}</Key>
          ))}
        </span>
      )}
    </div>
  );
}
