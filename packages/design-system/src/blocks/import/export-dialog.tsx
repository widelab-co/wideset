import { RiDownload2Line } from '@remixicon/react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormField,
  Modal,
  RadioButton,
  RadioButtonGroup,
} from '@wideset/react';
import { useId, useState } from 'react';

import { csvHref } from './csv-href';
import { account, exportSample, fields, OWNED_BY_ME } from './data';
import { customers } from './format';

type Scope = 'all' | 'mine';

type ExportFormProps = {
  /** The customers in Orbit now, imports included. */
  total: number;
  onExport: (count: number) => void;
};

/**
 * The dialog's content. It mounts with the dialog, so every opening starts from all customers
 * and every field. The name is always in the file: without it a row cannot come back in.
 */
function ExportForm({ total, onExport }: ExportFormProps) {
  const id = useId();
  const [scope, setScope] = useState<Scope>('all');
  const [chosen, setChosen] = useState(fields.map((field) => field.value));

  const count = scope === 'all' ? total : OWNED_BY_ME;
  const columns = fields.filter((field) => chosen.includes(field.value));
  const rows = exportSample.filter((row) => scope === 'all' || row[2] === account.email);
  const href = csvHref([
    columns.map((field) => field.column),
    ...rows.map((row) => columns.map((field) => row[fields.indexOf(field)])),
  ]);

  return (
    <>
      <Modal.Header>
        <Modal.Title>Export customers</Modal.Title>
        <Modal.Description>
          A CSV file in the columns an import reads, so it can be edited and brought back in.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body className="gap-ws-11 flex flex-col">
        <FormField label="Customers" id={`${id}-scope`} WrapperComponent="fieldset">
          <RadioButtonGroup
            aria-labelledby={`${id}-scope`}
            value={scope}
            onValueChange={(value) => setScope(value as Scope)}
          >
            <RadioButton value="all" label="All customers" description={customers(total)} />
            <RadioButton
              value="mine"
              label="Customers I own"
              description={customers(OWNED_BY_ME)}
            />
          </RadioButtonGroup>
        </FormField>
        <FormField label="Fields" id={`${id}-fields`} WrapperComponent="fieldset">
          <CheckboxGroup aria-labelledby={`${id}-fields`} className="grid grid-cols-2">
            {fields.map((field) => (
              <Checkbox
                key={field.value}
                label={field.label}
                disabled={field.required}
                checked={chosen.includes(field.value)}
                onCheckedChange={(on) =>
                  setChosen(
                    on === true
                      ? [...chosen, field.value]
                      : chosen.filter((value) => value !== field.value),
                  )
                }
              />
            ))}
          </CheckboxGroup>
        </FormField>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Modal.Close>
        <Button asChild>
          <a href={href} download="customers.csv" onClick={() => onExport(count)}>
            <Button.Icon icon={RiDownload2Line} />
            {/* Under asChild the label's inset is ours to give, as Button gives its own. */}
            <span className="px-ws-2">{`Export ${customers(count)}`}</span>
          </a>
        </Button>
      </Modal.Footer>
    </>
  );
}

type ExportDialogProps = ExportFormProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Exporting customers, the other half of Import & Export: who goes in the file and which fields.
 * The format is not a choice, because CSV is the one an import reads back.
 */
export function ExportDialog({ open, onOpenChange, total, onExport }: ExportDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <ExportForm total={total} onExport={onExport} />
      </Modal.Content>
    </Modal>
  );
}
