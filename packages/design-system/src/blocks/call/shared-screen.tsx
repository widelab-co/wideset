// TODO(custom): a shared screen on the call stage, drawn as the document being shown; Wideset has no screen-share or document preview.
import { RiComputerLine } from '@remixicon/react';

import { sharedQuote } from './data';

/**
 * What Maya shares: the revised quote, drawn as a page on the stage rather than a picture of it,
 * so it reads in both themes and ships no image. A line above it says whose screen it is.
 */
export function SharedScreen() {
  const { owner, title, subtitle, terms, footnote } = sharedQuote;
  return (
    <figure
      aria-label={`${owner}’s screen`}
      className="bg-ws-static-foreground rounded-ws-container-md gap-ws-7 p-ws-9 flex min-h-0 flex-col"
    >
      <figcaption className="typography-label-sm text-ws-static-subtle gap-ws-3 flex items-center">
        <RiComputerLine aria-hidden className="size-ws-8" />
        You are sharing your screen
      </figcaption>
      <div className="bg-ws-static-container rounded-ws-container-sm gap-ws-12 p-ws-14 mx-auto flex min-h-0 w-full max-w-[40rem] flex-1 flex-col overflow-hidden">
        <div className="gap-ws-2 flex flex-col">
          <p className="typography-subtitle-xs text-ws-static-strong">{title}</p>
          <p className="typography-body-md text-ws-static-subtle">{subtitle}</p>
        </div>
        <dl className="flex flex-col">
          {terms.map(({ label, value }) => (
            <div
              key={label}
              className="gap-ws-9 border-ws-static-base py-ws-5 grid grid-cols-[9rem_minmax(0,1fr)] border-b"
            >
              <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
              <dd className="typography-body-md text-ws-static-base">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="typography-caption-md text-ws-static-subtle mt-auto">{footnote}</p>
      </div>
    </figure>
  );
}
