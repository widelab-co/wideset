/**
 * Hover is the default and suits most regions: the bar appears when the pointer arrives or the
 * content moves, and fades out after. Scroll shows it only while scrolling, for quiet surfaces
 * where the cut-off content already says there is more. Auto keeps it while the content
 * overflows, and always from the start; use them where people must see at a glance that a short
 * region scrolls, such as a terms box above an Accept button. In every mode the bar floats over
 * the content and fades in and out with the motion tokens, so reduced motion turns the fade off.
 */
import { ScrollArea } from '@wideset/react';

const MEMBERS = [
  'Anna Kowalska',
  'Tomasz Nowak',
  'Priya Raman',
  'Lucas Martin',
  'Sofia Rossi',
  'Omar Haddad',
  'Mia Chen',
  'Jan Wiśniewski',
  'Elena Petrova',
  'Kenji Watanabe',
];

export default function ScrollAreaVisibility() {
  return (
    <div className="gap-ws-11 grid w-[26rem] max-w-full grid-cols-2">
      {(['hover', 'scroll', 'auto', 'always'] as const).map((visibility) => (
        <div key={visibility} className="gap-ws-4 flex min-w-0 flex-col">
          <span className="typography-label-sm text-ws-static-subtle">{visibility}</span>
          <ScrollArea
            scrollbarVisibility={visibility}
            className="rounded-ws-container-md border-ws-static-base h-[9rem] border"
          >
            <ul className="p-ws-5 flex flex-col">
              {MEMBERS.map((member) => (
                <li
                  key={member}
                  className="typography-body-md text-ws-static-base px-ws-5 py-ws-3 truncate"
                >
                  {member}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
