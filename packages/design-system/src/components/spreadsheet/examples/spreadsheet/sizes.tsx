/**
 * Small is the default: 32px rows with 8px sides, for the densest data. Medium has 40px rows and
 * 12px sides, room for 24px avatars and badges. The text stays 12px at both sizes; size what the
 * cells hold with the grid: `Tag` and `StatusBadge` `sm` in Small and `md` in Medium, `Avatar`
 * `xs` and `sm`. Checkbox and Switch keep their default `lg` (20px) at both.
 */
import { Avatar, Spreadsheet, StatusBadge } from '@wideset/react';

const clients = [
  { name: 'Tech Nova', manager: 'Adam Smith', initials: 'AS', market: 'No issues' },
  { name: 'Eco Solutions', manager: 'Maria Lopez', initials: 'ML', market: 'No issues' },
];

const sizes = [
  { size: 'sm', label: 'Small', avatar: 'xs', badge: 'sm' },
  { size: 'md', label: 'Medium', avatar: 'sm', badge: 'md' },
] as const;

export default function SpreadsheetSizes() {
  return (
    <div className="gap-ws-11 flex w-[30rem] max-w-full flex-col">
      {sizes.map(({ size, label, avatar, badge }) => (
        <Spreadsheet key={size} size={size} aria-label={`Clients, ${label}`}>
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>{label}</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader>Account manager</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader className="w-[8rem]">Market</Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
          <Spreadsheet.Body>
            {clients.map((client) => (
              <Spreadsheet.Row key={client.name}>
                <Spreadsheet.Cell>{client.name}</Spreadsheet.Cell>
                <Spreadsheet.Cell>
                  <Avatar size={avatar} initials={client.initials} />
                  {client.manager}
                </Spreadsheet.Cell>
                <Spreadsheet.Cell>
                  <StatusBadge size={badge} color="positive">
                    {client.market}
                  </StatusBadge>
                </Spreadsheet.Cell>
              </Spreadsheet.Row>
            ))}
          </Spreadsheet.Body>
        </Spreadsheet>
      ))}
    </div>
  );
}
