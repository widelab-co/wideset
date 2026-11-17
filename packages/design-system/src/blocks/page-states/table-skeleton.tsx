// TODO(custom): table skeleton (grey bars in the table's own rows while the data loads); Wideset has no Skeleton.
import { cn, Table } from '@wideset/react';

/** A grey bar standing for a line of text. It pulses, unless the viewer asked for less motion. */
const BAR =
  'bg-ws-static-alpha-base rounded-ws-control-full h-ws-5 block motion-safe:animate-pulse';

/** The name's width, row by row: uneven, so the rows read as text and not as a grid. */
const NAMES = ['w-[72%]', 'w-[54%]', 'w-[84%]', 'w-[62%]'];

/**
 * The loading state: the module's table with bars for text, so the rows, the lines and the
 * columns are already where the data will land and nothing jumps when it does. Hidden from
 * assistive technology; the module says it is busy.
 */
export function TableSkeleton() {
  return (
    // The tables' own columns: fixed layout, the same three widths after the name.
    <Table aria-hidden="true" className="w-full table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header>
            <span className={cn(BAR, 'w-[3rem]')} />
          </Table.Header>
          <Table.Header className="w-[7rem]">
            <span className={cn(BAR, 'w-[3rem]')} />
          </Table.Header>
          <Table.Header className="w-[7.75rem]">
            <span className={cn(BAR, 'w-[4rem]')} />
          </Table.Header>
          <Table.Header className="w-[6.25rem]">
            <span className={cn(BAR, 'ml-auto w-[3rem]')} />
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {NAMES.map((width) => (
          <Table.Row key={width}>
            <Table.Cell>
              <span className={cn(BAR, width)} />
            </Table.Cell>
            <Table.Cell>
              <span className={cn(BAR, 'w-[4rem]')} />
            </Table.Cell>
            <Table.Cell>
              <span className={cn(BAR, 'w-[5.5rem]')} />
            </Table.Cell>
            <Table.Cell>
              <span className={cn(BAR, 'ml-auto w-[3.5rem]')} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
