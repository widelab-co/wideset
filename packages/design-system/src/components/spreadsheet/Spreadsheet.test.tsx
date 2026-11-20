import { RiHashtag } from '@remixicon/react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../checkbox/Checkbox';
import { SegmentedControl } from '../segmented-control/SegmentedControl';
import { Spreadsheet } from './Spreadsheet';
import type { SpreadsheetProps } from './Spreadsheet.types';

const clients = [
  ['Tech Nova', '23', 'Brazil'],
  ['Eco Solutions', '37', 'Japan'],
  ['Skyline Innovations', '15', 'Nigeria'],
];

/** Four columns (row number, name, customers, country) and three rows under the header. */
const Clients = (props: Partial<SpreadsheetProps>) => (
  <Spreadsheet aria-label="Clients" {...props}>
    <Spreadsheet.Head>
      <Spreadsheet.Row>
        <Spreadsheet.ColumnHeader aria-label="Row" />
        <Spreadsheet.ColumnHeader>Client name</Spreadsheet.ColumnHeader>
        <Spreadsheet.ColumnHeader>Customers</Spreadsheet.ColumnHeader>
        <Spreadsheet.ColumnHeader>Country</Spreadsheet.ColumnHeader>
      </Spreadsheet.Row>
    </Spreadsheet.Head>
    <Spreadsheet.Body>
      {clients.map(([name, customers, country], index) => (
        <Spreadsheet.Row key={name}>
          <Spreadsheet.RowHeader>{index}</Spreadsheet.RowHeader>
          <Spreadsheet.Cell>{name}</Spreadsheet.Cell>
          <Spreadsheet.Cell align="right">{customers}</Spreadsheet.Cell>
          <Spreadsheet.Cell>{country}</Spreadsheet.Cell>
        </Spreadsheet.Row>
      ))}
    </Spreadsheet.Body>
  </Spreadsheet>
);

const cell = (name: string) => screen.getByRole('gridcell', { name });

describe('Spreadsheet', () => {
  describe('Rendering', () => {
    it('renders a grid of column headers, row headers and cells', () => {
      render(<Clients />);
      expect(screen.getByRole('grid', { name: 'Clients' })).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
      expect(screen.getAllByRole('rowheader')).toHaveLength(3);
      expect(screen.getAllByRole('gridcell')).toHaveLength(9);
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('names the grid, not its scroll container', () => {
      render(<Clients aria-labelledby="title" aria-describedby="hint" />);
      const grid = screen.getByRole('grid');
      expect(grid.tagName).toBe('TABLE');
      expect(grid).toHaveAttribute('aria-label', 'Clients');
      expect(grid).toHaveAttribute('aria-labelledby', 'title');
      expect(grid).toHaveAttribute('aria-describedby', 'hint');
      expect(grid.parentElement).not.toHaveAttribute('aria-label');
    });

    it('scopes header cells to their column and row', () => {
      render(<Clients />);
      expect(screen.getByRole('columnheader', { name: 'Customers' })).toHaveAttribute(
        'scope',
        'col',
      );
      expect(screen.getByRole('rowheader', { name: '0' })).toHaveAttribute('scope', 'row');
    });

    it('matches the snapshot', () => {
      const { container } = render(<Clients />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Props', () => {
    it('passes attributes, className and ref to the scroll container', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Spreadsheet
          ref={ref}
          aria-label="Clients"
          id="sheet"
          data-testid="root"
          className="h-[20rem]"
        />,
      );
      const root = screen.getByTestId('root');
      expect(root).toBe(ref.current);
      expect(root).toHaveAttribute('id', 'sheet');
      expect(root).toHaveClass('h-[20rem]', 'overflow-auto');
      expect(root).toContainElement(screen.getByRole('grid'));
    });

    it('forwards the column header icon ref to its svg', () => {
      const ref = createRef<SVGSVGElement>();
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>
                <Spreadsheet.ColumnHeaderIcon ref={ref} icon={RiHashtag} />
                Customers
              </Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
        </Spreadsheet>,
      );
      expect(ref.current?.tagName.toLowerCase()).toBe('svg');
    });

    it('marks every part with its data-slot', () => {
      const { container } = render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>
                <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
                Customers
                <Spreadsheet.ColumnHeaderTrigger aria-label="Customers options" />
              </Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>23</Spreadsheet.Cell>
            </Spreadsheet.Row>
            <Spreadsheet.Row>
              <Spreadsheet.RowHeader>1</Spreadsheet.RowHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      const slots = [...container.querySelectorAll('[data-slot]')].map((el) =>
        el.getAttribute('data-slot'),
      );
      expect(new Set(slots)).toEqual(
        new Set([
          'spreadsheet',
          'spreadsheet-grid',
          'spreadsheet-head',
          'spreadsheet-row',
          'spreadsheet-column-header',
          'spreadsheet-column-header-icon',
          'spreadsheet-column-header-trigger',
          'spreadsheet-body',
          'spreadsheet-cell',
          'spreadsheet-row-header',
        ]),
      );
    });

    it('passes className and attributes through the cell parts', () => {
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row data-testid="row" className="row">
              <Spreadsheet.ColumnHeader data-testid="column" className="w-[9rem]">
                Name
              </Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
          <Spreadsheet.Body data-testid="body">
            <Spreadsheet.Row>
              <Spreadsheet.RowHeader data-testid="number" className="number">
                0
              </Spreadsheet.RowHeader>
              <Spreadsheet.Cell data-testid="cell" className="cell" colSpan={2}>
                Tech Nova
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      expect(screen.getByTestId('row')).toHaveClass('row');
      expect(screen.getByTestId('column')).toHaveClass('w-[9rem]');
      expect(screen.getByTestId('body').tagName).toBe('TBODY');
      expect(screen.getByTestId('number')).toHaveClass('number');
      expect(screen.getByTestId('cell')).toHaveClass('cell');
      expect(screen.getByTestId('cell')).toHaveAttribute('colspan', '2');
    });

    it('sizes the cells with size', () => {
      render(<Clients size="md" />);
      expect(cell('Tech Nova')).toHaveClass('h-ws-16', 'px-ws-7');
    });

    it('defaults to the small size', () => {
      render(<Clients />);
      expect(cell('Tech Nova')).toHaveClass('h-ws-14', 'px-ws-5');
    });

    it('aligns a cell with align', () => {
      render(<Clients />);
      expect(cell('23')).toHaveClass('text-right');
      expect(screen.getByRole('rowheader', { name: '0' })).toHaveClass('text-center');
    });

    it('throws when a part is rendered outside Spreadsheet', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(
          <table>
            <tbody>
              <tr>
                <Spreadsheet.Cell>Orphan</Spreadsheet.Cell>
              </tr>
            </tbody>
          </table>,
        ),
      ).toThrow('useSpreadsheetContext must be used within a <Spreadsheet>');
      vi.mocked(console.error).mockRestore();
    });
  });

  describe('Content', () => {
    it('puts the text of a text cell in its title', () => {
      render(<Clients />);
      expect(cell('Skyline Innovations')).toHaveAttribute('title', 'Skyline Innovations');
    });

    it('lays mixed content out in a row and wraps its text so it can truncate', () => {
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                <span data-testid="avatar">AS</span>
                Adam {'Smith'}
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      const text = screen.getByText('Adam Smith');
      expect(text).toHaveClass('truncate');
      expect(text.parentElement).toHaveClass('flex', 'gap-ws-3');
      expect(text.parentElement).toContainElement(screen.getByTestId('avatar'));
    });

    it('sets aria-sort from sortDirection', () => {
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader sortDirection="asc">Name</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader sortDirection="desc">Customers</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader sortDirection={null}>Country</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader>Notes</Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
        </Spreadsheet>,
      );
      const header = (name: string) => screen.getByRole('columnheader', { name });
      expect(header('Name')).toHaveAttribute('aria-sort', 'ascending');
      expect(header('Customers')).toHaveAttribute('aria-sort', 'descending');
      expect(header('Country')).toHaveAttribute('aria-sort', 'none');
      expect(header('Notes')).not.toHaveAttribute('aria-sort');
    });

    it('renders the column header trigger as a named button', () => {
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>
                Customers
                <Spreadsheet.ColumnHeaderTrigger aria-label="Customers options" />
              </Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
        </Spreadsheet>,
      );
      expect(screen.getByRole('button', { name: 'Customers options' })).toHaveAttribute(
        'type',
        'button',
      );
    });

    it('hides the column header icon from screen readers', () => {
      const { container } = render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>
                <Spreadsheet.ColumnHeaderIcon icon={RiHashtag} />
                Customers
              </Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
        </Spreadsheet>,
      );
      expect(
        container.querySelector('[data-slot="spreadsheet-column-header-icon"]'),
      ).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('columnheader', { name: 'Customers' })).toBeInTheDocument();
    });
  });

  describe('Roving tabindex', () => {
    it('makes the first cell the one tab stop', () => {
      render(<Clients />);
      const stops = [...screen.getByRole('grid').querySelectorAll('[tabindex="0"]')];
      expect(stops).toEqual([screen.getByRole('columnheader', { name: 'Row' })]);
    });

    it('selects nothing until the user reaches a cell', () => {
      render(<Clients />);
      expect(screen.getByRole('grid').querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
      expect(cell('Tech Nova')).toHaveAttribute('aria-selected', 'false');
    });

    it('selects a clicked cell and makes it the tab stop', async () => {
      const user = userEvent.setup();
      render(<Clients />);
      await user.click(cell('Japan'));
      expect(cell('Japan')).toHaveFocus();
      expect(cell('Japan')).toHaveAttribute('aria-selected', 'true');
      expect(cell('Japan')).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('columnheader', { name: 'Row' })).toHaveAttribute('tabindex', '-1');
    });

    it('keeps the selection when focus leaves the grid', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Clients />
          <button type="button">After</button>
        </>,
      );
      await user.click(cell('37'));
      await user.click(screen.getByRole('button', { name: 'After' }));
      expect(cell('37')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Keyboard navigation', () => {
    const focusOn = async (name: string) => {
      const user = userEvent.setup();
      render(<Clients />);
      await user.click(cell(name));
      return user;
    };

    it('moves one cell with the arrow keys', async () => {
      const user = await focusOn('Tech Nova');
      await user.keyboard('{ArrowRight}');
      expect(cell('23')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(cell('37')).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(cell('Eco Solutions')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(cell('Tech Nova')).toHaveFocus();
    });

    it('selects the cell it moves to', async () => {
      const user = await focusOn('Tech Nova');
      await user.keyboard('{ArrowDown}');
      expect(cell('Eco Solutions')).toHaveAttribute('aria-selected', 'true');
      expect(cell('Tech Nova')).toHaveAttribute('aria-selected', 'false');
    });

    it('moves from the body into the header row and the row headers', async () => {
      const user = await focusOn('Tech Nova');
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('columnheader', { name: 'Client name' })).toHaveFocus();
      await user.keyboard('{ArrowDown}{ArrowLeft}');
      expect(screen.getByRole('rowheader', { name: '0' })).toHaveFocus();
    });

    it('stops at the edges of the grid', async () => {
      const user = await focusOn('Skyline Innovations');
      await user.keyboard('{ArrowDown}');
      expect(cell('Skyline Innovations')).toHaveFocus();
      await user.keyboard('{End}{ArrowRight}');
      expect(cell('Nigeria')).toHaveFocus();
    });

    it('goes to the ends of the row with Home and End', async () => {
      const user = await focusOn('37');
      await user.keyboard('{End}');
      expect(cell('Japan')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('rowheader', { name: '1' })).toHaveFocus();
    });

    it('goes to the first and last cell of the grid with Ctrl+Home and Ctrl+End', async () => {
      const user = await focusOn('37');
      await user.keyboard('{Control>}{End}{/Control}');
      expect(cell('Nigeria')).toHaveFocus();
      await user.keyboard('{Control>}{Home}{/Control}');
      expect(screen.getByRole('columnheader', { name: 'Row' })).toHaveFocus();
    });

    it('takes Cmd for Ctrl', async () => {
      const user = await focusOn('37');
      await user.keyboard('{Meta>}{End}{/Meta}');
      expect(cell('Nigeria')).toHaveFocus();
    });

    it('moves by the rows that fit under the header with Page Down and Page Up', async () => {
      const user = userEvent.setup();
      const rows = Array.from({ length: 10 }, (_, index) => `Client ${index}`);
      render(
        <Spreadsheet aria-label="Clients" data-testid="root">
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader>Client name</Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
          <Spreadsheet.Body>
            {rows.map((name) => (
              <Spreadsheet.Row key={name}>
                <Spreadsheet.Cell>{name}</Spreadsheet.Cell>
              </Spreadsheet.Row>
            ))}
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      // A 128px viewport under a 32px header holds three 32px rows.
      Object.defineProperty(screen.getByTestId('root'), 'clientHeight', { value: 128 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        value: 32,
      });
      await user.click(cell('Client 0'));
      await user.keyboard('{PageDown}');
      expect(cell('Client 3')).toHaveFocus();
      await user.keyboard('{PageDown}{PageDown}{PageDown}');
      expect(cell('Client 9')).toHaveFocus();
      await user.keyboard('{PageUp}');
      expect(cell('Client 6')).toHaveFocus();
      delete (HTMLElement.prototype as { offsetHeight?: number }).offsetHeight;
    });

    it('follows column spans', async () => {
      const user = userEvent.setup();
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>A1</Spreadsheet.Cell>
              <Spreadsheet.Cell>B1</Spreadsheet.Cell>
              <Spreadsheet.Cell>C1</Spreadsheet.Cell>
            </Spreadsheet.Row>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>A2</Spreadsheet.Cell>
              <Spreadsheet.Cell colSpan={2}>B2</Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      await user.click(cell('C1'));
      await user.keyboard('{ArrowDown}');
      expect(cell('B2')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(cell('B2')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(cell('B1')).toHaveFocus();
    });

    it('keeps Space from scrolling the grid', async () => {
      await focusOn('Tech Nova');
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      act(() => {
        cell('Tech Nova').dispatchEvent(event);
      });
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('Controls in cells', () => {
    const OneCell = ({ children }: { children: ReactNode }) => (
      <>
        <button type="button">Before</button>
        <Spreadsheet aria-label="Contacts">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>{children}</Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>
        <button type="button">After</button>
      </>
    );

    it('leaves an editable host out of the native tab order', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <div contentEditable suppressContentEditableWarning role="textbox" aria-label="Notes">
            Text
          </div>
        </OneCell>,
      );
      await user.click(screen.getByRole('gridcell'));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('takes a nested editor out of the tab order when it becomes its own editing host', async () => {
      const editors = (outerEditable: boolean) => (
        <OneCell>
          <div contentEditable={outerEditable} suppressContentEditableWarning>
            <div contentEditable suppressContentEditableWarning role="textbox" aria-label="Notes">
              Text
            </div>
          </div>
        </OneCell>
      );
      const { rerender } = render(editors(true));
      const editor = screen.getByRole('textbox', { name: 'Notes' });
      expect(editor).not.toHaveAttribute('tabindex');
      rerender(editors(false));
      await waitFor(() => expect(editor).toHaveAttribute('tabindex', '-1'));
    });

    it('takes focusable SVGs out of the native tab order', () => {
      render(
        <OneCell>
          <svg role="img" aria-label="Diagram" tabIndex={0}>
            <a href="#details" aria-label="Details">
              <title>Details</title>
            </a>
          </svg>
        </OneCell>,
      );
      expect(screen.getByRole('img', { name: 'Diagram' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByLabelText('Details')).toHaveAttribute('tabindex', '-1');
    });

    it('takes legacy SVG links and image map areas out of the tab order', async () => {
      render(
        <OneCell>
          <svg role="img" aria-label="Diagram" />
          <map name="locations">
            <area alt="Location" href="#location" />
          </map>
        </OneCell>,
      );
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      await act(async () => screen.getByRole('img', { name: 'Diagram' }).append(link));
      expect(link).not.toHaveAttribute('tabindex');
      const xlink = 'http://www.w3.org/1999/xlink';
      await act(async () => link.setAttributeNS(xlink, 'xlink:href', '#details'));
      expect(link).toHaveAttribute('tabindex', '-1');
      await act(async () => link.removeAttributeNS(xlink, 'href'));
      expect(link).not.toHaveAttribute('tabindex');
      expect(screen.getByAltText('Location')).toHaveAttribute('tabindex', '-1');
    });

    it('restores implicit and explicit tab indices when controls leave a cell', async () => {
      render(<OneCell>Notes</OneCell>);
      const controls = document.createElement('div');
      const implicit = document.createElement('button');
      const explicit = document.createElement('button');
      explicit.tabIndex = 2;
      controls.append(implicit, explicit);
      await act(async () => screen.getByRole('gridcell').append(controls));
      expect(implicit).toHaveAttribute('tabindex', '-1');
      expect(explicit).toHaveAttribute('tabindex', '-1');
      await act(async () => screen.getByRole('grid').parentElement?.after(controls));
      expect(implicit).not.toHaveAttribute('tabindex');
      expect(explicit).toHaveAttribute('tabindex', '2');
    });

    it('drops the managed tabindex when a link loses its href', async () => {
      const user = userEvent.setup();
      const controls = (href?: string) => (
        <OneCell>
          <a href={href}>Details</a>
          <input aria-label="Notes" />
        </OneCell>
      );
      const { rerender } = render(controls('#details'));
      const link = screen.getByRole('link', { name: 'Details' });
      expect(link).toHaveAttribute('tabindex', '-1');
      rerender(controls());
      await waitFor(() => expect(link).not.toHaveAttribute('tabindex'));
      await user.click(screen.getByRole('gridcell'));
      await user.keyboard('{Enter}');
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
    });

    it('drops the managed tabindex when an editing host becomes static', async () => {
      const user = userEvent.setup();
      const notes = (editable: boolean) => (
        <OneCell>
          <div contentEditable={editable ? 'plaintext-only' : false} suppressContentEditableWarning>
            Note
          </div>
          <input aria-label="Next" />
        </OneCell>
      );
      const { rerender } = render(notes(true));
      const editor = screen.getByText('Note');
      expect(editor).toHaveAttribute('tabindex', '-1');
      rerender(notes(false));
      await waitFor(() => expect(editor).not.toHaveAttribute('tabindex'));
      await user.click(screen.getByRole('gridcell'));
      await user.keyboard('{Enter}');
      expect(screen.getByRole('textbox', { name: 'Next' })).toHaveFocus();
    });

    it('suppresses an editing host again after its authored negative tabindex is removed', async () => {
      const notes = (editable: boolean, tabIndex?: number) => (
        <OneCell>
          <div contentEditable={editable} tabIndex={tabIndex} suppressContentEditableWarning>
            Note
          </div>
        </OneCell>
      );
      const { rerender } = render(notes(true, -1));
      const editor = screen.getByText('Note');
      rerender(notes(false));
      await act(async () => {});
      expect(editor).not.toHaveAttribute('tabindex');
      rerender(notes(true));
      await waitFor(() => expect(editor).toHaveAttribute('tabindex', '-1'));
    });

    it('suppresses iframe tab stops and enters the next same-document control', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <iframe title="Preview" />
          <input aria-label="Notes" />
        </OneCell>,
      );
      expect(screen.getByTitle('Preview')).toHaveAttribute('tabindex', '-1');
      await user.click(screen.getByRole('gridcell'));
      await user.keyboard('{Enter}');
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
    });

    it('uses authored tab order within a cell for both directions', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <input aria-label="Second" />
          <input aria-label="First" />
          <input aria-label="Third" />
          <input aria-label="Last" />
        </OneCell>,
      );
      const first = screen.getByRole('textbox', { name: 'First' });
      const second = screen.getByRole('textbox', { name: 'Second' });
      const third = screen.getByRole('textbox', { name: 'Third' });
      await act(async () => {
        second.tabIndex = 2;
        first.tabIndex = 1;
        third.tabIndex = 2;
      });
      await user.click(first);
      await user.tab();
      expect(second).toHaveFocus();
      await user.tab();
      expect(third).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Last' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(third).toHaveFocus();
      await user.tab({ shift: true });
      expect(second).toHaveFocus();
      await user.tab({ shift: true });
      expect(first).toHaveFocus();
    });

    it.each(['{Enter}', '{F2}'])(
      'enters an editable host with %s and tabs between its peers',
      async (key) => {
        const user = userEvent.setup();
        render(
          <OneCell>
            <div contentEditable suppressContentEditableWarning role="textbox" aria-label="Notes">
              Text
            </div>
            <input aria-label="Last" />
          </OneCell>,
        );
        await user.click(screen.getByRole('gridcell'));
        await user.keyboard(key);
        expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
        await user.tab();
        expect(screen.getByRole('textbox', { name: 'Last' })).toHaveFocus();
        await user.tab({ shift: true });
        expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
        await user.tab();
        await user.tab();
        expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      },
    );

    it('preserves an explicitly excluded editable host during navigation within a cell', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <input aria-label="First" />
          <div
            contentEditable
            tabIndex={-1}
            suppressContentEditableWarning
            role="textbox"
            aria-label="Notes"
          >
            Text
          </div>
        </OneCell>,
      );
      await user.click(screen.getByRole('textbox', { name: 'First' }));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('takes an existing hidden input out of the tab order when its type becomes text', async () => {
      const user = userEvent.setup();
      const notes = (hidden: boolean) => (
        <OneCell>
          <input aria-label="Notes" type={hidden ? 'hidden' : 'text'} />
        </OneCell>
      );
      const { rerender } = render(notes(true));
      const input = screen.getByLabelText('Notes');
      rerender(notes(false));
      await act(async () => {});
      expect(screen.getByRole('textbox', { name: 'Notes' })).toBe(input);
      await user.click(screen.getByRole('gridcell'));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it.each(['audio', 'video'] as const)(
      'takes %s out of the tab order when controls are enabled',
      async (tag) => {
        const Media = tag;
        const notes = (controls: boolean) => (
          <OneCell>
            <Media controls={controls} aria-label="Recording" />
          </OneCell>
        );
        const { rerender } = render(notes(false));
        rerender(notes(true));
        await act(async () => {});
        expect(screen.getByLabelText('Recording')).toHaveAttribute('tabindex', '-1');
      },
    );

    it.each([
      [0, -1, 'After'],
      [-1, 0, 'Second'],
    ] as const)(
      'respects a control changing its own tabindex from %s to %s',
      async (initial, next, destination) => {
        const user = userEvent.setup();
        const notes = (tabIndex: number) => (
          <OneCell>
            <input aria-label="First" />
            <input aria-label="Second" tabIndex={tabIndex} />
          </OneCell>
        );
        const { rerender } = render(notes(initial));
        rerender(notes(next));
        await act(async () => {});
        await user.click(screen.getByRole('textbox', { name: 'First' }));
        await user.tab();
        expect(
          screen.getByRole(destination === 'After' ? 'button' : 'textbox', { name: destination }),
        ).toHaveFocus();
      },
    );

    it('respects the last authored tabindex when mutations arrive in one batch', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <input aria-label="First" />
          <input aria-label="Second" />
        </OneCell>,
      );
      const second = screen.getByRole('textbox', { name: 'Second' });
      await act(async () => {
        second.tabIndex = 0;
        second.tabIndex = -1;
      });
      await user.click(screen.getByRole('textbox', { name: 'First' }));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('follows roving tabindex changes in a segmented control', async () => {
      const user = userEvent.setup();
      render(
        <OneCell>
          <input aria-label="First" />
          <SegmentedControl defaultValue="list" aria-label="View">
            <SegmentedControl.Item value="list">List</SegmentedControl.Item>
            <SegmentedControl.Item value="board">Board</SegmentedControl.Item>
          </SegmentedControl>
          <input aria-label="Last" />
        </OneCell>,
      );
      await user.click(screen.getByRole('radio', { name: 'List' }));
      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(screen.getByRole('radio', { name: 'Board' })).toHaveFocus());
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Last' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('radio', { name: 'Board' })).toHaveFocus();
    });

    const WithControls = () => (
      <>
        <button type="button">Before</button>
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>Tech Nova</Spreadsheet.Cell>
              <Spreadsheet.Cell>
                <Checkbox aria-label="Verified: Tech Nova" />
              </Spreadsheet.Cell>
              <Spreadsheet.Cell>
                <input aria-label="Notes: Tech Nova" defaultValue="Call back" />
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>Eco Solutions</Spreadsheet.Cell>
              <Spreadsheet.Cell>
                <a href="https://www.ecosolutions.com">ecosolutions.com</a>
              </Spreadsheet.Cell>
              <Spreadsheet.Cell>Paid</Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>
        <button type="button">After</button>
      </>
    );

    it('moves focus to the control in a cell with Enter, and back with Escape', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      const checkbox = screen.getByRole('checkbox', { name: 'Verified: Tech Nova' });
      await user.click(cell('Tech Nova'));
      await user.keyboard('{ArrowRight}{Enter}');
      expect(checkbox).toHaveFocus();
      await user.keyboard('{Escape}');
      expect(checkbox.closest('td')).toHaveFocus();
    });

    it('moves focus with F2 both ways', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      const input = screen.getByRole('textbox', { name: 'Notes: Tech Nova' });
      await user.click(input.closest('td')!);
      await user.keyboard('{F2}');
      expect(input).toHaveFocus();
      await user.keyboard('{F2}');
      expect(input.closest('td')).toHaveFocus();
    });

    it('selects the cell of a clicked control', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      const checkbox = screen.getByRole('checkbox', { name: 'Verified: Tech Nova' });
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(checkbox.closest('td')).toHaveAttribute('aria-selected', 'true');
    });

    it('keeps moving through the grid from a checkbox or a link', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(screen.getByRole('checkbox', { name: 'Verified: Tech Nova' }));
      await user.keyboard('{ArrowDown}');
      const link = screen.getByRole('link', { name: 'ecosolutions.com' });
      expect(link.closest('td')).toHaveFocus();
    });

    it('leaves the arrow keys to a text field', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      const input = screen.getByRole('textbox', { name: 'Notes: Tech Nova' });
      await user.click(input);
      await user.keyboard('{ArrowLeft}{ArrowDown}');
      expect(input).toHaveFocus();
    });

    /** Every element in the grid that takes focus from now on. */
    const recordFocus = () => {
      const focused: Element[] = [];
      screen
        .getByRole('grid')
        .addEventListener('focusin', (event) => focused.push(event.target as Element));
      return focused;
    };
    const controls = () => [
      screen.getByRole('checkbox', { name: 'Verified: Tech Nova' }),
      screen.getByRole('textbox', { name: 'Notes: Tech Nova' }),
      screen.getByRole('link', { name: 'ecosolutions.com' }),
    ];

    it('takes the controls in cells out of the tab order', () => {
      render(<WithControls />);
      controls().forEach((control) => expect(control).toHaveAttribute('tabindex', '-1'));
      expect(screen.getByRole('grid').querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    });

    it('is one tab stop: Tab leaves the grid without focusing a control', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(screen.getByRole('button', { name: 'Before' }));
      const focused = recordFocus();
      await user.tab();
      expect(cell('Tech Nova')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      expect(focused).toEqual([cell('Tech Nova')]);
      expect(cell('Tech Nova')).toHaveAttribute('aria-selected', 'true');
    });

    it('leaves the grid with Shift+Tab without focusing a control', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(cell('Paid'));
      const focused = recordFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      expect(focused).toEqual([]);
    });

    it('returns to the cell the user left when tabbing back', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(cell('Tech Nova'));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      const focused = recordFocus();
      await user.tab({ shift: true });
      expect(cell('Tech Nova')).toHaveFocus();
      expect(focused).toEqual([cell('Tech Nova')]);
    });

    it('leaves the grid from the last control in a cell with Tab', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(screen.getByRole('textbox', { name: 'Notes: Tech Nova' }));
      const focused = recordFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      expect(focused).toEqual([]);
    });

    it('leaves the grid from the first control in a cell with Shift+Tab, not stopping on the cell', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      const checkbox = screen.getByRole('checkbox', { name: 'Verified: Tech Nova' });
      await user.click(checkbox);
      const focused = recordFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      expect(focused).toEqual([]);
      // The cell is the tab stop again once focus has left, and the scroll container (out of the
      // tab order meanwhile, as Chrome would stop on it) is as it was.
      await act(() => new Promise((resolve) => setTimeout(resolve)));
      expect(checkbox.closest('td')).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('grid').parentElement).not.toHaveAttribute('tabindex');
    });

    it.each([0, -1])(
      'preserves scroller tabindex %s assigned while focus leaves the grid',
      async (tabIndex) => {
        const user = userEvent.setup();
        render(
          <OneCell>
            <input aria-label="Notes" />
          </OneCell>,
        );
        const scroller = screen.getByRole('grid').parentElement!;
        screen.getByRole('button', { name: 'Before' }).addEventListener('focus', () => {
          scroller.tabIndex = tabIndex;
        });
        await user.click(screen.getByRole('textbox', { name: 'Notes' }));
        await user.tab({ shift: true });
        await act(() => new Promise((resolve) => setTimeout(resolve)));
        expect(scroller).toHaveAttribute('tabindex', String(tabIndex));
      },
    );

    it('keeps a control rendered later out of the tab order', async () => {
      const Notes = ({ editing }: { editing: boolean }) => (
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                {editing ? <input aria-label="Notes" /> : 'Call back'}
              </Spreadsheet.Cell>
              <Spreadsheet.Cell>
                <button type="button" disabled={!editing}>
                  Save
                </button>
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>
      );
      const { rerender } = render(<Notes editing={false} />);
      rerender(<Notes editing />);
      await act(async () => {});
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('tabindex', '-1');
      // A control enabled after the grid rendered stays out too.
      expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('tabindex', '-1');
    });

    it('takes a control out of the tab order again when a re-render puts it back', async () => {
      const Action = ({ tabIndex }: { tabIndex: number }) => (
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                <span role="button" tabIndex={tabIndex}>
                  Archive
                </span>
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>
      );
      const { rerender } = render(<Action tabIndex={-1} />);
      rerender(<Action tabIndex={0} />);
      await act(async () => {});
      expect(screen.getByRole('button', { name: 'Archive' })).toHaveAttribute('tabindex', '-1');
    });

    it('moves between the controls of one cell with Tab before leaving the grid', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Spreadsheet aria-label="Contacts">
            <Spreadsheet.Body>
              <Spreadsheet.Row>
                <Spreadsheet.Cell>
                  <input aria-label="First name" />
                  <input aria-label="Last name" />
                </Spreadsheet.Cell>
                <Spreadsheet.Cell>
                  <input aria-label="Email" />
                </Spreadsheet.Cell>
              </Spreadsheet.Row>
            </Spreadsheet.Body>
          </Spreadsheet>
          <button type="button">After</button>
        </>,
      );
      await user.click(screen.getByRole('textbox', { name: 'First name' }));
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus();
      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('moves with Shift+Tab from a control that is not a tab stop to the one before it', async () => {
      const user = userEvent.setup();
      render(
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                <input aria-label="Search" />
                <button type="button" tabIndex={-1}>
                  Clear
                </button>
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      await user.tab({ shift: true });
      expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
    });

    it('moves with Tab from a control that is not a tab stop to the ones after it', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Spreadsheet aria-label="Contacts">
            <Spreadsheet.Body>
              <Spreadsheet.Row>
                <Spreadsheet.Cell>
                  <button type="button" tabIndex={-1}>
                    Pin
                  </button>
                  <input aria-label="First name" />
                  <input aria-label="Last name" />
                </Spreadsheet.Cell>
              </Spreadsheet.Row>
            </Spreadsheet.Body>
          </Spreadsheet>
          <button type="button">After</button>
        </>,
      );
      await user.click(screen.getByRole('gridcell'));
      // Enter reaches the first control that takes focus, a tab stop or not.
      await user.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: 'Pin' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('skips a control in the cell that does not take focus when tabbing within it', () => {
      render(
        <Spreadsheet aria-label="Contacts">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                <input aria-label="First name" />
                <button type="button" aria-label="Hidden action" />
                <input aria-label="Last name" />
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      vi.spyOn(screen.getByRole('button', { name: 'Hidden action' }), 'focus').mockImplementation(
        () => {},
      );
      act(() => screen.getByRole('textbox', { name: 'First name' }).focus());
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'First name' }), { key: 'Tab' });
      expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveFocus();
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Last name' }), {
        key: 'Tab',
        shiftKey: true,
      });
      expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus();
    });

    it('enters the first control that takes focus with Enter', async () => {
      const user = userEvent.setup();
      render(
        <Spreadsheet aria-label="Contacts">
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell>
                Ada
                <input type="hidden" name="id" value="7" />
                <button type="button" aria-label="Hidden action" />
                <input aria-label="Note" />
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      vi.spyOn(screen.getByRole('button', { name: 'Hidden action' }), 'focus').mockImplementation(
        () => {},
      );
      await user.click(screen.getByRole('gridcell'));
      await user.keyboard('{Enter}');
      expect(screen.getByRole('textbox', { name: 'Note' })).toHaveFocus();
    });
  });

  describe('Rows that change', () => {
    const Rows = ({ names }: { names: string[] }) => (
      <>
        <button type="button">Outside</button>
        <Spreadsheet aria-label="Clients">
          <Spreadsheet.Body>
            {names.map((name) => (
              <Spreadsheet.Row key={name}>
                <Spreadsheet.Cell>{name}</Spreadsheet.Cell>
                <Spreadsheet.Cell>{`${name} notes`}</Spreadsheet.Cell>
              </Spreadsheet.Row>
            ))}
          </Spreadsheet.Body>
        </Spreadsheet>
      </>
    );
    const names = clients.map(([name]) => name);

    it('hands focus to the cell that takes the place of a removed focused cell', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Rows names={names} />);
      await user.click(cell('Eco Solutions notes'));
      rerender(<Rows names={names.filter((name) => name !== 'Eco Solutions')} />);
      await act(async () => {});
      expect(cell('Skyline Innovations notes')).toHaveFocus();
      expect(cell('Skyline Innovations notes')).toHaveAttribute('aria-selected', 'true');
    });

    it('moves up a row when the focused last row is removed', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Rows names={names} />);
      await user.click(cell('Skyline Innovations'));
      rerender(<Rows names={names.slice(0, 2)} />);
      await act(async () => {});
      expect(cell('Eco Solutions')).toHaveFocus();
    });

    it('moves the tab stop without taking focus when focus is elsewhere', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Rows names={names} />);
      await user.click(cell('Eco Solutions notes'));
      await user.click(screen.getByRole('button', { name: 'Outside' }));
      rerender(<Rows names={names.filter((name) => name !== 'Eco Solutions')} />);
      await act(async () => {});
      expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
      expect(cell('Skyline Innovations notes')).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Sticky columns', () => {
    const pinned = () =>
      [...screen.getByRole('grid').querySelectorAll('[data-sticky]')].map(
        (el) => el.textContent || el.getAttribute('aria-label'),
      );

    it('pins the row header column by default', () => {
      render(<Clients />);
      expect(pinned()).toEqual(['Row', '0', '1', '2']);
    });

    it('pins as many leading columns as stickyColumns', () => {
      render(<Clients stickyColumns={2} />);
      expect(pinned()).toEqual([
        'Row',
        'Client name',
        '0',
        'Tech Nova',
        '1',
        'Eco Solutions',
        '2',
        'Skyline Innovations',
      ]);
    });

    it('pins no column with stickyColumns={0}', () => {
      render(<Clients stickyColumns={0} />);
      expect(pinned()).toEqual([]);
    });

    it('pins by the column a cell starts in, measuring columns a spanning header covers', () => {
      // Every column is 100px wide; a cell is as wide as the columns it spans.
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        const span = (this as HTMLTableCellElement).colSpan ?? 1;
        return { width: 100 * span } as DOMRect;
      });
      render(
        <Spreadsheet aria-label="Sales" stickyColumns={2}>
          <Spreadsheet.Head>
            <Spreadsheet.Row>
              <Spreadsheet.ColumnHeader colSpan={2}>Client</Spreadsheet.ColumnHeader>
              <Spreadsheet.ColumnHeader>Amount</Spreadsheet.ColumnHeader>
            </Spreadsheet.Row>
          </Spreadsheet.Head>
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.RowHeader>1</Spreadsheet.RowHeader>
              <Spreadsheet.Cell>Tech Nova</Spreadsheet.Cell>
              <Spreadsheet.Cell>$1,200</Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      expect(screen.getByRole('columnheader', { name: 'Amount' })).not.toHaveAttribute(
        'data-sticky',
      );
      expect(cell('Tech Nova')).toHaveAttribute('data-sticky');
      expect(cell('Tech Nova')).toHaveStyle({ left: '100px' });
      expect(cell('$1,200')).not.toHaveAttribute('data-sticky');
      vi.restoreAllMocks();
    });

    it('pins a column after cells that span the columns before it in every row', () => {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        const span = (this as HTMLTableCellElement).colSpan ?? 1;
        return { width: 100 * span } as DOMRect;
      });
      render(
        <Spreadsheet aria-label="Sales" stickyColumns={3}>
          <Spreadsheet.Body>
            {['Tech Nova', 'Eco Solutions'].map((name) => (
              <Spreadsheet.Row key={name}>
                <Spreadsheet.RowHeader colSpan={2}>{name}</Spreadsheet.RowHeader>
                <Spreadsheet.Cell>{`${name} region`}</Spreadsheet.Cell>
                <Spreadsheet.Cell>{`${name} amount`}</Spreadsheet.Cell>
              </Spreadsheet.Row>
            ))}
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      expect(cell('Tech Nova region')).toHaveAttribute('data-sticky');
      expect(cell('Tech Nova region')).toHaveStyle({ left: '200px' });
      expect(cell('Tech Nova amount')).not.toHaveAttribute('data-sticky');
      vi.restoreAllMocks();
    });

    it('finds the pinned column edges from spans that differ from row to row', () => {
      // Columns 75, 75, 150 and 100px wide; each cell reports the width of the columns it spans.
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        return { width: Number(this.dataset.width ?? 0) } as DOMRect;
      });
      render(
        <Spreadsheet aria-label="Sales" stickyColumns={3}>
          <Spreadsheet.Body>
            <Spreadsheet.Row>
              <Spreadsheet.Cell colSpan={3} data-width={300}>
                Totals
              </Spreadsheet.Cell>
              <Spreadsheet.Cell data-width={100}>A4</Spreadsheet.Cell>
            </Spreadsheet.Row>
            <Spreadsheet.Row>
              <Spreadsheet.Cell colSpan={2} data-width={150}>
                B1
              </Spreadsheet.Cell>
              <Spreadsheet.Cell colSpan={2} data-width={250}>
                B3
              </Spreadsheet.Cell>
            </Spreadsheet.Row>
            <Spreadsheet.Row>
              <Spreadsheet.Cell data-width={75}>C1</Spreadsheet.Cell>
              <Spreadsheet.Cell data-width={75}>C2</Spreadsheet.Cell>
              <Spreadsheet.Cell data-width={150}>C3</Spreadsheet.Cell>
              <Spreadsheet.Cell data-width={100}>C4</Spreadsheet.Cell>
            </Spreadsheet.Row>
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      expect(cell('B3')).toHaveStyle({ left: '150px' });
      expect(cell('C2')).toHaveStyle({ left: '75px' });
      expect(cell('C3')).toHaveStyle({ left: '150px' });
      expect(cell('A4')).not.toHaveAttribute('data-sticky');
      vi.restoreAllMocks();
    });

    it('measures each span once however many rows repeat it', () => {
      const measure = vi
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
          return { width: 100 * ((this as HTMLTableCellElement).colSpan ?? 1) } as DOMRect;
        });
      render(
        <Spreadsheet aria-label="Sales" stickyColumns={3}>
          <Spreadsheet.Body>
            {Array.from({ length: 50 }, (_, index) => (
              <Spreadsheet.Row key={index}>
                <Spreadsheet.Cell colSpan={2}>{`A${index}`}</Spreadsheet.Cell>
                <Spreadsheet.Cell colSpan={2}>{`B${index}`}</Spreadsheet.Cell>
              </Spreadsheet.Row>
            ))}
          </Spreadsheet.Body>
        </Spreadsheet>,
      );
      const cells = measure.mock.contexts.filter((el) => (el as Element).matches('td, th'));
      expect(cells.length).toBeLessThanOrEqual(4);
      expect(cell('B0')).toHaveStyle({ left: '200px' });
      vi.restoreAllMocks();
    });

    it('keeps the head at the top', () => {
      render(<Clients />);
      expect(screen.getAllByRole('rowgroup')[0]).toHaveClass('sticky', 'top-0');
    });
  });
});
