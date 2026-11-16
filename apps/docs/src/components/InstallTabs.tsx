import { RiArrowDownSLine, RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { Button, IconButton, Tabs } from '@wideset/react';
import { useState } from 'react';

import type { CodeLang } from '../lib/highlight';
import type { ManualFile, ManualFiles } from '../lib/registry';
import { CodeBlock } from './CodeBlock';
import TabRow from './TabRow';

const langOf = (path: string): CodeLang => (path.endsWith('.tsx') ? 'tsx' : 'ts');
const nameOf = (path: string) => path.split('/').pop() ?? path;

/** A long file shows its first screen; the rest opens on request, the copy button copies all. */
const FileCode = ({ file }: { file: ManualFile }) => {
  const [open, setOpen] = useState(false);
  const long = file.content.split('\n').length > 18;
  return (
    <div>
      <p className="mb-ws-5 font-mono typography-body-sm text-ws-static-subtle">{file.path}</p>
      <div className={`relative ${long && !open ? 'max-h-[22rem] overflow-hidden' : ''}`}>
        <CodeBlock code={file.content} lang={langOf(file.path)} />
        {long && !open && (
          <div className="docs-fade absolute inset-x-0 bottom-0 flex h-ws-24 items-end justify-center pb-ws-7">
            <Button size="sm" preset="border" variant="secondary" onClick={() => setOpen(true)}>
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/** A required file as one row: its path and a copy button; the code opens on request. */
const FileRow = ({ file }: { file: ManualFile }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <li className="border-b border-ws-static-base last:border-b-0">
      <div className="flex items-center gap-ws-5 py-ws-5 pr-ws-5 pl-ws-9">
        {/* ds-exempt: a disclosure row in a file list; Accordion's trigger cannot hold the copy button beside it. */}
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-ws-5 text-left"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <RiArrowDownSLine
            className={`size-ws-9 shrink-0 text-ws-static-subtle transition-transform ${open ? '' : '-rotate-90'}`}
            aria-hidden="true"
          />
          <span className="truncate font-mono typography-body-sm text-ws-static-base">
            {file.path}
          </span>
        </button>
        <IconButton
          icon={copied ? RiCheckLine : RiFileCopyLine}
          size="sm"
          preset="ghost"
          variant="secondary"
          aria-label={copied ? 'Copied' : `Copy ${nameOf(file.path)}`}
          onClick={copy}
        />
      </div>
      {open && (
        <div className="px-ws-7 pb-ws-7">
          <CodeBlock code={file.content} lang={langOf(file.path)} />
        </div>
      )}
    </li>
  );
};

/** One step on the vertical line: a numbered dot, the title, and what to do. */
const Step = ({
  n,
  title,
  last = false,
  children,
}: {
  n: number;
  title: string;
  last?: boolean;
  children?: React.ReactNode;
}) => (
  <li className="relative flex gap-ws-9">
    {!last && (
      <span
        aria-hidden="true"
        className="absolute top-ws-14 bottom-0 left-[13px] w-px bg-ws-static-alpha-subtle"
      />
    )}
    <span className="grid size-ws-13 shrink-0 place-items-center rounded-ws-control-full border border-ws-static-base typography-caption-strong-md text-ws-static-strong">
      {n}
    </span>
    <div className={`min-w-0 flex-1 ${last ? '' : 'pb-ws-14'}`}>
      <h3 className="pt-ws-3 typography-label-strong-sm text-ws-static-strong">{title}</h3>
      {children && <div className="mt-ws-7">{children}</div>}
    </div>
  </li>
);

/**
 * Two ways in, as the CLI is the recommended one: the command, or every file it would write
 * to copy by hand — first the component's own, one tab each, then the shared helpers it
 * imports, which other components reuse.
 */
const InstallTabs = ({ id, files }: { id: string; files: ManualFiles }) => (
  <Tabs defaultValue="cli" divider={false}>
    <TabRow>
      <Tabs.List>
        <Tabs.Item value="cli">
          <Tabs.Label>CLI</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="manual">
          <Tabs.Label>Manual</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
    </TabRow>
    <Tabs.Content value="cli" className="pt-ws-8">
      <CodeBlock code={`npx wideset add ${id}`} lang="bash" prompt />
    </Tabs.Content>
    <Tabs.Content value="manual" className="pt-ws-9">
      <ol>
        <Step n={1} title="Copy component files">
          <Tabs defaultValue={files.own[0]?.path} size="sm" divider={false}>
            <TabRow>
              <Tabs.List>
                {files.own.map((file) => (
                  <Tabs.Item key={file.path} value={file.path}>
                    <Tabs.Label>{nameOf(file.path)}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>
            </TabRow>
            {files.own.map((file) => (
              <Tabs.Content key={file.path} value={file.path} className="pt-ws-7">
                <FileCode file={file} />
              </Tabs.Content>
            ))}
          </Tabs>
        </Step>
        {files.shared.length > 0 && (
          <Step n={2} title="Make sure you have the required dependencies">
            <p className="mb-ws-7 typography-body-md leading-ws-600 text-ws-static-subtle">
              Shared helpers the component imports. Copy any you do not have yet; other components
              use them too.
            </p>
            <ul className="overflow-hidden rounded-ws-container-lg border border-ws-static-base">
              {files.shared.map((file) => (
                <FileRow key={file.path} file={file} />
              ))}
            </ul>
          </Step>
        )}
        <Step
          n={files.shared.length > 0 ? 3 : 2}
          title="Make sure the import paths match your project setup, if they have been changed from default"
          last
        />
      </ol>
    </Tabs.Content>
  </Tabs>
);

export default InstallTabs;
