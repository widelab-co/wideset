/**
 * `contained` draws the count in an outlined pill, so it holds its place where no text label
 * comes before it: beside an icon, or on its own at the end of a row. Beside a text label leave
 * it off: the plain grey number reads with the label, as in `Tabs.Count`. Beside an icon only,
 * give screen readers the noun in visually hidden text.
 */
import { RiAttachment2, RiChat3Line } from '@remixicon/react';
import { Count } from '@wideset/react';

export default function CountContained() {
  return (
    <div className="gap-ws-8 flex w-[24rem] max-w-full items-center justify-between">
      <span className="typography-label-strong-md text-ws-static-strong">Homepage redesign</span>
      <div className="gap-ws-6 text-ws-static-subtle flex items-center">
        <span className="gap-ws-3 flex items-center">
          <RiChat3Line aria-hidden className="size-ws-9" />
          <Count contained>12</Count>
          <span className="sr-only">comments</span>
        </span>
        <span className="gap-ws-3 flex items-center">
          <RiAttachment2 aria-hidden className="size-ws-9" />
          <Count contained>3</Count>
          <span className="sr-only">attachments</span>
        </span>
      </div>
    </div>
  );
}
