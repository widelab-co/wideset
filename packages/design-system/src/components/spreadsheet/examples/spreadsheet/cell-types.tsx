/**
 * A cell holds text or one library component, never a hand-built pill: text, a right-aligned
 * number, `Tag` for a category, `StatusBadge` for a state, `Avatar` beside a name, `Checkbox`,
 * `Switch`, `ProgressBar` (80px wide), an icon. Text and mixed content stay on one line and end
 * in an ellipsis. Controls inside a cell need their own label, as they have no visible one:
 * name them after the column and the row.
 */
import { RiMastercardLine, RiStarFill, RiStarLine, RiVisaLine } from '@remixicon/react';
import {
  Avatar,
  Checkbox,
  ProgressBar,
  Spreadsheet,
  StatusBadge,
  Switch,
  Tag,
} from '@wideset/react';

const clients = [
  {
    name: 'Tech Nova',
    customers: 23,
    country: 'Brazil',
    tag: 'pink',
    market: 'No issues',
    status: 'positive',
    manager: 'Adam Smith',
    initials: 'AS',
    verified: true,
    newsletter: true,
    onboarding: 50,
    starred: true,
    card: 'Visa',
    last4: '4789',
  },
  {
    name: 'Eco Solutions',
    customers: 37,
    country: 'Japan',
    tag: 'indigo',
    market: 'Risk found',
    status: 'notice',
    manager: 'Maria Lopez',
    initials: 'ML',
    verified: false,
    newsletter: false,
    onboarding: 80,
    starred: false,
    card: 'Mastercard',
    last4: '1203',
  },
  {
    name: 'Pinnacle Tech',
    customers: 8,
    country: 'India',
    tag: 'cyan',
    market: '2 issues',
    status: 'negative',
    manager: 'Kenji Sato',
    initials: 'KS',
    verified: true,
    newsletter: false,
    onboarding: 20,
    starred: false,
    card: 'Visa',
    last4: '5521',
  },
] as const;

export default function SpreadsheetCellTypes() {
  return (
    <Spreadsheet aria-label="Clients" className="w-[46rem] max-w-full">
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">Client name</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7rem]">Customers</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7.5rem]">Country</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[7.5rem]">Market</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">
            Account manager
          </Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[5rem]">Verified</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[6rem]">Newsletter</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[8rem]">Onboarding</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[5rem]">Starred</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[9rem]">Payment</Spreadsheet.ColumnHeader>
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
            <Spreadsheet.Cell>
              <Avatar size="xs" initials={client.initials} />
              {client.manager}
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              <Checkbox aria-label={`Verified: ${client.name}`} defaultChecked={client.verified} />
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              <Switch
                aria-label={`Newsletter: ${client.name}`}
                defaultChecked={client.newsletter}
              />
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              <div className="w-ws-22">
                <ProgressBar value={client.onboarding} aria-label={`Onboarding: ${client.name}`} />
              </div>
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              {client.starred ? (
                <RiStarFill role="img" aria-label="Starred" className="size-ws-9" />
              ) : (
                <RiStarLine role="img" aria-label="Not starred" className="size-ws-9" />
              )}
            </Spreadsheet.Cell>
            <Spreadsheet.Cell>
              {client.card === 'Visa' ? (
                <RiVisaLine role="img" aria-label="Visa" className="size-ws-12" />
              ) : (
                <RiMastercardLine role="img" aria-label="Mastercard" className="size-ws-12" />
              )}
              •••• {client.last4}
            </Spreadsheet.Cell>
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}
