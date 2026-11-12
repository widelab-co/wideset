// TODO(custom): a line of text with the names in it set as code; Wideset has no inline Code.

/**
 * Text in which whatever stands between backticks is a name to read exactly (a file, a command,
 * a function): set in the monospace face, in the colour and size of the line it is in. A name
 * stays in one piece when its line wraps, so a file is never broken at its hyphen.
 */
export function InlineCode({ text }: { text: string }) {
  return text.split('`').map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-ws-mono tracking-ws-normal whitespace-nowrap">
        {part}
      </code>
    ) : (
      part
    ),
  );
}
