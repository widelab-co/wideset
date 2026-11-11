import { RiCheckLine } from '@remixicon/react';
import { Select, Table } from '@wideset/react';

import { Code } from './code';
import { fields, file, fileColumns, SKIP } from './data';
import { formatCount } from './format';
import { Section } from './section';

/** The field each of the file's columns goes to, by column id; '' while none is chosen. */
export type Mapping = Record<string, string>;

/** Where every column starts: what Orbit matched on its own. */
export const initialMapping: Mapping = Object.fromEntries(
  fileColumns.map((column) => [column.id, column.match ?? '']),
);

type MatchStepProps = {
  mapping: Mapping;
  onChange: (mapping: Mapping) => void;
};

/**
 * One row a column of the file: its name as the file writes it, the value in the first row so
 * the user sees what it holds, and the Orbit field it fills. A field goes to one column only, so
 * a field already taken is off the list. Where Orbit chose by itself, a quiet note says why; it
 * goes as soon as the user changes the choice.
 */
export function MatchStep({ mapping, onChange }: MatchStepProps) {
  const taken = new Set(Object.values(mapping));

  return (
    <Section
      title="Match columns"
      description={`${file.name} has ${formatCount(file.rows)} rows and ${fileColumns.length} columns. Choose the Orbit field each column fills.`}
    >
      <Table size="sm" aria-label="Columns in the file" className="w-full">
        <Table.Head>
          <Table.Row>
            <Table.Header flushMargin>Column</Table.Header>
            <Table.Header>First row</Table.Header>
            <Table.Header>Orbit field</Table.Header>
            <Table.Header flushMargin className="w-full">
              <span className="sr-only">Note</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {fileColumns.map((column) => {
            const value = mapping[column.id];
            const auto = column.note && value === column.match;
            return (
              <Table.Row key={column.id}>
                <Table.Cell flushMargin className="whitespace-nowrap">
                  <Code>{column.header}</Code>
                </Table.Cell>
                <Table.Cell className="text-ws-static-subtle whitespace-nowrap">
                  {column.sample}
                </Table.Cell>
                <Table.Cell>
                  <Select
                    size="sm"
                    preset="border"
                    className="w-[13rem]"
                    aria-label={`Orbit field for ${column.header}`}
                    placeholder="Choose a field"
                    options={[
                      ...fields.map((field) => ({
                        value: field.value,
                        label: field.label,
                        disabled: taken.has(field.value) && value !== field.value,
                      })),
                      { value: SKIP, label: 'Don’t import' },
                    ]}
                    value={value}
                    onValueChange={(next) => onChange({ ...mapping, [column.id]: next })}
                  />
                </Table.Cell>
                <Table.Cell flushMargin>
                  {auto && (
                    <span className="gap-ws-3 typography-label-sm text-ws-static-subtle flex items-center whitespace-nowrap">
                      {column.match !== SKIP && (
                        <RiCheckLine aria-hidden="true" className="size-ws-9 shrink-0" />
                      )}
                      {column.note}
                    </span>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Section>
  );
}
