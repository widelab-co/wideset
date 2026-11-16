/**
 * A second, quieter line under a cell's label goes in `Table.CellDescription`: a project's
 * summary under its name, an email under a person. The label keeps the table's type, so never
 * raise its size to make it stand out. Use it in `md` and `lg` tables.
 */
import { StatusBadge, Table } from '@wideset/react';

const features = [
  { name: 'Offline sync', summary: 'Edits made offline merge on reconnect.', beta: true },
  { name: 'Shared views', summary: 'Saved filters the whole team can open.', beta: false },
  { name: 'Audit log', summary: 'Every change with who made it and when.', beta: false },
];

export default function TableDescriptions() {
  return (
    <div className="w-[30rem] max-w-full">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Feature</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {features.map(({ name, summary, beta }) => (
            <Table.Row key={name}>
              <Table.Cell>
                {name}
                <Table.CellDescription>{summary}</Table.CellDescription>
              </Table.Cell>
              <Table.Cell>
                <StatusBadge color={beta ? 'notice' : 'positive'}>
                  {beta ? 'Beta' : 'Stable'}
                </StatusBadge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
