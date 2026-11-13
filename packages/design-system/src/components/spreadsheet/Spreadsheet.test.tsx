import { RiHashtag } from '@remixicon/react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../checkbox/Checkbox';
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

    it('is one tab stop: Tab from the grid hands focus to its last control', async () => {
      // The browser's own Tab then continues from there, out of the grid; jsdom does not move
      // focus on Tab, so this checks the hand-off (the real move is checked in a browser).
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(screen.getByRole('button', { name: 'Before' }));
      await user.tab();
      expect(cell('Tech Nova')).toHaveFocus();
      fireEvent.keyDown(cell('Tech Nova'), { key: 'Tab' });
      expect(screen.getByRole('link', { name: 'ecosolutions.com' })).toHaveFocus();
      expect(cell('Tech Nova')).toHaveAttribute('aria-selected', 'true');
    });

    it('returns to the cell the user left when tabbing back', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(cell('Paid'));
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(cell('Paid')).toHaveFocus();
    });

    it('hands Shift+Tab to the first control in the grid', async () => {
      const user = userEvent.setup();
      render(<WithControls />);
      await user.click(cell('Paid'));
      fireEvent.keyDown(cell('Paid'), { key: 'Tab', shiftKey: true });
      expect(screen.getByRole('checkbox', { name: 'Verified: Tech Nova' })).toHaveFocus();
      expect(cell('Paid')).toHaveAttribute('aria-selected', 'true');
    });

    it('moves between the controls of one cell with Tab before leaving the grid', () => {
      render(
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
        </Spreadsheet>,
      );
      act(() => screen.getByRole('textbox', { name: 'First name' }).focus());
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'First name' }), { key: 'Tab' });
      expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveFocus();
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Last name' }), {
        key: 'Tab',
        shiftKey: true,
      });
      expect(screen.getByRole('textbox', { name: 'First name' })).toHaveFocus();
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Last name' }), { key: 'Tab' });
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
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

    it('skips a last control that does not take focus when Tab leaves the grid', async () => {
      // A hidden control (display: none, inert) ignores focus(); the hand-off goes to the one before.
      const user = userEvent.setup();
      render(<WithControls />);
      const link = screen.getByRole('link', { name: 'ecosolutions.com' });
      vi.spyOn(link, 'focus').mockImplementation(() => {});
      await user.click(cell('Tech Nova'));
      fireEvent.keyDown(cell('Tech Nova'), { key: 'Tab' });
      expect(screen.getByRole('textbox', { name: 'Notes: Tech Nova' })).toHaveFocus();
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

    it('keeps the head at the top', () => {
      render(<Clients />);
      expect(screen.getAllByRole('rowgroup')[0]).toHaveClass('sticky', 'top-0');
    });
  });
});
