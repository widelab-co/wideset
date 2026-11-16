// TODO(custom): inline marks in a line of text (code and strong); Wideset has no rich text or Code component.
import { Fragment } from 'react';

/**
 * A line with its marks drawn: `code` in backticks takes the monospace face, as the article
 * block's inline code does (no chip behind it, so a row of steps stays quiet), and **strong** in
 * asterisks takes the strong colour and weight.
 */
export function Inline({ text }: { text: string }) {
  // A mark still open at the end (a text streaming in) already counts, so its signs never show.
  return text.split(/(`[^`]*`?|\*\*[^*]*(?:\*\*)?)/).map((part, index) =>
    part.startsWith('`') ? (
      <code key={index} className="font-ws-mono text-ws-static-strong">
        {part.replace(/^`|`$/g, '')}
      </code>
    ) : part.startsWith('**') ? (
      <strong key={index} className="font-ws-medium text-ws-static-strong">
        {part.replace(/^\*\*|\*\*$/g, '')}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
