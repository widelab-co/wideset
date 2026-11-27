import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { listKeys } from './listKeys';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PAGES = ['Overview', 'Accordion', 'Button', 'Card'];

let container: HTMLDivElement;
let root: Root;
let opened: string[];

/** A filter field over a list of links, like the sidebar. */
const renderList = (pages = PAGES, field = true) => {
  act(() => {
    root.render(
      createElement(
        'div',
        { onKeyDown: listKeys('a[href]') },
        field && createElement('input', { 'aria-label': 'Filter' }),
        createElement(
          'nav',
          null,
          pages.map((page) => createElement('a', { key: page, href: `#${page}` }, page)),
        ),
      ),
    );
  });
};

const field = () => container.querySelector('input')!;
const link = (name: string) =>
  [...container.querySelectorAll('a')].find((item) => item.textContent === name)!;
const focused = () => document.activeElement?.textContent || document.activeElement?.tagName;

/** Presses a key on the focused element; returns whether the list handled it. */
const press = (key: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  act(() => {
    document.activeElement!.dispatchEvent(event);
  });
  return event.defaultPrevented;
};

beforeEach(() => {
  // jsdom lays nothing out.
  Element.prototype.scrollIntoView = vi.fn();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  opened = [];
  container.addEventListener('click', (event) => {
    event.preventDefault();
    opened.push((event.target as HTMLElement).textContent!);
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('arrow keys', () => {
  it('move from the field into the list and back', () => {
    renderList();
    field().focus();
    press('ArrowDown');
    expect(focused()).toBe('Overview');
    press('ArrowUp');
    expect(document.activeElement).toBe(field());
  });

  it('move one link at a time', () => {
    renderList();
    link('Accordion').focus();
    press('ArrowDown');
    expect(focused()).toBe('Button');
  });

  it('stop at the last link without scrolling the page', () => {
    renderList();
    link('Card').focus();
    expect(press('ArrowDown')).toBe(true);
    expect(focused()).toBe('Card');
  });
});

describe('Home and End', () => {
  it('jump to the first and the last link', () => {
    renderList();
    link('Button').focus();
    press('Home');
    expect(focused()).toBe('Overview');
    press('End');
    expect(focused()).toBe('Card');
  });

  it('move the caret in the field', () => {
    renderList();
    field().focus();
    expect(press('End')).toBe(false);
    expect(document.activeElement).toBe(field());
  });

  it('work in a list without a field', () => {
    renderList(PAGES, false);
    link('Button').focus();
    press('Home');
    expect(focused()).toBe('Overview');
  });
});

describe('Enter', () => {
  it('in the field opens the first link', () => {
    renderList(['Button', 'Card']);
    field().focus();
    press('Enter');
    expect(opened).toEqual(['Button']);
  });

  it('in the field does nothing when no link matches', () => {
    renderList([]);
    field().focus();
    expect(press('Enter')).toBe(false);
    expect(opened).toEqual([]);
  });
});

describe('keys the list leaves alone', () => {
  it('ignores Enter while an IME composes text', () => {
    renderList();
    field().focus();
    expect(press('Enter', { isComposing: true })).toBe(false);
    expect(opened).toEqual([]);
  });

  it('ignores shortcuts with a modifier', () => {
    renderList();
    link('Accordion').focus();
    expect(press('ArrowDown', { ctrlKey: true })).toBe(false);
    expect(focused()).toBe('Accordion');
  });

  it('ignores Tab', () => {
    renderList();
    field().focus();
    expect(press('Tab')).toBe(false);
  });
});
