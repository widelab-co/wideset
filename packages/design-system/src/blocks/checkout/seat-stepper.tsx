// TODO(custom): quantity stepper (minus, a number field, plus); Wideset has no NumberInput, so it is a TextInput with an icon button in each boxed affix.
import { RiAddLine, RiSubtractLine } from '@remixicon/react';
import { TextInput } from '@wideset/react';
import { useState } from 'react';

type SeatStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

/**
 * How many seats to buy. A native number field does the work (the arrow keys step it, a screen
 * reader hears a spin button with its limits) and the two buttons step it by one. A number typed
 * outside the limits is held back until the field is left, then pulled to the nearest limit.
 */
export function SeatStepper({ value, min, max, onChange }: SeatStepperProps) {
  // What is being typed, while it differs from the value: "4" on the way to "45".
  const [draft, setDraft] = useState<string | null>(null);

  const type = (text: string) => {
    setDraft(text);
    const seats = Number(text);
    if (text !== '' && Number.isInteger(seats) && seats >= min && seats <= max) onChange(seats);
  };

  const settle = () => {
    if (draft === null) return;
    const seats = draft === '' ? value : Math.round(Number(draft));
    onChange(Math.min(max, Math.max(min, seats)));
    setDraft(null);
  };

  const step = (by: number) => {
    setDraft(null);
    onChange(Math.min(max, Math.max(min, value + by)));
  };

  return (
    <TextInput
      size="sm"
      type="number"
      min={min}
      max={max}
      step={1}
      inputMode="numeric"
      aria-label="Seats"
      value={draft ?? String(value)}
      onChange={(event) => type(event.target.value)}
      onBlur={settle}
      className="w-[7.5rem] shrink-0"
    >
      <TextInput.Prefix>
        <TextInput.IconButton
          icon={RiSubtractLine}
          aria-label="Remove a seat"
          disabled={value <= min}
          onClick={() => step(-1)}
        />
      </TextInput.Prefix>
      {/* The browser's own spin arrows are hidden: the two buttons stand in for them. */}
      <TextInput.Input className="[appearance:textfield] text-center tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <TextInput.Suffix>
        <TextInput.IconButton
          icon={RiAddLine}
          aria-label="Add a seat"
          disabled={value >= max}
          onClick={() => step(1)}
        />
      </TextInput.Suffix>
    </TextInput>
  );
}
