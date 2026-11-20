import { RiSearchLine } from '@remixicon/react';
import { IconButton, Modal, Search } from '@wideset/react';
import { useEffect, useState } from 'react';

import { listKeys } from './listKeys';

export type SearchItem = { title: string; href: string; group: string };

/**
 * Search across the docs: a dialog listing every page, component and block, opened with ⌘K /
 * Ctrl+K from anywhere, or with the header search button
 * (the bar has no field of its own; each sidebar filters its own list). Type to narrow, then
 * Enter opens the first result, or the arrow keys move through them; the results are plain links.
 */
const SearchPalette = ({ items }: { items: SearchItem[] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((was) => !was);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const needle = query.trim().toLowerCase();
  const matches = (
    needle ? items.filter((item) => item.title.toLowerCase().includes(needle)) : items
  ).slice(0, 12);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <IconButton
          icon={RiSearchLine}
          size="sm"
          preset="ghost"
          variant="secondary"
          aria-label="Search"
        />
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body onKeyDown={listKeys('a[href]')}>
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, components and blocks…"
          />
          <ul className="mt-ws-6 flex flex-col gap-ws-2">
            {matches.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex h-ws-15 items-center justify-between rounded-ws-control-lg px-ws-7 typography-body-md text-ws-static-strong outline-ws-dynamic-primary-strong-default hover:bg-ws-static-alpha-subtle focus-visible:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible"
                >
                  <span>{item.title}</span>
                  <span className="typography-body-sm text-ws-static-subtle">{item.group}</span>
                </a>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="px-ws-7 py-ws-5 typography-body-md text-ws-static-subtle">
                Nothing matches.
              </li>
            )}
          </ul>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SearchPalette;
