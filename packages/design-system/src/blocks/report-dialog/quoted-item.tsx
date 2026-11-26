// TODO(custom): quoted comment (a line down the side, the author and when, the first lines); Wideset has no quote component.
import type { Reportable } from './data';
import { formatDateTime, formatWhen } from './format';

/**
 * What is being reported, quoted small at the top of the dialog so there is no doubt which one:
 * a line down the side, who wrote it and when, and its first three lines, quieter than the
 * dialog's own words.
 */
export function QuotedItem({ item }: { item: Reportable }) {
  return (
    <blockquote className="border-ws-static-base pl-ws-7 gap-ws-1 flex flex-col border-l-2">
      <p className="typography-caption-md text-ws-static-subtle">
        <cite className="typography-caption-strong-md text-ws-static-base not-italic">
          {item.author.name}
        </cite>
        {' · '}
        <time dateTime={item.at} title={formatDateTime(item.at)}>
          {formatWhen(item.at)}
        </time>
      </p>
      <p className="typography-body-sm text-ws-static-subtle line-clamp-3">{item.text}</p>
    </blockquote>
  );
}
