import { RiDownload2Line, RiMailSendLine } from '@remixicon/react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DateRangePicker,
  type DateRangeValue,
  FileItem,
  FormField,
  Modal,
  ProgressBar,
  RadioButton,
  RadioButtonGroup,
  SegmentedControl,
} from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { csvHref } from './csv-href';
import { type ColumnId, COLUMNS, type Customer, TODAY } from './data';
import { formatCount, formatCustomers, formatSize } from './format';

type Scope = 'all' | 'matching' | 'selected';
type Format = 'csv' | 'xlsx' | 'pdf';
type Stage = { step: 'form' } | { step: 'preparing'; progress: number } | { step: 'ready' };

const FORMATS: { value: Format; label: string }[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

/** Past this many rows a file is prepared in the background and e-mailed, not waited for. */
const LARGE = 500;
const IN_BACKGROUND = 'Prepared in the background. We will e-mail you when it is ready.';

/** The sample's own today as a local Date, for the calendar: drop it to follow the clock. */
const [year, month, day] = TODAY.split('-').map(Number);
const SAMPLE_TODAY = new Date(year, month - 1, day);

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Every customer in the workspace. */
  customers: Customer[];
  /** The customers the list's filters leave; nothing while no filter is on. */
  matching?: Customer[];
  selected: Customer[];
  /** A large export went to the background; the toast says the e-mail will follow. */
  onQueued: (count: number) => void;
  onSent: (fileName: string) => void;
};

/**
 * Exporting customers, in three steps in one dialog. First the choices: which customers (all of
 * them, the ones the filters leave, or the selected rows, each with its count), when they were
 * added (for the first two), the columns (the name always in), and the format. The filled button
 * names the count. Then the file is prepared in place with a bar and a way to stop, and once
 * ready it is downloaded or sent by e-mail. An export too large to wait for (everyone, unless the
 * range narrows it) is queued and e-mailed instead, as its option says before it is chosen.
 */
export function ExportDialog({
  open,
  onOpenChange,
  customers,
  matching,
  selected,
  onQueued,
  onSent,
}: ExportDialogProps) {
  const id = useId();
  const [scope, setScope] = useState<Scope>(
    matching ? 'matching' : selected.length > 0 ? 'selected' : 'all',
  );
  const [range, setRange] = useState<DateRangeValue>();
  // Changes when the range is cleared, which empties the picker.
  const [cleared, setCleared] = useState(0);
  const [columns, setColumns] = useState<ColumnId[]>(COLUMNS.map((column) => column.id));
  const [format, setFormat] = useState<Format>('csv');
  const [stage, setStage] = useState<Stage>({ step: 'form' });

  const datesApply = scope !== 'selected';
  /** The customers added in the range, when one is set. */
  const added = (list: Customer[]) =>
    range?.from && range.to
      ? list.filter((customer) => customer.added >= range.from! && customer.added <= range.to!)
      : list;
  const base = { all: customers, matching: matching ?? customers, selected }[scope];
  const rows = datesApply ? added(base) : base;
  const queued = rows.length > LARGE;
  /** Said under an option before it is chosen, when it is too large to wait for. */
  const note = (list: Customer[]) => (list.length > LARGE ? IN_BACKGROUND : undefined);
  const fileName = `customers.${format}`;
  const chosen = COLUMNS.filter((column) => columns.includes(column.id));

  // The file is written while it is being prepared, so the bar has something to stand for.
  useEffect(() => {
    if (stage.step !== 'preparing') return;
    const timer = setInterval(
      () =>
        setStage((now) =>
          now.step !== 'preparing'
            ? now
            : now.progress >= 100
              ? { step: 'ready' }
              : { step: 'preparing', progress: Math.min(100, now.progress + 8) },
        ),
      120,
    );
    return () => clearInterval(timer);
  }, [stage.step]);

  // ponytail: the sample writes CSV for every format; a real screen links to the file the server
  // prepared in the format chosen.
  const href =
    stage.step === 'ready'
      ? csvHref([
          chosen.map((column) => column.label),
          ...rows.map((customer) => chosen.map((column) => column.value(customer))),
        ])
      : '';
  // The names and labels are plain ASCII, so a character is a byte.
  const size =
    stage.step === 'ready' ? decodeURIComponent(href.slice(href.indexOf(',') + 1)).length : 0;

  const optional = COLUMNS.filter((column) => column.id !== 'name');
  const optionalOn = optional.filter((column) => columns.includes(column.id)).length;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Export customers</Modal.Title>
          <Modal.Description>
            {stage.step === 'form'
              ? 'Choose who goes in the file, what it says about them and its format.'
              : stage.step === 'preparing'
                ? 'This takes a few seconds. You can keep the dialog open or come back to it.'
                : 'Your file is ready. Download it, or have it sent to you.'}
          </Modal.Description>
        </Modal.Header>

        {stage.step === 'form' && (
          <>
            <Modal.Body className="gap-ws-12 flex flex-col">
              <FormField label="Customers" id={`${id}-scope`} WrapperComponent="fieldset">
                <RadioButtonGroup
                  aria-labelledby={`${id}-scope`}
                  value={scope}
                  onValueChange={(value) => setScope(value as Scope)}
                >
                  <RadioButton
                    value="all"
                    label={`All ${formatCount(customers.length)}`}
                    description={note(added(customers))}
                  />
                  {matching && (
                    <RadioButton
                      value="matching"
                      label={`The ${formatCount(matching.length)} matching your filters`}
                      description={note(added(matching))}
                    />
                  )}
                  <RadioButton
                    value="selected"
                    disabled={selected.length === 0}
                    label={
                      selected.length > 0
                        ? `The ${formatCount(selected.length)} selected`
                        : 'The selected'
                    }
                    description={
                      selected.length === 0 ? 'Select customers in the list first.' : note(selected)
                    }
                  />
                </RadioButtonGroup>
              </FormField>

              {datesApply && (
                <FormField label="Added" htmlFor={`${id}-added`}>
                  <div className="gap-ws-5 flex">
                    <DateRangePicker
                      key={cleared}
                      id={`${id}-added`}
                      placeholder="Any time"
                      className="flex-1"
                      dateFormat="MMM d, yyyy"
                      weekStartsOn={1}
                      today={SAMPLE_TODAY}
                      defaultMonth={SAMPLE_TODAY}
                      disabledDates={{ after: SAMPLE_TODAY }}
                      onSelect={(next) => next?.from && next.to && setRange(next)}
                    />
                    {range && (
                      <Button
                        variant="secondary"
                        preset="ghost"
                        onClick={() => {
                          setRange(undefined);
                          setCleared(cleared + 1);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </FormField>
              )}

              <FormField label="Columns" id={`${id}-columns`} WrapperComponent="fieldset">
                <div className="gap-ws-7 flex flex-col">
                  <Checkbox
                    label="All columns"
                    checked={
                      optionalOn === optional.length
                        ? true
                        : optionalOn === 0
                          ? false
                          : 'indeterminate'
                    }
                    onCheckedChange={(on) =>
                      setColumns(on === true ? COLUMNS.map((column) => column.id) : ['name'])
                    }
                  />
                  <CheckboxGroup aria-labelledby={`${id}-columns`} className="grid grid-cols-3">
                    {COLUMNS.map((column) => (
                      <Checkbox
                        key={column.id}
                        label={column.label}
                        // Without the name a row cannot be told apart, so it is always in.
                        disabled={column.id === 'name'}
                        checked={columns.includes(column.id)}
                        onCheckedChange={(on) =>
                          setColumns(
                            on === true
                              ? [...columns, column.id]
                              : columns.filter((item) => item !== column.id),
                          )
                        }
                      />
                    ))}
                  </CheckboxGroup>
                </div>
              </FormField>

              <FormField label="Format" id={`${id}-format`}>
                <SegmentedControl
                  aria-labelledby={`${id}-format`}
                  value={format}
                  onValueChange={(value) => setFormat(value as Format)}
                  className="self-start"
                >
                  {FORMATS.map((item) => (
                    <SegmentedControl.Item key={item.value} value={item.value}>
                      {item.label}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl>
              </FormField>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close asChild>
                <Button variant="secondary" preset="border">
                  Cancel
                </Button>
              </Modal.Close>
              <Button
                disabled={rows.length === 0}
                onClick={() => {
                  if (queued) {
                    onOpenChange(false);
                    onQueued(rows.length);
                  } else {
                    setStage({ step: 'preparing', progress: 0 });
                  }
                }}
              >
                {`Export ${formatCustomers(rows.length)}`}
              </Button>
            </Modal.Footer>
          </>
        )}

        {stage.step === 'preparing' && (
          <>
            <Modal.Body>
              <ProgressBar
                value={stage.progress}
                label={`Preparing ${fileName}…`}
                description={`${formatCount(Math.round((rows.length * stage.progress) / 100))} of ${formatCustomers(rows.length)}`}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                preset="border"
                onClick={() => setStage({ step: 'form' })}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </>
        )}

        {stage.step === 'ready' && (
          <>
            <Modal.Body>
              <FileItem>
                <FileItem.Thumbnail name={fileName} />
                <FileItem.Title>{fileName}</FileItem.Title>
                <FileItem.Description>
                  {formatCustomers(rows.length)}
                  {formatSize(size)}
                </FileItem.Description>
              </FileItem>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                preset="border"
                onClick={() => {
                  onOpenChange(false);
                  onSent(fileName);
                }}
              >
                <Button.Icon icon={RiMailSendLine} />
                Send to my e-mail
              </Button>
              <Button asChild>
                <a href={href} download="customers.csv">
                  <Button.Icon icon={RiDownload2Line} />
                  {/* Under asChild the label's inset is ours to give, as Button gives its own. */}
                  <span className="px-ws-2">Download</span>
                </a>
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
}
