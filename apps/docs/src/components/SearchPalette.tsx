import { Modal, Search } from '@wideset/react';
import { useEffect, useState } from 'react';

import type { SearchItem } from '../lib/search';

export type { SearchItem };

/**
 * Search across the docs: a dialog listing every page and component. Type to narrow, click to
 * go. It opens on ⌘K / Ctrl+K and on `wideset:search-open`, the event both the shared site
 * header and the stand-alone top bar's trigger send (lib/site-contract.ts), so the page has one
 * palette whichever header it shows.
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
    const pending = window as Window & { __widesetSearchPending?: boolean };
    const onOpen = () => {
      pending.__widesetSearchPending = false;
      setOpen(true);
    };
    // Pressed before this island hydrated (lib/site-contract.ts remembered it).
    if (pending.__widesetSearchPending) onOpen();
    window.addEventListener('keydown', onKey);
    document.addEventListener('wideset:search-open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('wideset:search-open', onOpen);
    };
  }, []);

  const needle = query.trim().toLowerCase();
  const matches = (
    needle ? items.filter((item) => item.title.toLowerCase().includes(needle)) : items
  ).slice(0, 12);

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Search</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Search
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components and pages…"
            />
            <ul className="mt-ws-6 flex flex-col gap-ws-2">
              {matches.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex h-ws-15 items-center justify-between rounded-ws-control-lg px-ws-7 typography-body-md text-ws-static-strong hover:bg-ws-static-alpha-subtle"
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
    </>
  );
};

export default SearchPalette;
