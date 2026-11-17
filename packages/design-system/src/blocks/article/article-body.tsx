import { InlineAlert, Table } from '@wideset/react';
import type { ReactNode } from 'react';

import { ArticleSection } from './article-section';
import { Code, CodeBlock } from './code';
import { columns, sampleFile, type SectionId, sections } from './data';
import { Steps } from './steps';

/** Running text: the long-form body size, with the leading it needs over a 42rem measure. */
const TEXT = 'typography-body-lg text-ws-static-base';

/** The name of something on screen, as the reader will find it written there. */
function Ui({ children }: { children: ReactNode }) {
  return <strong className="typography-body-strong-lg text-ws-static-strong">{children}</strong>;
}

/** A section of the article, by the id "On this page" knows it by. */
function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const { title } = sections.find((section) => section.id === id)!;
  return (
    <ArticleSection id={id} title={title}>
      {children}
    </ArticleSection>
  );
}

/**
 * The article's text, in the order a reader needs it: what to check first, how to shape the
 * file, the steps, then what happens after. Everything keeps one left edge: the steps' numbers,
 * the table's first column, the note and the code all start where a paragraph does.
 */
export function ArticleBody() {
  return (
    <div className="gap-ws-16 flex flex-col">
      <p className={TEXT}>
        Bring the customers you track somewhere else into Orbit in one go. Export them from your old
        tool or spreadsheet as a CSV file, check that its columns are ones Orbit can read, and Orbit
        adds each row as a customer, with its owner and stage.
      </p>

      <Section id="before-you-start">
        <p className={TEXT}>
          Workspace admins and members with the Sales manager role can import. If you do not see{' '}
          <Ui>Import</Ui> on the Customers page, ask an admin to change your role in{' '}
          <Ui>Settings</Ui>, <Ui>Members</Ui>.
        </p>
        <p className={TEXT}>
          One import takes up to 5,000 rows and 10 MB. Split a larger file into several and import
          them one after another.
        </p>
      </Section>

      <Section id="prepare-the-file">
        <p className={TEXT}>
          The first row of the file names its columns. Orbit needs a name for every customer; the
          other columns are optional, and a column Orbit does not know is left out.
        </p>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header flushMargin>Column</Table.Header>
              <Table.Header>Required</Table.Header>
              <Table.Header>What it holds</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {columns.map((column) => (
              <Table.Row key={column.name}>
                <Table.Cell flushMargin>
                  <Code>{column.name}</Code>
                </Table.Cell>
                <Table.Cell>{column.required ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{column.holds}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <p className={TEXT}>A file with every column starts like this:</p>
        <CodeBlock lines={sampleFile} />

        <ArticleSection level={3} title="Amounts and owners">
          <p className={TEXT}>
            Write amounts as plain numbers, without a currency sign or separators: 48000, not
            $48,000. An owner must already be a member of the workspace. A row whose owner Orbit
            does not know is imported without one, and you can assign it afterwards.
          </p>
        </ArticleSection>
      </Section>

      <Section id="import-the-file">
        <Steps
          steps={[
            <>
              Open <Ui>Customers</Ui> and select <Ui>Import</Ui> in the top right.
            </>,
            <>
              Drop the file onto the page, or select <Ui>Browse</Ui> and choose it on your computer.
            </>,
            <>
              Check how the columns match. Orbit matches the ones named as in the table above;
              choose a field for any other column, or <Ui>Skip</Ui> to leave it out.
            </>,
            <>
              Choose what happens to customers already in Orbit: <Ui>Skip</Ui> them, or{' '}
              <Ui>Update</Ui> them with the values in the file.
            </>,
            <>
              Select <Ui>Import</Ui>. A large file takes a few minutes; you can keep working while
              it runs.
            </>,
          ]}
        />
        <InlineAlert
          status="warning"
          persistent
          title="Updates can’t be undone"
          message="With Update, the values in the file replace the ones in Orbit. If you may need the old values, export your customers first."
        />
      </Section>

      <Section id="check-the-result">
        <p className={TEXT}>
          When the import ends, Orbit e-mails you a summary: how many customers it added, updated
          and skipped. The new customers are on the Customers page straight away, with Import as
          their source, so you can filter for them.
        </p>

        <ArticleSection level={3} title="If some rows failed">
          <p className={TEXT}>
            The summary lists every row Orbit could not read and why, such as a missing name or an
            amount with letters in it. Select <Ui>Download failed rows</Ui> to get them as a CSV
            file, correct them and import that file. Rows that worked the first time are not
            imported twice.
          </p>
        </ArticleSection>
      </Section>
    </div>
  );
}
