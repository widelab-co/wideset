/**
 * Without a gutter the thumb floats over the content's edge, which padded content absorbs. When
 * the content runs to the edge and its end matters, here right-aligned amounts, `scrollbarGutter`
 * reserves the bar's width so the thumb never covers a digit. The gutter is there whether or not
 * the content overflows, so the column does not shift when a filter makes the list longer.
 */
import { ScrollArea } from '@wideset/react';

const INVOICES = [
  ['Acme Corp', '1,200.00'],
  ['Globex', '860.50'],
  ['Initech', '12,410.00'],
  ['Umbrella', '3,075.25'],
  ['Hooli', '940.00'],
  ['Stark Industries', '18,600.00'],
  ['Wayne Enterprises', '7,215.80'],
  ['Wonka Industries', '455.10'],
];

export default function ScrollAreaGutter() {
  return (
    <div className="gap-ws-11 grid w-[26rem] max-w-full grid-cols-2">
      {[false, true].map((gutter) => (
        <div key={String(gutter)} className="gap-ws-4 flex min-w-0 flex-col">
          <span className="typography-label-sm text-ws-static-subtle">
            {gutter ? 'scrollbarGutter' : 'No gutter'}
          </span>
          <ScrollArea
            scrollbarVisibility="always"
            scrollbarGutter={gutter}
            className="rounded-ws-container-md border-ws-static-base h-[9rem] border"
          >
            <ul className="flex flex-col">
              {INVOICES.map(([customer, amount]) => (
                <li
                  key={customer}
                  className="gap-ws-5 py-ws-3 ps-ws-7 pe-ws-3 typography-body-md flex justify-between"
                >
                  <span className="text-ws-static-base truncate">{customer}</span>
                  <span className="text-ws-static-strong tabular-nums">{amount}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
