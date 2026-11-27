import type { RemixiconComponentType } from '@remixicon/react';
import { Button, IconButton } from '@wideset/react';
import { forwardRef, type MouseEvent, type ReactNode } from 'react';

/** One hint: the keys, then what they do. */
export function Hint({ keys, children }: { keys: ReactNode; children: string }) {
  return (
    <span className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      {keys}
      {children}
    </span>
  );
}

/** A pointer press on a key keeps the focus in the field, so the keyboard keeps working. */
const keepFocus = (event: MouseEvent) => event.preventDefault();

type KeyButtonProps = (
  | { icon: RemixiconComponentType; name: string; children?: never }
  | { icon?: never; name?: never; children: string }
) & {
  onClick?: () => void;
};

/**
 * A key the hint names, drawn as Figma draws it here: an `xs` Border button, clickable for the
 * pointer. Out of the Tab order: from the keyboard, the key itself does the job.
 */
export const KeyButton = forwardRef<HTMLButtonElement, KeyButtonProps>(
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
