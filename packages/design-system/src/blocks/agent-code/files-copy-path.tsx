// TODO(custom): a copy button that answers in place (its icon turns into a check for a moment); Wideset has no copy button.
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { IconButton, Tooltip } from '@wideset/react';
import { useEffect, useState } from 'react';

/** How long the check stays before the button offers to copy again. */
const SHOWN_FOR = 1600;

/**
 * Copies the open file's path. The button itself says it worked: its icon turns into a check and
 * its tooltip into "Copied" for a moment, with the same said aloud, so no toast is needed for
 * something this small. The check fades in on the motion tokens, which stand still under reduced
 * motion.
 */
export function FilesCopyPath({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), SHOWN_FOR);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <Tooltip size="sm">
        <Tooltip.Trigger asChild>
          <IconButton
            icon={copied ? RiCheckLine : RiFileCopyLine}
            iconClassName={
              copied
                ? 'animate-in fade-in-0 duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-in-out)'
                : undefined
            }
            variant="secondary"
            preset="ghost"
            size="xs"
            aria-label="Copy path"
            onClick={() => {
              void navigator.clipboard?.writeText(path).catch(() => {});
              setCopied(true);
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <Tooltip.Label>{copied ? 'Copied' : 'Copy path'}</Tooltip.Label>
        </Tooltip.Content>
      </Tooltip>
      <span role="status" className="sr-only">
        {copied ? 'Path copied' : ''}
      </span>
    </>
  );
}
