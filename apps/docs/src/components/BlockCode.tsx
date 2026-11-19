import { RiSearchLine } from '@remixicon/react';
import { ListItem, Select, Sidebar, TextInput } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import type { BlockFile } from '../lib/blocks';
import { Code } from './parts';

/** More files than this, and the list gets a filter. */
const FILTER_FROM = 12;

/** `data.ts`, `*-data.ts` (`session-data.ts`) and `*.assets.ts`. */
const isData = (name: string) => /(^|-)data\.ts$/.test(name) || name.endsWith('.assets.ts');
const groupsOf = (files: BlockFile[]) =>
  [
    { label: 'Entry', files: files.filter((file) => file.name === 'index.tsx') },
    {
      label: 'Parts',
      files: files.filter((file) => file.name !== 'index.tsx' && !isData(file.name)),
    },
    { label: 'Data', files: files.filter((file) => isData(file.name)) },
  ].filter((group) => group.files.length > 0);

const langOf = (name: string) => (name.endsWith('.ts') ? 'ts' : 'tsx');

const fileFromAddress = (files: BlockFile[]) => {
  const asked = new URLSearchParams(location.search).get('file');
  return files.some((file) => file.name === asked) ? asked! : files[0].name;
};

const addressOf = (name: string, first: string) => {
  const url = new URL(location.href);
  url.searchParams.set('tab', 'code');
  if (name === first) url.searchParams.delete('file');
  else url.searchParams.set('file', name);
  url.hash = '';
  return url;
};

/**
 * A block's code, one file at a time: the folder's files beside the code (Entry, Parts, Data; a
 * filter when there are many), a Select above it in a narrow window. The file is in the address
 * (`?tab=code&file=Header.tsx`; the entry file has none), so Back and Forward move between files
 * and a file can be linked.
 */
const BlockCode = ({ files }: { files: BlockFile[] }) => {
  const first = files[0].name;
  const [current, setCurrent] = useState(first);
  const [query, setQuery] = useState('');
  const selectId = useId();
  useEffect(() => {
    const sync = () => {
      const name = fileFromAddress(files);
      const asked = new URLSearchParams(location.search).get('file');
      if (asked !== null && asked !== name) {
        const url = new URL(location.href);
        url.searchParams.delete('file');
        history.replaceState(null, '', url);
      }
      setCurrent(name);
    };
    sync();
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, [files]);
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
  const groups = groupsOf(files.filter((item) => item.name.toLowerCase().includes(needle)));

  if (files.length === 1)
    return <Code code={file.code} lang={langOf(file.name)} label={file.name} />;

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
            {groupsOf(files)
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
                <Sidebar.SectionHeader>{group.label}</Sidebar.SectionHeader>
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
                      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
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

      <Code key={file.name} code={file.code} lang={langOf(file.name)} label={file.name} />
    </div>
  );
};

export default BlockCode;
