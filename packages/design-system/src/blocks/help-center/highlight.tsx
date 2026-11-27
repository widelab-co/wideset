// TODO(custom): the matched part of a result, marked; Wideset has no text highlight and no token for Figma's gold fill.

/**
 * The first place `query` occurs in `text`, marked as Figma marks a search match: a fill the
 * height of the line (hence `inline-block`). Figma's fill (Non-semantic/Fill/Gold/Subtle) has no
 * token in code: yellow subtle stands in.
 */
export function Highlight({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (start < 0) return <>{text}</>;
  const end = start + query.length;

  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-ws-non-semantic-yellow-subtle inline-block text-inherit">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}
