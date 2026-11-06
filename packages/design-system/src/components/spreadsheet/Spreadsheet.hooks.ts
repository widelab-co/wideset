import {
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import { useSpreadsheetContext } from './Spreadsheet.context';
import {
  CELL_ATTRIBUTE,
  CELL_SELECTOR,
  cellFor,
  firstControl,
  rowsPerPage,
  tabbables,
  usesArrowKeys,
} from './Spreadsheet.logic';

type ActiveCell = { id: string | null; selected: boolean };

/**
 * Which cell is the grid's one tab stop, and whether the user has selected it yet (the first tab
 * stop is not selected until the user reaches it). A store rather than state: each cell reads its
 * own slice, so moving the active cell re-renders two cells instead of the whole grid.
 */
export const createActiveCellStore = () => {
  let active: ActiveCell = { id: null, selected: false };
  const listeners = new Set<() => void>();

  return {
    get: () => active,
    set: (id: string | null, selected: boolean) => {
      if (id === active.id && selected === active.selected) return;
      active = { id, selected };
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export type ActiveCellStore = ReturnType<typeof createActiveCellStore>;

const findCell = (table: HTMLTableElement, id: string | null) =>
  id === null ? null : table.querySelector<HTMLElement>(`[${CELL_ATTRIBUTE}="${id}"]`);

/** The roving tabindex and the selected state of one cell part. */
export const useSpreadsheetCell = () => {
  const { store } = useSpreadsheetContext();
  const id = useId();
  // 0: another cell is active, 1: this cell is the tab stop, 2: … and it is selected.
  const state = useSyncExternalStore(
    store.subscribe,
    () => {
      const active = store.get();
      return active.id !== id ? 0 : active.selected ? 2 : 1;
    },
    () => 0,
  );

  return { [CELL_ATTRIBUTE]: id, tabIndex: state > 0 ? 0 : -1, 'aria-selected': state === 2 };
};

/**
 * Keeps the grid in step with its rows as they come and go: one cell is always the tab stop, the
 * first `stickyColumns` cells of every row stay pinned (each at the width of the pinned cells
 * before it, measured on the first row), and `focus()` scrolls a cell clear of the pinned header
 * and columns.
 */
export const useSpreadsheetLayout = (
  scrollerRef: RefObject<HTMLDivElement | null>,
  tableRef: RefObject<HTMLTableElement | null>,
  stickyColumns: number,
  store: ActiveCellStore,
) => {
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const table = tableRef.current;
    if (!scroller || !table) return;

    const sync = () => {
      if (!findCell(table, store.get().id)) {
        const first = table.querySelector<HTMLElement>(CELL_SELECTOR);
        store.set(first?.getAttribute(CELL_ATTRIBUTE) ?? null, false);
      }

      const widths = Array.from(table.rows[0]?.cells ?? [])
        .slice(0, stickyColumns)
        .map((cell) => cell.getBoundingClientRect().width);
      for (const row of Array.from(table.rows)) {
        let left = 0;
        Array.from(row.cells).forEach((cell, index) => {
          if (index < stickyColumns) {
            cell.setAttribute('data-sticky', '');
            cell.style.left = `${left}px`;
            left += widths[index] ?? 0;
          } else if (cell.hasAttribute('data-sticky')) {
            cell.removeAttribute('data-sticky');
            cell.style.left = '';
          }
        });
      }

      scroller.style.scrollPaddingTop = `${table.tHead?.offsetHeight ?? 0}px`;
      scroller.style.scrollPaddingLeft = `${widths.reduce((sum, width) => sum + width, 0)}px`;
    };

    sync();
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(table);
    // Rows and cells added or removed; what changes inside a cell does not move the grid.
    const mutationObserver = new MutationObserver((records) => {
      if (
        records.some(
          ({ target }) =>
            target === table || target.parentNode === table || target.nodeName === 'TR',
        )
      )
        sync();
    });
    mutationObserver.observe(table, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollerRef, tableRef, stickyColumns, store]);
};

/**
 * Keyboard and focus for the grid (the APG grid pattern). Arrows, Home and End, Ctrl/Cmd+Home and
 * End, Page Up and Page Down move the active cell, which takes focus. Enter or F2 moves focus to
 * the first control in the cell; Escape or F2 brings it back. The grid is one tab stop: Tab leaves
 * it whatever the cells hold, and tabbing back returns to the cell the user left.
 */
export const useSpreadsheetKeyboard = (
  scrollerRef: RefObject<HTMLDivElement | null>,
  store: ActiveCellStore,
) => {
  // Whether the focus now arriving comes from a Tab press. Read on the document, which hears the
  // key before the browser moves focus.
  const tabbing = useRef(false);
  // True while the grid hands focus to its first or last control, so that the browser's own Tab
  // continues from there out of the grid.
  const leaving = useRef(false);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      tabbing.current = event.key === 'Tab';
    };
    const onPointer = () => {
      tabbing.current = false;
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);

  const onFocus = (event: FocusEvent<HTMLTableElement>) => {
    const table = event.currentTarget;
    const target = event.target as HTMLElement;
    // Focus from a portal (an open menu) reaches the table through React; it is not in a cell.
    const cell = table.contains(target) ? target.closest<HTMLElement>(CELL_SELECTOR) : null;
    if (leaving.current || !cell) return;

    if (tabbing.current && !table.contains(event.relatedTarget as Node | null)) {
      const active = findCell(table, store.get().id);
      if (active && !active.contains(target)) {
        active.focus();
        return;
      }
    }
    store.set(cell.getAttribute(CELL_ATTRIBUTE), true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const table = event.currentTarget;
    const target = event.target as HTMLElement;
    if (event.defaultPrevented || !table.contains(target)) return;
    const cell = target.closest<HTMLTableCellElement>(CELL_SELECTOR);
    if (!cell) return;

    if (event.key === 'Tab') {
      const stops = tabbables(table);
      const edge = event.shiftKey ? stops[0] : stops[stops.length - 1];
      if (edge && edge !== target) {
        leaving.current = true;
        edge.focus({ preventScroll: true });
        leaving.current = false;
      }
      return;
    }

    if (target !== cell) {
      // Focus is on a control inside the cell.
      if (event.key === 'Escape' || event.key === 'F2') {
        event.preventDefault();
        cell.focus();
        return;
      }
      if (usesArrowKeys(target)) return;
    } else if (event.key === 'Enter' || event.key === 'F2') {
      const control = firstControl(cell);
      if (control) {
        event.preventDefault();
        control.focus();
      }
      return;
    } else if (event.key === ' ') {
      // Space would scroll the grid.
      event.preventDefault();
      return;
    }

    // Alt with an arrow is the browser's history shortcut on some systems.
    if (event.altKey) return;
    const next = cellFor(table, cell, event, rowsPerPage(scrollerRef.current, table, cell));
    if (!next) return;
    event.preventDefault();
    next.focus();
  };

  return { onFocus, onKeyDown };
};
