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
};

/**
 * Copy, answered by the button itself: the icon grows into a check and the name reads "Copied"
 * for a moment, then both go back. No toast: the result shows where the hand already is.
 */
export function CopyButton({ text, label = 'Copy', size = 'xs', quiet = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), SHOWN);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <IconAction
      label={copied ? 'Copied' : label}
      icon={copied ? RiCheckLine : RiFileCopyLine}
      iconClassName={cn(quiet && 'text-ws-static-subtle', copied && SWAP)}
      size={size}
      onClick={() => {
        // Where the clipboard is out of reach (an insecure page, a test) the button still answers.
        navigator.clipboard?.writeText(text()).catch(() => undefined);
        setCopied(true);
      }}
    />
  );
}
