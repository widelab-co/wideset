import { Children, type ReactNode } from 'react';

import type { SpreadsheetAlign } from './Spreadsheet.types';
import { spreadsheetCellContentVariants } from './Spreadsheet.variants';

/** Every cell part marks its element with this attribute; its value is the cell's id. */
export const CELL_ATTRIBUTE = 'data-spreadsheet-cell';
export const CELL_SELECTOR = `[${CELL_ATTRIBUTE}]`;

/** What a click or `focus()` can reach: the cells, and the links and controls inside them. */
const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [contenteditable="true"], [tabindex]';

/**
 * Controls that do not use the arrow keys themselves: with focus on one, the arrows still move
 * through the grid. Text fields, selects and any other widget keep their keys.
 */
const ARROW_FREE =
  'a[href], button, input[type="checkbox"], [role="button"], [role="checkbox"], [role="link"], [role="switch"]';

/** What `root` holds that can take focus, in document order (some engines group a selector list). */
const focusables = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );

export const firstControl = (cell: HTMLElement) => focusables(cell)[0] ?? null;

/** What Tab would stop on inside `root`, in document order. */
export const tabbables = (root: HTMLElement) => focusables(root).filter((el) => el.tabIndex >= 0);

export const usesArrowKeys = (element: HTMLElement) => !element.matches(ARROW_FREE);

/** The column a cell starts in, counting the spans before it. */
export const columnOf = (cell: HTMLTableCellElement) => {
  let column = 0;
  for (let prev = cell.previousElementSibling; prev; prev = prev.previousElementSibling)
    column += (prev as HTMLTableCellElement).colSpan;
  return column;
};

/** The cell of a row that covers a column, or `null` past the row's end. */
export const cellAt = (row: HTMLTableRowElement, column: number) => {
  let end = 0;
  for (const cell of Array.from(row.cells)) {
    end += cell.colSpan;
    if (column < end) return cell;
  }
  return null;
};

type NavigationKey = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey'>;

/**
 * The cell a navigation key moves to from `cell`, or `null` for any other key. Arrows move one
 * cell and stop at the edges; Home and End go to the ends of the row, and with Ctrl or Cmd to the
 * first and last cell of the grid; Page Up and Page Down move by `pageRows`. The header rows are
 * rows like any other. Row spans are not followed.
 */
export const cellFor = (
  table: HTMLTableElement,
  cell: HTMLTableCellElement,
  { key, ctrlKey, metaKey }: NavigationKey,
  pageRows: number,
): HTMLTableCellElement | null => {
  const { rows } = table;
  const row = cell.parentElement as HTMLTableRowElement;
  const column = columnOf(cell);
  const inRow = (index: number) => {
    const target = rows[Math.min(Math.max(index, 0), rows.length - 1)];
    return cellAt(target, column) ?? target.cells[target.cells.length - 1] ?? null;
  };
  const wholeGrid = ctrlKey || metaKey;

  switch (key) {
    case 'ArrowLeft':
      return column > 0 ? cellAt(row, column - 1) : null;
    case 'ArrowRight':
      return cellAt(row, column + cell.colSpan);
    case 'ArrowUp':
      return inRow(row.rowIndex - 1);
    case 'ArrowDown':
      return inRow(row.rowIndex + 1);
    case 'PageUp':
      return inRow(row.rowIndex - pageRows);
    case 'PageDown':
      return inRow(row.rowIndex + pageRows);
    case 'Home':
      return (wholeGrid ? rows[0] : row).cells[0] ?? null;
    case 'End': {
      const target = wholeGrid ? rows[rows.length - 1] : row;
      return target.cells[target.cells.length - 1] ?? null;
    }
    default:
      return null;
  }
};

/** How many rows fit under the sticky header: the step of Page Up and Page Down. */
export const rowsPerPage = (
  scroller: HTMLElement | null,
  table: HTMLTableElement,
  cell: HTMLElement,
) => {
  const rows = Math.floor(
    ((scroller?.clientHeight ?? 0) - (table.tHead?.offsetHeight ?? 0)) / cell.offsetHeight,
  );
  return Number.isFinite(rows) && rows > 0 ? rows : 1;
};

const isText = (node: ReactNode) => typeof node === 'string' || typeof node === 'number';

/**
 * A cell's content, and the title that shows its full text. Plain text stays a text node, so the
 * cell truncates it itself, and becomes the title. Anything else is laid out in one centred row,
 * 4px apart, as Figma's cell is, with each run of text in a span that can truncate: `<Avatar />
 * Adam Smith` keeps the avatar and shortens the name.
 */
export const cellContent = (children: ReactNode, align: SpreadsheetAlign) => {
  const nodes = Children.toArray(children);
  if (nodes.every(isText)) return { content: children, title: nodes.join('') || undefined };

  const parts: ReactNode[] = [];
  let text: ReactNode[] = [];
  const endText = () => {
    if (!text.length) return;
    parts.push(
      <span key={`text-${parts.length}`} className="truncate">
        {text.join('')}
      </span>,
    );
    text = [];
  };
  for (const node of nodes) {
    if (isText(node)) text.push(node);
    else {
      endText();
      parts.push(node);
    }
  }
  endText();

  return {
    content: <div className={spreadsheetCellContentVariants({ align })}>{parts}</div>,
    title: undefined,
  };
};
