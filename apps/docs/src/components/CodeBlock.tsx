import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { IconButton } from '@wideset/react';
import { useState } from 'react';

import type { CodeLang } from '../lib/highlight';
import { useHighlightedCode } from './useHighlightedCode';

/**
 * A code block with syntax colour and a copy button. Renders the plain text first and
 * swaps in the highlighted markup once shiki has loaded, so the code is readable at once.
 * The colours are shiki's github-light / github-dark, picked by `.dark` in docs.css.
 */
export const CodeBlock = ({
  code,
  lang = 'tsx',
  prompt = false,
  toolbar,
  className = '',
}: {
  code: string;
  lang?: CodeLang;
  /** A shell line: one line, the copy button centred on it. */
  prompt?: boolean;
  /** Controls drawn next to the copy button, in the block's top-right corner. */
  toolbar?: React.ReactNode;
  /** Extra classes on the block, e.g. `flex-1` to fill a taller panel. */
  className?: string;
}) => {
  const html = useHighlightedCode(code, lang);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const copyButton = (
    <IconButton
      icon={copied ? RiCheckLine : RiFileCopyLine}
      size="sm"
      preset="ghost"
      variant="secondary"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={copy}
    />
  );

  return (
    <div
      className={`docs-code docs-pane relative overflow-hidden rounded-ws-container-lg border border-ws-static-base ${className} ${
        prompt ? 'docs-code--prompt' : ''
      }`}
    >
      {/* With a toolbar the controls get their own row, so they never sit on the code. */}
      {toolbar && (
        <div className="flex items-center justify-between gap-ws-3 border-b border-ws-static-base py-ws-3 pr-ws-5 pl-ws-9">
          {toolbar}
          {copyButton}
        </div>
      )}
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="docs-code-fallback">{code.trimEnd()}</pre>
      )}
      {!toolbar && (
        <div className={`absolute right-ws-5 ${prompt ? 'top-1/2 -translate-y-1/2' : 'top-ws-5'}`}>
          {copyButton}
        </div>
      )}
    </div>
  );
};
