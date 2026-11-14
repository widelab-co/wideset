// TODO(custom): six-digit code entry (one box per digit, auto-advance, paste); Wideset has no code (OTP) input.
import { TextInput } from '@wideset/react';
import { type ClipboardEvent, type KeyboardEvent, useRef, useState } from 'react';

type CodeInputProps = {
  /** The first box's id, for the label's `htmlFor`. */
  id: string;
  /** The id of the visible label, which names the whole group. */
  labelId: string;
  /** Submitted with the form: the digits joined. */
  name: string;
  length?: number;
  invalid?: boolean;
  /** Focus the first box on mount. */
  autoFocus?: boolean;
  /** Any change to the digits, so the form can clear its error. */
  onChange?: (code: string) => void;
  /** Wired by `FormField` to its helper or error text; every box carries it. */
  'aria-describedby'?: string;
};

/**
 * A one-time code as one box per digit, each a `TextInput`. Typing a digit moves to the next box,
 * Backspace on an empty box goes back, the arrows move between boxes, and a pasted or autofilled
 * code (`one-time-code`) fills the boxes from the one it lands in. Anything but digits is ignored.
 * The boxes split in two groups of three, the way authenticator apps show the code.
 */
export function CodeInput({
  id,
  labelId,
  name,
  length = 6,
  invalid = false,
  autoFocus = false,
  onChange,
  'aria-describedby': describedBy,
}: CodeInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (index: number) => boxes.current[Math.max(0, Math.min(index, length - 1))]?.focus();

  const update = (next: string[]) => {
    setDigits(next);
    onChange?.(next.join(''));
  };

  /** Writes digits into the boxes from `index` on, then focuses the box after the last one. */
  const fill = (index: number, text: string) => {
    const incoming = text
      .replace(/\D/g, '')
      .slice(0, length - index)
      .split('');
    if (!incoming.length) return;
    const next = [...digits];
    incoming.forEach((digit, offset) => (next[index + offset] = digit));
    update(next);
    focus(index + incoming.length);
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      update(digits.map((digit, at) => (at === index - 1 ? '' : digit)));
      focus(index - 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focus(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focus(index + 1);
    }
  };

  const onPaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fill(index, event.clipboardData.getData('text'));
  };

  const box = (index: number) => (
    <TextInput
      key={index}
      ref={(element) => {
        boxes.current[index] = element;
      }}
      id={index === 0 ? id : undefined}
      size="lg"
      variant={invalid ? 'danger' : 'primary'}
      className="w-ws-18 min-w-0"
      value={digits[index]}
      onChange={(event) => {
        // The box already holds a digit: keep what was typed beside it.
        const typed = event.target.value.replace(digits[index], '');
        if (!event.target.value) update(digits.map((digit, at) => (at === index ? '' : digit)));
        else fill(index, typed || event.target.value);
      }}
      onKeyDown={onKeyDown(index)}
      onPaste={onPaste(index)}
      onFocus={(event) => event.target.select()}
      inputMode="numeric"
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      // eslint-disable-next-line jsx-a11y/no-autofocus -- passed on from the form, which owns the decision
      autoFocus={autoFocus && index === 0}
      aria-label={`Digit ${index + 1} of ${length}`}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
    >
      <TextInput.Input className="text-center" />
    </TextInput>
  );

  const indices = digits.map((_, index) => index);
  const half = Math.ceil(length / 2);
  return (
    <div role="group" aria-labelledby={labelId} className="gap-ws-11 flex">
      <div className="gap-ws-5 flex min-w-0">{indices.slice(0, half).map(box)}</div>
      <div className="gap-ws-5 flex min-w-0">{indices.slice(half).map(box)}</div>
      <input type="hidden" name={name} value={digits.join('')} />
    </div>
  );
}
