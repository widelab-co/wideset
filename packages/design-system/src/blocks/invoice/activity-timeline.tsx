// TODO(custom): activity timeline; no Timeline in Wideset.
import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiEyeLine,
  RiFileTextLine,
  RiMailSendLine,
} from '@remixicon/react';

import type { InvoiceEvent, InvoiceEventKind } from './data';
import { formatDateTime } from './format';

const ICON: Record<InvoiceEventKind, RemixiconComponentType> = {
  created: RiFileTextLine,
  paid: RiBankCardLine,
  sent: RiMailSendLine,
  viewed: RiEyeLine,
};

/** What happened to the invoice, newest first, on one line of marks: the event, then when. */
export function ActivityTimeline({ items }: { items: InvoiceEvent[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const Icon = ICON[item.kind];
        const last = index === items.length - 1;
        return (
          <li key={item.id} className="gap-ws-7 relative flex">
            {last ? null : (
              <span
                aria-hidden="true"
                className="border-ws-static-base top-ws-15 bottom-ws-3 left-ws-9 absolute border-l"
              />
            )}
            <span
              aria-hidden="true"
              className="size-ws-14 rounded-ws-control-full border-ws-static-base bg-ws-static-foreground text-ws-static-subtle flex shrink-0 items-center justify-center border"
            >
              <Icon className="size-ws-8" />
            </span>
            <div className={last ? 'pt-ws-2 min-w-0 flex-1' : 'pt-ws-2 pb-ws-11 min-w-0 flex-1'}>
              <p className="typography-body-md text-ws-static-base">{item.label}</p>
              <time
                dateTime={item.at}
                className="typography-caption-md text-ws-static-subtle tabular-nums"
              >
                {formatDateTime(item.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
