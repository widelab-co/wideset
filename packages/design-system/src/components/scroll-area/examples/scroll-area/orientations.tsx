/**
 * Vertical is the default: the content keeps the area's width, so long lines wrap or cut with
 * `truncate`. Horizontal is for a row wider than its container, such as cards or a timeline; the
 * bar runs along the bottom. Both is for content that overflows either way, such as a wide table
 * in a fixed height, where `stickyHeader` and `stickyColumn` keep its edges in view. Scroll a
 * region only when it must keep its size; otherwise let the page scroll.
 */
import { ScrollArea, Table } from '@wideset/react';

const FILES = [
  'Q3 board deck — final version for review.pdf',
  'Brand guidelines 2025.fig',
  'Customer interviews, September.docx',
  'Pricing experiment results.xlsx',
  'Onboarding flow — copy review with legal.docx',
  'Roadmap 2025.pdf',
  'Support macros.csv',
  'Security questionnaire, Acme Corp.pdf',
];

const PROJECTS = [
  ['Website redesign', 'In review'],
  ['Mobile app 2.0', 'In progress'],
  ['Pricing page', 'Planned'],
  ['Help centre', 'In progress'],
  ['Partner portal', 'Planned'],
  ['Billing migration', 'Blocked'],
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const REGIONS = [
  ['Poland', 412],
  ['Germany', 388],
  ['France', 301],
  ['Spain', 254],
  ['Italy', 236],
  ['Netherlands', 198],
  ['Sweden', 151],
] as const;

export default function ScrollAreaOrientations() {
  return (
    <div className="gap-ws-12 flex w-[26rem] max-w-full flex-col">
      <ScrollArea className="rounded-ws-container-md border-ws-static-base h-[10rem] border">
        <ul className="p-ws-5 flex flex-col">
          {FILES.map((file) => (
            <li
              key={file}
              className="typography-body-md text-ws-static-base px-ws-5 py-ws-4 truncate"
            >
              {file}
            </li>
          ))}
        </ul>
      </ScrollArea>

      <ScrollArea
        orientation="horizontal"
        className="rounded-ws-container-md border-ws-static-base border"
      >
        <ul className="gap-ws-7 p-ws-7 flex">
          {PROJECTS.map(([name, status]) => (
            <li
              key={name}
              className="rounded-ws-container-sm bg-ws-static-alpha-subtle gap-ws-2 p-ws-7 flex w-[10rem] shrink-0 flex-col"
            >
              <span className="typography-label-md text-ws-static-strong truncate">{name}</span>
              <span className="typography-body-sm text-ws-static-subtle">{status}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <ScrollArea
        orientation="both"
        className="rounded-ws-container-md border-ws-static-base h-[14rem] border"
      >
        <Table stickyHeader stickyColumn className="w-[44rem]">
          <Table.Head>
            <Table.Row>
              <Table.Header>Region</Table.Header>
              {MONTHS.map((month) => (
                <Table.Header key={month} align="right">
                  {month}
                </Table.Header>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {REGIONS.map(([region, base]) => (
              <Table.Row key={region}>
                <Table.Cell>{region}</Table.Cell>
                {MONTHS.map((month, index) => (
                  <Table.Cell key={month} align="right" className="tabular-nums">
                    {base + index * 17}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ScrollArea>
    </div>
  );
}
