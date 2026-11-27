/**
 * The header row stays in view as the grid scrolls down, and `stickyColumns` pins the leading
 * columns as it scrolls sideways: `1` (the default) keeps the row numbers, `2` here keeps the
 * client name too. Give the grid a height and a width to scroll in. Pinned cells keep the grid's
 * surface, and a cell reached with the keyboard scrolls clear of them.
 */
import { Spreadsheet } from '@wideset/react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const clients = [
  'Tech Nova',
  'Eco Solutions',
  'Skyline Innovations',
  'Terra Firma',
  'Quantum Leap',
  'Pinnacle Tech',
  'Future Vision',
  'Aqua Vista',
  'Summit Solutions',
  'Metro Dynamics',
  'Pure Air Tech',
  'Sunny Tech',
];
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const revenue = (client: number, month: number) => ((client + 3) * (month + 7) * 389) % 9000;

export default function SpreadsheetStickyColumns() {
  return (
    <Spreadsheet
      aria-label="Monthly revenue"
      stickyColumns={2}
      className="h-[16rem] w-[34rem] max-w-full"
    >
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">Client name</Spreadsheet.ColumnHeader>
          {months.map((month) => (
            <Spreadsheet.ColumnHeader key={month} align="right" className="w-[5.5rem]">
              {month}
            </Spreadsheet.ColumnHeader>
          ))}
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        {clients.map((client, row) => (
          <Spreadsheet.Row key={client}>
            <Spreadsheet.RowHeader>{row}</Spreadsheet.RowHeader>
            <Spreadsheet.Cell>{client}</Spreadsheet.Cell>
            {months.map((month, column) => (
              <Spreadsheet.Cell key={month} align="right">
                {money.format(revenue(row, column))}
              </Spreadsheet.Cell>
            ))}
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}
