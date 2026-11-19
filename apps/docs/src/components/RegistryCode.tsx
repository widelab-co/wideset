import { RiSearchLine } from '@remixicon/react';
import { ListItem, Select, Sidebar, TextInput } from '@wideset/react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import type { ManualFile } from '../lib/registry';
import { Code } from './parts';

/** More files than this, and the list gets a filter. */
const FILTER_FROM = 12;

/** `data.ts`, `*-data.ts` (`session-data.ts`) and `*.assets.ts`. */
const isData = (name: string) =>
  /(^|-)data\.ts$/.test(name.split('/').pop()!) || name.endsWith('.assets.ts');
type SourceFile = ManualFile & { name: string };

const groupsOf = (files: SourceFile[], entry?: string) =>
  (entry
    ? [
        { label: 'Entry', files: files.filter((file) => file.name === entry) },
        {
          label: 'Parts',
          files: files.filter((file) => file.name !== entry && !isData(file.name)),
        },
        { label: 'Data', files: files.filter((file) => isData(file.name)) },
      ]
    : [{ label: 'Source files', files }]
  ).filter((group) => group.files.length > 0);

const langOf = (name: string) => (name.endsWith('.ts') ? 'ts' : 'tsx');

const addressOf = (name: string, first: string) => {
  const url = new URL(location.href);
  url.searchParams.set('tab', 'code');
  if (name === first) url.searchParams.delete('file');
  else url.searchParams.set('file', name);
  url.hash = '';
  return url;
};

/**
 * Installable files with deep links, a filter for larger folders and a Select on narrow screens.
 * Blocks supply an entry filename to group the rest into parts and data.
 */
const RegistryCode = ({
  files: source,
  directory,
  entry,
}: {
  files: ManualFile[];
  directory: string;
  entry?: string;
}) => {
  const files = useMemo(
    () =>
      source.map((file) => ({
        ...file,
        name: file.path.startsWith(directory + '/')
          ? file.path.slice(directory.length + 1)
          : file.path,
      })),
    [source, directory],
  );
  const first = files.find((file) => file.name === entry)?.name ?? files[0].name;
  const [current, setCurrent] = useState(first);
  const [query, setQuery] = useState('');
  const selectId = useId();
  useEffect(() => {
    const sync = () => {
      const query = new URLSearchParams(location.search);
      if (query.get('tab') !== 'code') return;
      const asked = query.get('file');
      const name = files.find((file) => file.name === asked)?.name ?? first;
      if (asked !== null && asked !== name) {
        const url = new URL(location.href);
        url.searchParams.delete('file');
        history.replaceState(history.state, '', url);
      }
      setCurrent(name);
    };
    sync();
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, [files, first]);
  // The open file's row in view in the list (a deep link, Back, a file far down), scrolling the
  // list alone: scrollIntoView would move the page too. Again when the list gets its size, as
  // when the Code tab opens or the window widens to `lg`.
  const listRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const viewport = list?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!list || !viewport) return;
    const reveal = () => {
      const row = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!row || viewport.clientHeight === 0) return;
      const top =
        row.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
      const bottom = top + row.offsetHeight;
      if (top < viewport.scrollTop || bottom > viewport.scrollTop + viewport.clientHeight)
        viewport.scrollTop = top - (viewport.clientHeight - row.offsetHeight) / 2;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [current]);
  const open = (name: string) => {
    if (name === current) return;
    history.pushState(null, '', addressOf(name, first));
    setCurrent(name);
  };
  const file = files.find((item) => item.name === current) ?? files[0];
  const needle = query.trim().toLowerCase();
  const groups = groupsOf(
    files.filter((item) => item.name.toLowerCase().includes(needle)),
    entry,
  );

  if (files.length === 1)
    return <Code code={file.content} lang={langOf(file.name)} label={file.path} />;

  return (
    <div className="grid gap-ws-9 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="lg:hidden">
        <label htmlFor={selectId} className="sr-only">
          File
        </label>
        <Select value={current} onValueChange={open}>
          <Select.Trigger id={selectId} size="sm" className="w-full">
            <span className="truncate font-mono">{current}</span>
          </Select.Trigger>
          <Select.Content>
            {groupsOf(files, entry)
              .flatMap((group) => group.files)
              .map((item) => (
                <Select.Option key={item.name} value={item.name} textValue={item.name}>
                  <ListItem.Label>{item.name}</ListItem.Label>
                </Select.Option>
              ))}
          </Select.Content>
        </Select>
      </div>

      <Sidebar className="sticky top-ws-21 hidden max-h-[calc(100dvh-2*var(--spacing-ws-21))] w-full self-start rounded-ws-container-md border border-ws-static-subtle bg-transparent lg:flex">
        {files.length > FILTER_FROM && (
          <Sidebar.Header>
            <TextInput
              size="sm"
              className="w-full"
              value={query}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
              }
            >
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiSearchLine} />
              </TextInput.Prefix>
              <TextInput.Input
                type="search"
                placeholder={`Filter ${files.length} files`}
                aria-label="Filter files"
              />
            </TextInput>
          </Sidebar.Header>
        )}
        <Sidebar.Section scrollable>
          <nav ref={listRef} aria-label="Files" className="flex flex-col gap-ws-7">
            {groups.map((group) => (
              <div
                key={group.label}
                role="group"
                aria-label={group.label}
                className="flex flex-col"
              >
                {entry && <Sidebar.SectionHeader>{group.label}</Sidebar.SectionHeader>}
                {group.files.map((item) => (
                  <Sidebar.Item
                    key={item.name}
                    href={
                      item.name === first
                        ? '?tab=code'
                        : `?tab=code&file=${encodeURIComponent(item.name)}`
                    }
                    label={<span className="truncate font-mono">{item.name}</span>}
                    active={item.name === current}
                    onClick={(event: React.MouseEvent) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      open(item.name);
                    }}
                  />
                ))}
              </div>
            ))}
            {groups.length === 0 && (
              <p className="px-ws-5 typography-body-sm text-ws-static-subtle">No file matches.</p>
            )}
          </nav>
        </Sidebar.Section>
      </Sidebar>

      <Code key={file.name} code={file.content} lang={langOf(file.name)} label={file.path} />
    </div>
  );
};

export default RegistryCode;
