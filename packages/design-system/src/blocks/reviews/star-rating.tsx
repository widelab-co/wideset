// TODO(custom): star rating, read-only and as an input; Wideset has no Rating component.
import { RiStarFill } from '@remixicon/react';
import { cn } from '@wideset/react';
import { useState } from 'react';

/*
  The prototype for a Wideset Rating: five Remix stars, read-only (`StarRating`) and as an input
  (`StarRatingInput`), drawn the same way so a rating looks the same where it is given and where
  it is read.

  Colour: the strong text colour, not amber and not the brand. In Wideset amber is the notice
  colour (something needs attention), so an amber five stars would warn about the best result, and
  the brand colour is kept for the primary action and the selected thing. A rating is content: it
  takes the colour of the text around it, and a low one is not painted red. An empty star is the
  same shape in the line colour, so five stars always have one outline and the weight is the
  rating.
*/

const STARS = [1, 2, 3, 4, 5] as const;
const SIZES = { sm: 'size-ws-9', md: 'size-ws-11', lg: 'size-ws-12' } as const;
type Size = keyof typeof SIZES;

/**
 * One star: empty, half or full. A half is the full star clipped to its left side over the pale
 * one: Remix's own half star keeps a dark outline round the empty side, which an empty star here
 * does not have.
 */
function Star({ fill, size }: { fill: 0 | 0.5 | 1; size: Size }) {
  return (
    <span aria-hidden="true" className={cn('relative block shrink-0', SIZES[size])}>
      <RiStarFill
        className={cn(
          'size-full',
          fill === 1 ? 'text-ws-static-strong' : 'text-(--ws-static-stroke-strong)',
        )}
      />
      {fill === 0.5 && (
        <RiStarFill className="text-ws-static-strong absolute inset-0 size-full [clip-path:inset(0_50%_0_0)]" />
      )}
    </span>
  );
}

type StarRatingProps = {
  /** The rating, 0 to 5. Stars show the nearest half; the text alternative keeps one decimal. */
  value: number;
  /** 16px in a list (default), 20px beside a figure, 24px for an input. */
  size?: Size;
  className?: string;
};

/** A rating as five stars, read-only: one image whose text alternative is "4 out of 5". */
export function StarRating({ value, size = 'sm', className }: StarRatingProps) {
  const shown = Math.round(value * 2) / 2;

  return (
    <span
      role="img"
      aria-label={`${Number(value.toFixed(1))} out of 5`}
      className={cn('gap-ws-1 inline-flex', className)}
    >
      {STARS.map((star) => (
        <Star key={star} size={size} fill={shown >= star ? 1 : shown >= star - 0.5 ? 0.5 : 0} />
      ))}
    </span>
  );
}

type StarRatingInputProps = {
  /** The group's name for the form and for screen readers' grouping. */
  name: string;
  /** What is being rated: the group's accessible name. */
  label: string;
  /** The chosen rating, or 0 for none yet. */
  value: number;
  onValueChange: (value: number) => void;
  size?: Size;
  className?: string;
};

/**
 * A rating to give: five native radios, so arrow keys move the choice and a screen reader reads
 * "4 out of 5, radio, 4 of 5". The stars fill up to the one under the pointer, then settle on the
 * one chosen.
 */
export function StarRatingInput({
  name,
  label,
  value,
  onValueChange,
  size = 'lg',
  className,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex', className)}
      onPointerLeave={() => setHovered(0)}
    >
      {STARS.map((star) => (
        <label
          key={star}
          className="p-ws-1 rounded-ws-control-sm has-focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer"
          onPointerEnter={() => setHovered(star)}
        >
          <input
            type="radio"
            name={name}
            value={star}
            checked={value === star}
            onChange={() => onValueChange(star)}
            aria-label={`${star} out of 5`}
            className="sr-only"
          />
          <Star size={size} fill={star <= shown ? 1 : 0} />
        </label>
      ))}
    </div>
  );
}
