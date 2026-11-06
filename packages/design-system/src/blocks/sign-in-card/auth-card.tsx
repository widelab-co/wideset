import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';
import { type AnchorHTMLAttributes, type ReactNode, useEffect, useRef } from 'react';

import { AppIcon } from './app-icon';

/*
  The card a sign-in or sign-up screen sits in. The three starting points that use it (sign-in,
  sign-in-card, sign-up) carry byte-identical copies of this file and of app-icon.tsx;
  src/__tests__/blocks.test.tsx keeps them the same.
*/

type AuthCardProps = {
  /** The other screen (sign in, or create an account), in the footer; ↑ and ↓ open it too. */
  other: { href: string; label: string };
  children: ReactNode;
  className?: string;
};

const FOOTER_CONTROL =
  'typography-body-md text-ws-static-subtle hover:text-ws-static-base gap-ws-5 rounded-ws-control-md focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex cursor-pointer items-center';

/**
 * Figma's sign-in card: the app icon and the form on white, a grey footer that says how to leave by
 * keyboard. Esc, or ← outside a text field, goes back; ↑ or ↓ outside a text field opens the other
 * screen. In a field the arrows stay with the field: they move the caret and open autofill.
 * 740px tall as in Figma, or the window less the page's padding when that is shorter, and never
 * shorter than its content.
 */
export function AuthCard({ other, children, className }: AuthCardProps) {
  const back = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const typing =
        event.target instanceof Element &&
        event.target.closest('input, textarea, select, [contenteditable]') !== null;
      if (event.key === 'Escape' || (event.key === 'ArrowLeft' && !typing)) {
        back.current?.click();
      } else if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !typing) {
        event.preventDefault();
        next.current?.click();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-xl shadow-ws-low flex h-[min(46.25rem,calc(100dvh-3rem))] min-h-fit flex-col justify-between overflow-hidden',
        className,
      )}
    >
      <div className="gap-ws-12 p-ws-12 sm:p-ws-18 flex flex-col items-start">
        <AppIcon />
        {children}
      </div>
      <footer className="bg-ws-static-alpha-subtle px-ws-12 py-ws-9 flex items-center justify-between">
        <button
          ref={back}
          type="button"
          aria-keyshortcuts="Escape ArrowLeft"
          onClick={() => window.history.back()}
          className={FOOTER_CONTROL}
        >
          <Key icon={RiArrowLeftLine} />
          Back
        </button>
        <a
          ref={next}
          href={other.href}
          aria-keyshortcuts="ArrowUp ArrowDown"
          className={FOOTER_CONTROL}
        >
          <span className="gap-ws-3 flex">
            <Key icon={RiArrowUpSLine} />
            <Key icon={RiArrowDownSLine} />
          </span>
          {other.label}
        </a>
      </footer>
    </div>
  );
}

/**
 * A key, drawn as Figma draws it here: the box of Button `xs` Border, as a `kbd`. The control it
 * sits in names the shortcut (`aria-keyshortcuts`), so screen readers skip the key itself.
 */
function Key({ icon: Icon }: { icon: RemixiconComponentType }) {
  return (
    <kbd
      aria-hidden="true"
      className="border-ws-dynamic-secondary-default bg-ws-static-highlight-subtle shadow-ws-controls-control rounded-ws-control-md size-ws-12 text-ws-dynamic-secondary-default flex shrink-0 items-center justify-center border"
    >
      <Icon className="size-ws-8" />
    </kbd>
  );
}

/** A link inside a sentence, as Figma draws the help line's: body text in the primary colour, underlined. */
export function TextLink({
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default underline decoration-from-font',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
