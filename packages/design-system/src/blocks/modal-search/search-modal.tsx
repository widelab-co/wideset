import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
  RiFileLine,
  RiSearchLine,
  RiUserLine,
} from '@remixicon/react';
import { Button, Modal, Tabs, TextInput } from '@wideset/react';
import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { Hint, Key } from './keyboard-hints';
import { type SearchResult, SearchResultRow } from './search-result';

type Scope = 'all' | 'files' | 'people';

const SCOPES = [
  { value: 'all', label: 'All' },
  { value: 'files', label: 'Files', icon: RiFileLine },
  { value: 'people', label: 'People', icon: RiUserLine },
] as const;

const inScope = (result: SearchResult, scope: Scope) =>
  scope === 'all' || (scope === 'people') === (result.kind === 'person');

type SearchModalProps = {
  /** Everything search looks through, most relevant first. */
  index: SearchResult[];
  /** Names what is searched, for the dialog's title and the field's label. */
  workspace: string;
  initialQuery?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Enter on the highlighted result, or a click on any. */
  onOpenResult: (result: SearchResult) => void;
};

/**
 * Figma's Modal `Type=Search`: search across the workspace. The field keeps the focus the whole
 * time: typing filters the results and the counts on the tabs, the arrow keys move the highlight
 * (the field points at it for screen readers), Enter opens it and Esc closes. The results keep
 * the height of five rows, so the modal does not jump while the list shrinks and grows.
 */
export function SearchModal({
  index,
  workspace,
  initialQuery = '',
  open,
  onOpenChange,
  onOpenResult,
}: SearchModalProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<Scope>('all');
  const [active, setActive] = useState(0);

  const term = query.trim();
  const found = index.filter((result) => result.title.toLowerCase().includes(term.toLowerCase()));
  const shown = found.filter((result) => inScope(result, scope));
  const current = shown[active];
  const optionId = (result: SearchResult) => `${id}-${result.id}`;

  const search = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = shown[active + (event.key === 'ArrowDown' ? 1 : -1)];
      if (!next) return;
      setActive(shown.indexOf(next));
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && event.target === input.current && current) {
      onOpenResult(current);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* No X: the footer names the way out, and a click outside closes it too. */}
      <Modal.Content
        showCloseButton={false}
        aria-describedby={undefined}
        onKeyDown={onKeyDown}
        // Radix would select the query; Figma opens with the caret after it.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          input.current?.focus();
        }}
      >
        <Modal.Title className="sr-only">Search {workspace}</Modal.Title>

        <div className="gap-ws-7 px-ws-11 pt-ws-11 pb-ws-7 flex items-center">
          <TextInput
            ref={input}
            size="sm"
            className="min-w-0 flex-1"
            value={query}
            onChange={(event) => search(event.target.value)}
          >
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiSearchLine} />
            </TextInput.Prefix>
            <TextInput.Input
              type="search"
              placeholder="Search people and files"
              aria-label={`Search ${workspace}`}
              role="combobox"
              aria-expanded
              aria-controls={`${id}-results`}
              aria-activedescendant={current && optionId(current)}
            />
          </TextInput>
          <Button
            size="sm"
            variant="secondary"
            preset="border"
            onClick={() => {
              search('');
              input.current?.focus();
            }}
          >
            Clear
          </Button>
        </div>

        <Tabs
          value={scope}
          onValueChange={(value) => {
            setScope(value as Scope);
            setActive(0);
          }}
          divider={false}
          className="min-h-0"
        >
          {/* The line under the tabs is the header's own, Static/Stroke/Base, edge to edge. */}
          <div className="border-ws-static-base px-ws-11 pt-ws-1 border-b">
            <Tabs.List aria-label="Results by type">
              {SCOPES.map((item) => (
                <Tabs.Item key={item.value} value={item.value}>
                  {'icon' in item && <Tabs.Icon icon={item.icon} />}
                  <Tabs.Label>{item.label}</Tabs.Label>
                  {/* The tabs count results, so they carry a count, as in Figma. */}
                  <Tabs.Count>
                    {found.filter((result) => inScope(result, item.value)).length}
                  </Tabs.Count>
                </Tabs.Item>
              ))}
            </Tabs.List>
          </div>

          {/*
            Five rows tall, as drawn: the list scrolls between its own 20px margins, so a resting
            list ends on a whole row, not on the line of the next one.
          */}
          <Tabs.Content
            value={scope}
            className="my-ws-11 px-ws-11 h-[22.375rem] shrink overflow-y-auto"
          >
            {shown.length === 0 ? (
              <p role="status" className="py-ws-5 typography-body-md text-ws-static-subtle">
                {term ? `No results for “${term}”.` : 'Nothing here yet.'}
              </p>
            ) : (
              <ul id={`${id}-results`} role="listbox" aria-label="Results">
                {shown.map((result, position) => (
                  <SearchResultRow
                    key={result.id}
                    id={optionId(result)}
                    result={result}
                    query={term}
                    active={position === active}
                    onActivate={() => setActive(position)}
                    onOpen={() => onOpenResult(result)}
                  />
                ))}
              </ul>
            )}
          </Tabs.Content>
        </Tabs>

        <Modal.Footer variant="extension">
          <div className="gap-ws-12 flex items-center">
            <Hint
              keys={
                <span className="gap-ws-3 flex">
                  <Key icon={RiArrowUpSLine} name="Up arrow" />
                  <Key icon={RiArrowDownSLine} name="Down arrow" />
                </span>
              }
            >
              Navigate
            </Hint>
            <Hint keys={<Key icon={RiArrowLeftLine} name="Left arrow" />}>Return to parent</Hint>
          </div>
          <Hint keys={<Key>esc</Key>}>Close</Hint>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
