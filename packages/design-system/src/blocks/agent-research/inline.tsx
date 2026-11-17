// TODO(custom): inline marks in a line of text (code and strong); Wideset has no rich text or Code component.
import { cn } from '@wideset/react';
import { Fragment } from 'react';

type InlineProps = {
  text: string;
  /**
   * Names in a label rather than in prose (a task's title, a subtitle under it): code keeps the
   * colour of its line and stays in one piece when the line wraps, so a file is never broken at
   * its hyphen.
   */
  plain?: boolean;
};

/**
 * A line with its marks drawn: `code` in backticks takes the monospace face, as the article
 * block's inline code does (no chip behind it, so a row of steps stays quiet), and **strong** in
 * asterisks takes the strong colour and weight.
 */
export function Inline({ text, plain = false }: InlineProps) {
  // A mark still open at the end (a text streaming in) already counts, so its signs never show.
  return text.split(/(`[^`]*`?|\*\*[^*]*(?:\*\*)?)/).map((part, index) =>
    part.startsWith('`') ? (
      <code
        key={index}
        className={cn(
          'font-ws-mono',
          plain ? 'tracking-ws-normal whitespace-nowrap' : 'text-ws-static-strong',
        )}
      >
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
