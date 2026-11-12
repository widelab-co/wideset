import { RiSideBarLine } from '@remixicon/react';
import {
  Breadcrumbs,
  Button,
  Card,
  cn,
  IconButton,
  ProgressStepper,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  CUSTOMERS_BEFORE,
  type Duplicates,
  file,
  outcome,
  type PastImport,
  pastImports,
  TODAY,
} from './data';
import { ExportDialog } from './export-dialog';
import { FileGuide } from './file-guide';
import { customers } from './format';
import { ImportResult } from './import-result';
import { initialMapping, type Mapping, MatchStep } from './match-step';
import { PageHeader } from './page-header';
import { RecentImports } from './recent-imports';
import { ReviewStep } from './review-step';
import { ImportSidebar } from './sidebar';
import { UploadStep } from './upload-step';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const STEPS = [
  { title: 'Upload' },
  { title: 'Match columns' },
  { title: 'Review' },
  { title: 'Done' },
];
const [UPLOAD, MATCH, REVIEW, DONE] = [0, 1, 2, 3];

type PageProps = { collapsed: boolean; onToggleSidebar: () => void; sidebarId: string };

/**
 * The page inside the toast provider. The screen holds the import: the step, how the columns are
 * matched and what happens to duplicates, so going back keeps every choice. Steps already done
 * can be clicked to return to; once the import has run, the stepper only reports.
 */
function ImportPage({ collapsed, onToggleSidebar, sidebarId }: PageProps) {
  const { showToast } = useToast();
  const resultId = useId();

  const [step, setStep] = useState(UPLOAD);
  const [chosen, setChosen] = useState<File>();
  const [mapping, setMapping] = useState<Mapping>(initialMapping);
  const [duplicates, setDuplicates] = useState<Duplicates>('update');
  const [importing, setImporting] = useState(false);
  const [imports, setImports] = useState<PastImport[]>(pastImports);
  const [exportOpen, setExportOpen] = useState(false);

  const result = outcome(duplicates);
  const nameMatched = Object.values(mapping).includes('name');
  // The customers in Orbit now: those before this visit and what its imports added.
  const total = imports
    .slice(0, -pastImports.length)
    .reduce((sum, entry) => sum + entry.added, CUSTOMERS_BEFORE);

  function start() {
    setChosen(undefined);
    setMapping(initialMapping);
    setDuplicates('update');
    setStep(UPLOAD);
  }

  // A timeout stands in for the import; a real one runs on the server and the page can be left
  // while it does, as the help article says.
  function runImport() {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImports([
        { id: `q4-${imports.length}`, file: file.name, date: TODAY, by: account.name, ...result },
        ...imports,
      ]);
      setStep(DONE);
      // The steps' content is replaced by the result: take focus to its heading.
      requestAnimationFrame(() => document.getElementById(resultId)?.focus());
    }, 900);
  }

  // What the step's card ends in: what is left to do, then Back and the way on, the filled button.
  const footer =
    step === UPLOAD
      ? {
          hint: chosen
            ? 'Nothing changes in Orbit until the last step.'
            : 'Choose a CSV file to continue.',
          label: 'Continue',
          disabled: !chosen,
          onClick: () => setStep(MATCH),
        }
      : step === MATCH
        ? {
            hint: nameMatched
              ? 'Nothing changes in Orbit until the last step.'
              : 'Choose the column that holds the name to continue.',
            label: 'Continue',
            disabled: !nameMatched,
            onClick: () => setStep(REVIEW),
          }
        : step === REVIEW
          ? {
              hint: 'Nothing changes in Orbit until you import.',
              label: importing
                ? 'Importing…'
                : `Import ${customers(result.added + result.updated)}`,
              disabled: importing,
              onClick: runImport,
            }
          : null;

  return (
    <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
        {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
            left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
        <div className="gap-ws-5 px-ws-11 flex w-full items-center">
          <IconButton
            icon={RiSideBarLine}
            variant="secondary"
            preset="ghost"
            size="sm"
            iconClassName="text-ws-static-subtle size-ws-9"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            aria-controls={sidebarId}
            onClick={onToggleSidebar}
            className="-ml-ws-5"
          />
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href="#customers">Customers</a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>Import</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
      </div>

      {/* The page scrolls inside the card, so the card's corners stay put. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
          <PageHeader
            title="Import customers"
            description="Bring customers in from a CSV file, or take them out as one."
          >
            <Button
              size="sm"
              variant="secondary"
              preset="border"
              onClick={() => setExportOpen(true)}
            >
              Export customers
            </Button>
          </PageHeader>

          <div className="gap-ws-12 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="gap-ws-12 flex min-w-0 flex-col">
              {/* The import is the page's job, so it is the card: the steps as its header, the
                  step's question, then what is left to do and the way on at its foot. */}
              <Card>
                <Card.Header>
                  <ProgressStepper
                    aria-label="Import steps"
                    steps={STEPS}
                    activeStep={step === DONE ? STEPS.length : step}
                    disabled={step === DONE || importing}
                    onStepChange={(index) => index < step && setStep(index)}
                  />
                </Card.Header>
                <div className="p-ws-11 flex flex-col">
                  {step === UPLOAD && (
                    <UploadStep
                      file={chosen}
                      onFile={setChosen}
                      onRemove={() => setChosen(undefined)}
                    />
                  )}
                  {step === MATCH && <MatchStep mapping={mapping} onChange={setMapping} />}
                  {step === REVIEW && (
                    <ReviewStep duplicates={duplicates} onDuplicatesChange={setDuplicates} />
                  )}
                  {step === DONE && (
                    <ImportResult
                      id={resultId}
                      result={imports[0]}
                      quiet={exportOpen}
                      onImportAnother={start}
                    />
                  )}
                </div>

                {footer && (
                  <Card.Footer className="gap-ws-5 items-center">
                    <p className="typography-body-md text-ws-static-subtle min-w-0 flex-1">
                      {footer.hint}
                    </p>
                    {step !== UPLOAD && (
                      <Button
                        size="sm"
                        variant="secondary"
                        preset="border"
                        disabled={importing}
                        onClick={() => setStep(step - 1)}
                      >
                        Back
                      </Button>
                    )}
                    {/* While the export dialog holds the filled button, this one steps back. */}
                    <Button
                      size="sm"
                      variant={exportOpen ? 'secondary' : 'primary'}
                      preset={exportOpen ? 'border' : 'filled'}
                      disabled={footer.disabled}
                      onClick={footer.onClick}
                    >
                      {footer.label}
                    </Button>
                  </Card.Footer>
                )}
              </Card>

              {step === UPLOAD && <RecentImports imports={imports} />}
            </div>

            <aside aria-label="About the file">
              <FileGuide />
            </aside>
          </div>
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        total={total}
        onExport={(count) => {
          setExportOpen(false);
          showToast({
            status: 'success',
            content: `${customers(count)} exported to customers.csv`,
          });
        }}
      />
    </main>
  );
}

/**
 * Import (Inset direction): bringing customers in from a CSV file, in steps, on the raised page
 * beside the workspace sidebar. One bordered card holds the work: the stepper as its header, the
 * step's one question (the file, where its columns go, what happens to duplicates), and a foot with
 * what is left to do, Back and Continue, so the way on is always in sight; the result lands in the
 * same card. The columns Orbit reads sit in a card beside it, and Export, the other way round, in
 * the header.
 */
export default function Import() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider position="bottom-center">
      <div className="bg-ws-static-background flex h-dvh">
        <ImportSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <ImportPage
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          sidebarId={sidebarId}
        />
      </div>
    </ToastProvider>
  );
}
