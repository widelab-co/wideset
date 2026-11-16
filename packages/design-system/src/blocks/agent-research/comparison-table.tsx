import { cn, Table } from '@wideset/react';

import { Citation, type Citing } from './citation';
import { ARRIVE } from './motion';
import type { ComparisonRow } from './research-data';
import { formatPrice } from './research-format';

type ComparisonTableProps = {
  /** The vendors written so far: a row is drawn whole once the report reaches it. */
  rows: ComparisonRow[];
  /** The report is streaming in: a row arrives with the transcript's short rise. */
  live: boolean;
  citing: Citing;
};

/**
 * The vendors side by side, in the report: how each charges, what comes with the hardware, how
 * long the contract runs and, last and right-aligned so the figures line up, what one room costs
 * in the first year. The sources a row rests on get a column of their own, so the citation marks
 * never push a figure out of line. The table sits in the same outlined box as code in an answer,
 * its row lines running edge to edge.
 */
export function ComparisonTable({ rows, live, citing }: ComparisonTableProps) {
  return (
    <div className="border-ws-static-base rounded-ws-container-md overflow-x-auto border">
      <Table className="whitespace-nowrap [&_tbody_tr:last-child_td]:border-b-0">
        <Table.Head>
          <Table.Row>
            <Table.Header>Vendor</Table.Header>
            <Table.Header>Priced</Table.Header>
            <Table.Header>Hardware</Table.Header>
            <Table.Header>Contract</Table.Header>
            <Table.Header align="right">Room, year one</Table.Header>
            <Table.Header>Sources</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.vendor} className={cn(live && ARRIVE)}>
              <Table.Cell className="text-ws-static-strong">{row.vendor}</Table.Cell>
              <Table.Cell>{row.billing}</Table.Cell>
              <Table.Cell>{row.hardware}</Table.Cell>
              <Table.Cell>{row.contract}</Table.Cell>
              <Table.Cell align="right" className="tabular-nums">
                {formatPrice(row.yearOne)}
              </Table.Cell>
              <Table.Cell>
                {row.sources.map((source) => (
                  <Citation
                    key={source}
                    source={source}
                    active={citing.active === source}
                    citing={citing}
                  />
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
