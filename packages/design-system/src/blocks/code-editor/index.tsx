import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, Tabs } from '@wideset/react';
import { useEffect, useId, useMemo, useState } from 'react';

import { CodeEditor, type Reveal } from './code-editor';
import { fileById, type FileId, FILES, NOW, type Sources, type Version, VERSIONS } from './data';
import { FileTree } from './file-tree';
import { formatSaved } from './format';
import { lint, type Problem } from './lint';
import { OutputPanel, type OutputTab } from './output-panel';
import { PageHeader } from './page-header';
import type { FileProblem } from './problem-list';
import { RestoreDialog } from './restore-dialog';
import { CodeEditorSidebar } from './sidebar';
import { runTest, type TestRun } from './test-run';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** How long the test runner takes to answer. */
const RUN_DELAY = 900;

/**
 * The page inside the card. It holds the saved versions and the text being edited, so the save
 * state, the tabs' unsaved dots, the problems and a test run all read from one place.
 */
function EditorPage() {
  const [versions, setVersions] = useState(VERSIONS);
  const [drafts, setDrafts] = useState<Sources>(VERSIONS[0].sources);
  const [open, setOpen] = useState<FileId[]>(['score-lead', 'helpers']);
  const [active, setActive] = useState<FileId>('score-lead');
  const [tab, setTab] = useState<OutputTab>('output');
  const [run, setRun] = useState<TestRun>();
  const [running, setRunning] = useState(false);
  const [reveal, setReveal] = useState<Reveal & { file: FileId }>();
  const [restoring, setRestoring] = useState<Version>();

  const [current] = versions;
  const unsaved = FILES.filter((file) => drafts[file.id] !== current.sources[file.id]).map(
    (file) => file.id,
  );
  const dirty = unsaved.length > 0;

  const problems = useMemo(
    () =>
      Object.fromEntries(
        FILES.map((file) => [file.id, file.language === 'js' ? lint(drafts[file.id]) : []]),
      ) as Record<FileId, Problem[]>,
    [drafts],
  );
  const allProblems: FileProblem[] = FILES.flatMap((file) =>
    problems[file.id].map((problem) => ({ file, problem })),
  ).sort((a, b) => Number(b.problem.severity === 'error') - Number(a.problem.severity === 'error'));

  const openFile = (id: FileId) => {
    if (!open.includes(id)) setOpen([...open, id]);
    setActive(id);
  };

  const save = () => {
    if (!dirty) return;
    setVersions([
      { number: current.number + 1, savedAt: NOW, by: 'maya', sources: drafts },
      ...versions,
    ]);
  };

  // Ctrl+S / Cmd+S saves, and never opens the browser's own save dialog on this page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 's') return;
      event.preventDefault();
      save();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const startRun = () => {
    setTab('output');
    setRunning(true);
    window.setTimeout(() => {
      setRun(runTest(problems));
      setRunning(false);
    }, RUN_DELAY);
  };

  const restore = (version: Version) => {
    setVersions([
      {
        number: current.number + 1,
        savedAt: NOW,
        by: 'maya',
        restoredFrom: version.number,
        sources: version.sources,
      },
      ...versions,
    ]);
    setDrafts(version.sources);
  };

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex h-full min-h-[40rem] flex-col')}>
      <PageHeader
        state={dirty ? 'Unsaved changes' : formatSaved(current.savedAt)}
        dirty={dirty}
        running={running}
        versions={versions}
        onPickVersion={setRestoring}
        onRun={startRun}
        onSave={save}
      />

      <div className="gap-ws-16 grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[13rem_minmax(0,1fr)]">
        <FileTree active={active} unsaved={unsaved} onOpen={openFile} />

        {/* The editor and its output are one object: one bordered box, split by a line. */}
        <section
          aria-label="Editor"
          className="border-ws-static-base rounded-ws-container-md flex min-h-0 flex-col overflow-hidden border"
        >
          <Tabs
            value={active}
            onValueChange={(value) => setActive(value as FileId)}
            className="min-h-0 flex-1"
          >
            <Tabs.List aria-label="Open files" className="px-ws-9">
              {open.map((id) => (
                <Tabs.Item key={id} value={id}>
                  <Tabs.Label>{fileById(id).name}</Tabs.Label>
                  {unsaved.includes(id) && (
                    <span className="bg-ws-static-inverse-background size-ws-4 rounded-ws-control-full">
                      <span className="sr-only">, unsaved changes</span>
                    </span>
                  )}
                </Tabs.Item>
              ))}
            </Tabs.List>
            {open.map((id) => (
              <Tabs.Content key={id} value={id} className="flex min-h-0 flex-1 flex-col">
                <CodeEditor
                  file={fileById(id)}
                  value={drafts[id]}
                  onChange={(value) => setDrafts({ ...drafts, [id]: value })}
                  problems={problems[id]}
                  reveal={reveal?.file === id ? reveal : undefined}
                />
              </Tabs.Content>
            ))}
          </Tabs>

          <OutputPanel
            tab={tab}
            onTabChange={setTab}
            run={run}
            running={running}
            problems={allProblems}
            onReveal={({ file, problem }) => {
              openFile(file.id);
              setReveal({
                file: file.id,
                line: problem.line,
                column: problem.column,
                key: (reveal?.key ?? 0) + 1,
              });
            }}
          />
        </section>
      </div>

      <RestoreDialog
        version={restoring}
        current={current.number}
        unsaved={dirty}
        onOpenChange={(next) => !next && setRestoring(undefined)}
        onConfirm={restore}
      />
    </div>
  );
}

/**
 * Code editor (Inset direction): a script that runs in an Orbit workflow, edited on the raised
 * page beside the workspace sidebar. The header names the script and holds its save state,
 * versions, Run test and Save (the one filled button); the step's files sit in a narrow column
 * beside one bordered box, the editor over its output and problems.
 */
export default function CodeEditorBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <CodeEditorSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#automations">Automations</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#lead-scoring">Lead scoring</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>score-lead.js</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card when the window is short; at full size the editor
            takes the height and scrolls inside itself. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <EditorPage />
        </div>
      </main>
    </div>
  );
}
