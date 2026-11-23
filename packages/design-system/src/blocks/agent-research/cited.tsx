// TODO(custom): a line of the report with its citations drawn as marks; the kit's Inline knows code and strong only, and Wideset has no rich text.
import { Citation, type Citing } from './citation';
import { Inline } from './inline';

/**
 * A line in which `[3]` is a citation of source 3. The marks sit right after the words they
 * back, with no space before them; everything else is drawn as any other line of an answer. A
 * mark is one word, so a line that is still streaming in never shows half of one.
 */
export function Cited({ text, citing }: { text: string; citing: Citing }) {
  return text.split(/\s*(\[\d+\])/).map((part, index) => {
    const source = Number(/^\[(\d+)\]$/.exec(part)?.[1]);
    return source ? (
      <Citation key={index} source={source} active={citing.active === source} citing={citing} />
    ) : (
      <Inline key={index} text={part} />
    );
  });
}
