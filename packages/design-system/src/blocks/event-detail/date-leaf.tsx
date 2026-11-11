// TODO(custom): a calendar leaf (month over day number) beside an event's name; Wideset has no date badge.
import { formatLeaf } from './format';

/**
 * The event's day as a calendar leaf, drawn with a line like every block on the page: after the
 * name, the date is what a guest needs, so it gets the header's one figure at title size. The
 * facts row reads the full date out, so the leaf is hidden from assistive tech.
 */
export function DateLeaf({ at }: { at: string }) {
  const { month, day } = formatLeaf(at);

  return (
    <div
      aria-hidden="true"
      className="border-ws-static-base rounded-ws-container-md py-ws-4 flex w-[3.5rem] shrink-0 flex-col items-center border"
    >
      <span className="typography-caption-strong-md text-ws-static-subtle">{month}</span>
      <span className="typography-subtitle-md text-ws-static-strong tabular-nums">{day}</span>
    </div>
  );
}
