import { RiDownload2Line } from '@remixicon/react';
import { Button, RadioButton, RadioButtonGroup, Table } from '@wideset/react';

import { csvHref } from './csv-href';
import {
  counts,
  duplicateChoices,
  type Duplicates,
  file,
  outcome,
  type SkippedRow,
  skippedRows,
} from './data';
import { formatCount } from './format';
import { OutcomeFigures } from './outcome-figures';
import { Section } from './section';

type ReviewStepProps = {
  duplicates: Duplicates;
  onDuplicatesChange: (duplicates: Duplicates) => void;
};

/** The skipped rows as a file to correct and import again, in the file's own columns. */
const skippedFile = csvHref([
  ['row', 'name', 'domain', 'reason'],
  ...skippedRows.map((row: SkippedRow) => [row.row, row.name, row.domain, row.reason]),
]);

/**
 * The last look before anything changes: what the import will do as three figures, the one
 * decision left (customers Orbit already has, found by domain), and the rows it cannot read with
 * the reason for each and a way to take them away and fix them. The figures follow the decision.
 */
export function ReviewStep({ duplicates, onDuplicatesChange }: ReviewStepProps) {
  return (
    <div className="gap-ws-14 flex flex-col">
      <Section
        title="What the import will do"
        description={`From the ${formatCount(file.rows)} rows in ${file.name}.`}
      >
        <OutcomeFigures {...outcome(duplicates)} />
      </Section>

      <Section
        title="Customers already in Orbit"
        description={`${formatCount(counts.existing)} rows have the domain of a customer Orbit already has.`}
      >
        <RadioButtonGroup
          aria-label="Customers already in Orbit"
          value={duplicates}
          onValueChange={(value) => onDuplicatesChange(value as Duplicates)}
        >
          {duplicateChoices.map((choice) => (
            <RadioButton
              key={choice.value}
              value={choice.value}
              label={choice.label}
              description={choice.description}
            />
          ))}
        </RadioButtonGroup>
      </Section>

      <Section
        title="Rows that can’t be imported"
        description="Fix them in the file and import it again. The rest are not imported twice."
        action={
          <Button size="sm" variant="secondary" preset="border" asChild>
            <a href={skippedFile} download="customers-q4-skipped.csv">
              <Button.Icon icon={RiDownload2Line} />
              {/* Under asChild the label's inset is ours to give, as Button gives its own. */}
              <span className="px-ws-2">Download skipped rows</span>
            </a>
          </Button>
        }
      >
        <Table size="sm" aria-label="Rows that can’t be imported" className="w-full">
          <Table.Head>
            <Table.Row>
              <Table.Header flushMargin align="right">
                Row
              </Table.Header>
              <Table.Header>Name</Table.Header>
              <Table.Header>Domain</Table.Header>
              <Table.Header flushMargin className="w-full">
                Reason
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {skippedRows.map((row) => (
              <Table.Row key={row.row}>
                <Table.Cell flushMargin align="right" className="tabular-nums">
                  {row.row}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {row.name || <span className="text-ws-static-subtle">Empty</span>}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{row.domain}</Table.Cell>
                <Table.Cell flushMargin>{row.reason}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Section>
    </div>
  );
}
