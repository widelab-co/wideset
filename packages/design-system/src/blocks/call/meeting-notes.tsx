// TODO(custom): meeting notes as a list of bullet lines; Wideset has no notes or list editor.
import { type KeyboardEvent, useEffect, useRef } from 'react';

type MeetingNotesProps = {
  /** One point a line; the last line is where the next point goes. */
  lines: string[];
  onLinesChange: (lines: string[]) => void;
};

/**
 * Notes taken during the call, one point a line, the way they are written in a meeting: Enter
 * starts the next point under the cursor's line, Backspace on an empty line joins the one above.
 * The lines are borderless text that wraps, so the list reads as notes and not as a form.
 */
export function MeetingNotes({ lines, onLinesChange }: MeetingNotesProps) {
  const fields = useRef<(HTMLTextAreaElement | null)[]>([]);
  // The line to put the cursor in once the list has redrawn.
  const focusNext = useRef<number | null>(null);

  useEffect(() => {
    const index = focusNext.current;
    if (index === null) return;
    const field = fields.current[index];
    field?.focus();
    field?.setSelectionRange(field.value.length, field.value.length);
    focusNext.current = null;
  }, [lines]);

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      focusNext.current = index + 1;
      onLinesChange([...lines.slice(0, index + 1), '', ...lines.slice(index + 1)]);
    } else if (event.key === 'Backspace' && lines[index] === '' && lines.length > 1) {
      event.preventDefault();
      focusNext.current = Math.max(0, index - 1);
      onLinesChange(lines.filter((_, at) => at !== index));
    }
  };

  return (
    <ul aria-label="Notes" className="gap-ws-3 flex flex-col">
      {lines.map((line, index) => (
        // A line has no identity beyond its place in the list.
        <li key={index} className="gap-ws-5 flex items-start">
          <span aria-hidden="true" className="typography-body-md text-ws-static-subtle">
            •
          </span>
          <textarea
            ref={(field) => {
              fields.current[index] = field;
            }}
            rows={1}
            value={line}
            aria-label={`Note ${index + 1}`}
            placeholder={index === lines.length - 1 ? 'Add a note' : undefined}
            onChange={(event) =>
              onLinesChange(lines.map((text, at) => (at === index ? event.target.value : text)))
            }
            onKeyDown={onKeyDown(index)}
            className="typography-body-md text-ws-static-base placeholder:text-ws-static-subtle block field-sizing-content w-full resize-none bg-transparent outline-hidden"
          />
        </li>
      ))}
    </ul>
  );
}
