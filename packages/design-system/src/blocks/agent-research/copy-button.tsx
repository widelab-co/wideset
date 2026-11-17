// TODO(custom): a copy action that confirms in place (its icon turns into a check for a moment); Wideset has no copy button.
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { cn, type IconButtonProps } from '@wideset/react';
import { useEffect, useState } from 'react';

import { IconAction } from './icon-action';
import { SWAP } from './motion';

/** How long the check stays before the copy icon comes back, in milliseconds. */
const SHOWN = 1600;

type CopyButtonProps = {
  /** What goes to the clipboard, worked out only when asked for. */
  text: () => string;
  label?: string;
  size?: IconButtonProps['size'];
  /** Under an answer or in a code block: the icon in the subtle colour. */
  quiet?: boolean;
  /** Where the tooltip opens: under the button in a pane's bar. */
  side?: 'top' | 'bottom';
};

/**
 * Copy, answered by the button itself: the icon grows into a check and the name reads "Copied"
 * for a moment, then both go back, with the same said aloud. No toast: the result shows where
 * the hand already is.
 */
export function CopyButton({
  text,
  label = 'Copy',
  size = 'xs',
  quiet = false,
  side = 'top',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), SHOWN);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <>
      <IconAction
        label={copied ? 'Copied' : label}
        icon={copied ? RiCheckLine : RiFileCopyLine}
        iconClassName={cn(quiet && 'text-ws-static-subtle', copied && SWAP)}
        size={size}
        side={side}
        onClick={() => {
          // "Copied" only once the text is there: an insecure page, a denied permission or a test
          // has no clipboard to write to, and the button then stays as it was.
          navigator.clipboard?.writeText(text()).then(
            () => setCopied(true),
            () => undefined,
          );
        }}
      />
      <span role="status" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </>
  );
}
