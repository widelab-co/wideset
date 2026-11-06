/**
 * The grid is one tab stop. Tab to it or click a cell, then move with the arrow keys: Home and End
 * go to the ends of a row, Ctrl+Home and Ctrl+End (Cmd on a Mac) to the first and last cell, Page
 * Up and Page Down by a screen of rows. The cell you reach is the selected one (`aria-selected`,
 * the brand tint), and Tab comes back to it after you leave the grid. Enter or F2 moves focus to
 * the control in a cell, the checkbox here; Escape brings it back. A cell's `onFocus` tells you
 * which cell is active.
 */
import { Checkbox, Spreadsheet } from '@wideset/react';
import { useState } from 'react';

const clients = [
  { name: 'Tech Nova', customers: 23, employees: 58, verified: true },
  { name: 'Eco Solutions', customers: 37, employees: 72, verified: false },
  { name: 'Skyline Innovations', customers: 15, employees: 14, verified: true },
  { name: 'Terra Firma', customers: 42, employees: 49, verified: false },
];

export default function SpreadsheetKeyboard() {
  const [active, setActive] = useState('none');

  return (
    <div className="gap-ws-5 flex w-[30rem] max-w-full flex-col">
      <Spreadsheet aria-label="Clients">
        <Spreadsheet.Head>
          <Spreadsheet.Row>
            <Spreadsheet.ColumnHeader onFocus={() => setActive('Client name')}>
              Client name
            </Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeader className="w-[6.5rem]" onFocus={() => setActive('Customers')}>
              Customers
            </Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeader className="w-[6.5rem]" onFocus={() => setActive('Employees')}>
              Employees
            </Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeader className="w-[5.5rem]" onFocus={() => setActive('Verified')}>
              Verified
            </Spreadsheet.ColumnHeader>
          </Spreadsheet.Row>
        </Spreadsheet.Head>
        <Spreadsheet.Body>
          {clients.map((client) => (
            <Spreadsheet.Row key={client.name}>
              <Spreadsheet.Cell onFocus={() => setActive(`${client.name}, client name`)}>
                {client.name}
              </Spreadsheet.Cell>
              <Spreadsheet.Cell
                align="right"
                onFocus={() => setActive(`${client.name}, customers`)}
              >
                {client.customers}
              </Spreadsheet.Cell>
              <Spreadsheet.Cell
                align="right"
                onFocus={() => setActive(`${client.name}, employees`)}
              >
                {client.employees}
              </Spreadsheet.Cell>
              <Spreadsheet.Cell onFocus={() => setActive(`${client.name}, verified`)}>
                <Checkbox
                  aria-label={`Verified: ${client.name}`}
                  defaultChecked={client.verified}
                />
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          ))}
        </Spreadsheet.Body>
      </Spreadsheet>
      <p className="typography-body-sm text-ws-static-subtle">Active cell: {active}</p>
    </div>
  );
}
