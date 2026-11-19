/**
 * Prose the page renders as HTML: a placeholder in angle brackets ("Remove <title>") is text, not
 * a tag; an open `<title>` would swallow the rest of the page. Code spans and fences keep theirs.
 * A code span closes only on a backtick run of its own length, as in CommonMark; an unmatched run
 * is text.
 */
export const asText = (markdown) => {
  let out = '';
  let last = 0;
  for (const span of markdown.matchAll(/(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g)) {
    out += markdown.slice(last, span.index).replace(/</g, '&lt;') + span[0];
    last = span.index + span[0].length;
  }
  return out + markdown.slice(last).replace(/</g, '&lt;');
};
