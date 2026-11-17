// TODO(custom): the research report in the transcript (prose with citation marks, the comparison as a table); the kit's Prose has no table and no citation, and Wideset has no rich text component.
import type { Citing } from './citation';
import { Cited } from './cited';
import { ComparisonTable } from './comparison-table';
import type { Prose } from './model';
import { COMPARISON, comparison, FINDINGS } from './research-data';

type ReportProps = {
  /** The report's text as far as it is written (see `reportProse`). */
  prose: Prose[];
  /** It is still streaming in. */
  live: boolean;
  citing: Citing;
};

/**
 * The answer to the question, written where an answer goes: in the transcript, at its reading
 * size, with no box of its own. It is the report's prose drawn block by block, as the kit draws
 * an answer, with three differences: `[3]` is a citation mark, the list of vendors is the
 * comparison table (as many rows as the text has reached), and the findings are numbered, since
 * the sources say "finding 2". Cut short, it is the same blocks cut short, so it grows in place.
 */
export function Report({ prose, live, citing }: ReportProps) {
  return (
    <div className="gap-ws-5 text-ws-static-base typography-body-md flex flex-col">
      {prose.map((block, at) => {
        if (block.kind === 'paragraph') {
          return (
            <p key={at}>
              <Cited text={block.text} citing={citing} />
            </p>
          );
        }
        if (block.kind === 'heading') {
          return (
            <h2 key={at} className="typography-label-strong-sm text-ws-static-strong mt-ws-5">
              {block.text}
            </h2>
          );
        }
        if (block.kind !== 'list') return null;
        if (at === COMPARISON) {
          return (
            <ComparisonTable
              key={at}
              rows={comparison.slice(0, block.items.length)}
              live={live}
              citing={citing}
            />
          );
        }
        const List = at === FINDINGS ? 'ol' : 'ul';
        return (
          <List
            key={at}
            className={
              at === FINDINGS
                ? 'marker:text-ws-static-subtle gap-ws-3 pl-ws-11 flex list-decimal flex-col marker:tabular-nums'
                : 'marker:text-ws-static-subtle gap-ws-3 pl-ws-11 flex list-disc flex-col'
            }
          >
            {block.items.map((item, index) => (
              <li key={index}>
                <Cited text={item} citing={citing} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
