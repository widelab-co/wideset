/**
 * In a table the thumbnail leads the name cell and follows the row: medium in a small table (the
 * default), large in medium and large tables. It is decorative there, since the name next to it
 * already says what the file is, so screen readers skip the tile and read the name.
 */
import { Table, Thumbnail } from '@wideset/react';

const files = [
  { name: 'Q3 board report.pdf', type: 'pdf', owner: 'Anna Kowalska', updated: 'Today' },
  { name: 'Budget 2027.xlsx', type: 'spreadsheet', owner: 'Tomasz Stępień', updated: 'Yesterday' },
  { name: 'Launch brief.docx', type: 'document', owner: 'Marta Lis', updated: 'Nov 3' },
  { name: 'Onboarding tour.mp4', type: 'video', owner: 'Jakub Nowak', updated: 'Oct 28' },
  { name: 'Homepage hero.png', type: 'picture', owner: 'Anna Kowalska', updated: 'Oct 21' },
] as const;

export default function ThumbnailInATable() {
  return (
    <div className="w-[30rem] max-w-full">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Owner</Table.Header>
            <Table.Header align="right">Updated</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {files.map((file) => (
            <Table.Row key={file.name}>
              <Table.Cell>
                <div className="gap-ws-7 flex items-center">
                  <Thumbnail type={file.type} />
                  {file.name}
                </div>
              </Table.Cell>
              <Table.Cell>{file.owner}</Table.Cell>
              <Table.Cell align="right">{file.updated}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
