/** The playground's stage: three clients in a small grid, with row numbers and typed column headers. */
import { RiFileLine, RiHashtag, RiPriceTag3Line, RiShieldKeyholeLine } from '@remixicon/react';
import { Spreadsheet, type SpreadsheetProps, StatusBadge, Tag } from '@wideset/react';

const clients = [
  {
    name: 'Tech Nova',
    customers: 23,
    country: 'Brazil',
    tag: 'pink',
    market: 'No issues',
    status: 'positive',
  },
  {
    name: 'Eco Solutions',
    customers: 37,
    country: 'Japan',
    tag: 'indigo',
    market: 'No issues',
    status: 'positive',
  },
  {
    name: 'Pinnacle Tech',
    customers: 8,
    country: 'India',
    tag: 'cyan',
    market: '2 issues',
    status: 'negative',
  },
] as const;

export default function SpreadsheetDefault(props: Partial<SpreadsheetProps>) {
  return (
    <Spreadsheet aria-label="Clients" className="w-[34rem] max-w-full" {...props}>
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeaderIcon icon={RiFileLine} />
            Client name
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
            Customers
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7.5rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiPriceTag3Line} />
            Country
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7.5rem]">
            <Spreadsheet.ColumnHeaderIcon icon={RiShieldKeyholeLine} />
            Market
          </Spreadsheet.ColumnHeader>
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        {clients.map((client, index) => (
          <Spreadsheet.Row key={client.name}>
            <Spreadsheet.RowHeader>{index}</Spreadsheet.RowHeader>
            <Spreadsheet.Cell>{client.name}</Spreadsheet.Cell>
            <Spreadsheet.Cell align="right">{client.customers}</Spreadsheet.Cell>
            <Spreadsheet.Cell>
              <Tag size="sm" color={client.tag}>
                {client.country}
              </Tag>
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              <StatusBadge size="sm" color={client.status}>
                {client.market}
              </StatusBadge>
            </Spreadsheet.Cell>
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}
