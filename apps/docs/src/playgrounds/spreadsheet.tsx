import { RiHashtag } from '@remixicon/react';
import { Spreadsheet } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Stage and code come from `examples/spreadsheet/default.tsx`; the size comes from
 * `SpreadsheetProps`. `stickyColumns` is a number and needs a scrolling grid, so the rail leaves it
 * out.
 */
export default playground({
  from: 'SpreadsheetProps',
  // Every part once: the corner header and a typed column header with its menu chevron over
  // two rows of a row number and a number cell, narrow enough to draw 1:1 beside the names.
  anatomy: () => (
    <Spreadsheet aria-label="Clients" className="w-[14rem] max-w-full">
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
            Customers
            <Spreadsheet.ColumnHeaderTrigger aria-label="Customers options" />
          </Spreadsheet.ColumnHeader>
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        <Spreadsheet.Row>
          <Spreadsheet.RowHeader>0</Spreadsheet.RowHeader>
          <Spreadsheet.Cell align="right">23</Spreadsheet.Cell>
        </Spreadsheet.Row>
        <Spreadsheet.Row>
          <Spreadsheet.RowHeader>1</Spreadsheet.RowHeader>
          <Spreadsheet.Cell align="right">37</Spreadsheet.Cell>
        </Spreadsheet.Row>
      </Spreadsheet.Body>
    </Spreadsheet>
  ),
});
