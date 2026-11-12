// TODO(custom): prose the agent writes (title, headings, paragraphs, lists, code) at a reading rhythm; Wideset has the type styles but no prose or rich text component.
import { cn } from '@wideset/react';

import { CodeBlock } from './code-block';
import { Inline } from './inline';
import type { Prose as ProseBlock } from './model';

/** An answer in the transcript reads at 14px; a document in a pane at 16px, with more air. */
const SIZE = {
  md: { root: 'gap-ws-5', text: 'typography-body-md', heading: 'typography-label-strong-sm' },
  lg: { root: 'gap-ws-9', text: 'typography-body-lg', heading: 'typography-subtitle-xs mt-ws-7' },
};

/**
 * Written text as its blocks, in order. A partly streamed text is the same blocks cut short, so
 * it grows in place: a paragraph by its words, a list by its items, code by its lines.
 */
export function Prose({ blocks, size = 'md' }: { blocks: ProseBlock[]; size?: 'md' | 'lg' }) {
  const { root, text, heading } = SIZE[size];
  return (
    <div className={cn('text-ws-static-base flex flex-col', root)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'title':
            return (
              <h1 key={index} className="typography-subtitle-md text-ws-static-strong">
                {block.text}
              </h1>
            );
          case 'heading':
            return (
              <h2 key={index} className={cn(heading, 'text-ws-static-strong')}>
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={index} className={text}>
                <Inline text={block.text} />
              </p>
            );
          case 'list':
            return (
              <ul
                key={index}
                className={cn(
                  text,
                  'marker:text-ws-static-subtle gap-ws-3 pl-ws-11 flex list-disc flex-col',
                )}
              >
                {block.items.map((item, at) => (
                  <li key={at}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return <CodeBlock key={index} language={block.language} lines={block.lines} />;
        }
      })}
    </div>
  );
}
