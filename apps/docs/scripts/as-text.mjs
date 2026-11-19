/**
 * Prose the page renders as HTML: a placeholder in angle brackets ("Remove <title>") is text, not
 * a tag; an open `<title>` would swallow the rest of the page. Fenced code blocks and code spans
 * keep theirs. As in CommonMark, a fence (``` or ~~~) closes on a run of its own character at
 * least as long, a code span closes on a backtick run of its own length within its paragraph, and
 * an unmatched run is text.
 */
const inline = (paragraph) => {
  let out = '';
  let last = 0;
  for (const span of paragraph.matchAll(/(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g)) {
    out += paragraph.slice(last, span.index).replace(/</g, '&lt;') + span[0];
    last = span.index + span[0].length;
  }
  return out + paragraph.slice(last).replace(/</g, '&lt;');
};

/** Prose between fences, a paragraph at a time: a code span never crosses a blank line. */
const prose = (lines) =>
  lines
    .join('\n')
    .split(/(\n[ \t]*\n)/)
    .map(inline)
    .join('');

export const asText = (markdown) => {
  const lines = markdown.split('\n');
  const out = [];
  let text = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^ {0,3}(`{3,}|~{3,})/);
    if (!open || (open[1][0] === '`' && lines[i].slice(open[0].length).includes('`'))) {
      text.push(lines[i]);
      continue;
    }
    const fence = open[1];
    const close = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}[ \\t]*$`);
    let end = i + 1;
    while (end < lines.length && !close.test(lines[end])) end++;
    if (text.length) out.push(prose(text));
    text = [];
    out.push(lines.slice(i, end + 1).join('\n'));
    i = end;
  }
  if (text.length) out.push(prose(text));
  return out.join('\n');
};
