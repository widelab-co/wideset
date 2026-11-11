import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { Button, FormField } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { FieldWithAction } from './field-with-action';

/** How long the button says the link was copied. */
const COPIED_FOR = 2000;

/**
 * The referral link, read-only, beside the page's one filled button: copying it is the quickest
 * way to share. The button answers in place, saying "Copied" for a moment, so nothing else on the
 * page moves; a status line says the same to a screen reader. While a dialog holds the filled
 * button, Copy steps back to a bordered one (`quiet`), so the screen keeps one.
 */
export function ShareLink({
  link,
  quiet,
  className,
}: {
  link: string;
  quiet?: boolean;
  className?: string;
}) {
  const id = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_FOR);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    // The clipboard is missing on an insecure origin: the link can still be selected by hand.
    void navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
  };

  return (
    <FormField
      className={className}
      label="Your referral link"
      htmlFor={id}
      helperText="A team that signs up through it counts as yours."
    >
      <FieldWithAction
        id={id}
        readOnly
        value={link}
        onFocus={(event) => event.target.select()}
        action={
          <>
            {/* The width holds both labels, so the field beside the button does not jump. */}
            <Button
              size="sm"
              variant={quiet ? 'secondary' : 'primary'}
              preset={quiet ? 'border' : 'filled'}
              className="w-[5.75rem] shrink-0"
              onClick={copy}
            >
              <Button.Icon icon={copied ? RiCheckLine : RiFileCopyLine} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <span role="status" className="sr-only">
              {copied && 'Link copied'}
            </span>
          </>
        }
      />
    </FormField>
  );
}
