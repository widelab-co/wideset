import { RiArrowUpDownLine, RiSortAsc, RiSortDesc } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Table } from './Table';

const BasicTable = (props: React.ComponentProps<typeof Table>) => (
  <Table {...props}>
    <Table.Head>
      <Table.Row>
        <Table.Header>Name</Table.Header>
        <Table.Header>Status</Table.Header>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Row 1</Table.Cell>
        <Table.Cell>Active</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

describe('Table', () => {
  describe('Basic rendering', () => {
    it('renders table with head, body and foot', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Name</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row 1</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Foot>
            <Table.Row>
              <Table.Cell>Footer</Table.Cell>
            </Table.Row>
          </Table.Foot>
        </Table>,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('applies custom className to the table element', () => {
      render(<BasicTable className="custom-class" />);
      expect(screen.getByRole('table')).toHaveClass('custom-class');
    });

    it('forwards HTML attributes to the table element', () => {
      render(<BasicTable data-testid="my-table" aria-label="Project table" />);
      const table = screen.getByTestId('my-table');
      expect(table).toHaveAttribute('aria-label', 'Project table');
    });
  });

  describe('Table.CellDescription', () => {
    const renderCell = () =>
      render(
        <Table size="md">
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Offline sync
                <Table.CellDescription data-testid="desc" className="mt-ws-1" aria-hidden="false">
                  Edits made offline merge on reconnect.
                </Table.CellDescription>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

    it('renders a quieter second line under the label (Figma Body/Small, subtle)', () => {
      renderCell();
      expect(screen.getByTestId('desc')).toHaveClass(
        'typography-body-sm',
        'text-ws-static-subtle',
        'block',
      );
    });

    it('leaves the label in the cell type for its size', () => {
      renderCell();
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('typography-label-sm');
    });

    it('marks its slot, merges className and spreads rest props', () => {
      renderCell();
      const desc = screen.getByTestId('desc');
      expect(desc).toHaveAttribute('data-slot', 'table-cell-description');
      expect(desc).toHaveClass('mt-ws-1');
      expect(desc).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('separated', () => {
    it('adds is-separated class to table when separated is true', () => {
      render(<BasicTable separated />);
      expect(screen.getByRole('table')).toHaveClass('is-separated');
    });

    it('does not add is-separated class by default', () => {
      render(<BasicTable />);
      expect(screen.getByRole('table')).not.toHaveClass('is-separated');
    });
  });

  describe('layout', () => {
    it('applies table-auto by default', () => {
      render(<BasicTable />);
      expect(screen.getByRole('table')).toHaveClass('table-auto');
    });

    it('lets the table-fixed class override the default table-auto', () => {
      render(<BasicTable className="table-fixed" />);
      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-fixed');
      expect(table).not.toHaveClass('table-auto');
    });
  });

  describe('truncate', () => {
    it('applies truncate class to all cells when set on the table', () => {
      render(
        <Table truncate>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-1">Row 1</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByTestId('cell-1')).toHaveClass('truncate');
    });

    it('applies truncate on an individual Table.Cell and sets title for string content', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-truncated" truncate>
                Long content
              </Table.Cell>
              <Table.Cell data-testid="cell-normal">Short</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      const truncated = screen.getByTestId('cell-truncated');
      expect(truncated).toHaveClass('truncate');
      expect(truncated).toHaveAttribute('title', 'Long content');
      const normal = screen.getByTestId('cell-normal');
      expect(normal).not.toHaveClass('truncate');
      expect(normal).not.toHaveAttribute('title');
    });

    it('overrides table-level truncate with truncate={false} on an individual Table.Cell', () => {
      render(
        <Table truncate>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-override" truncate={false}>
                Row 1
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByTestId('cell-override')).not.toHaveClass('truncate');
    });

    it('applies truncate on an inner wrapper and title on Table.Header', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header data-testid="header-truncated" truncate>
                Column
              </Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      const header = screen.getByTestId('header-truncated');
      // truncate lives on an inner span, not the th — clipping the th would
      // also clip the sort button out of view
      expect(header).not.toHaveClass('truncate');
      expect(header.querySelector('.truncate')).not.toBeNull();
      expect(header).toHaveAttribute('title', 'Column');
    });

    it('keeps the sort button outside the truncated wrapper on a sortable header', () => {
      render(
        <Table truncate>
          <Table.Head>
            <Table.Row>
              <Table.Header data-testid="header-sortable" sortable onSort={() => {}}>
                Column
              </Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      const header = screen.getByTestId('header-sortable');
      const button = header.querySelector('button');
      expect(button).not.toBeNull();
      expect(button?.closest('.truncate')).toBeNull();
    });

    it('derives title from number and mixed string/number children', () => {
      render(
        <Table truncate>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-number">{1234}</Table.Cell>
              <Table.Cell data-testid="cell-mixed">
                {'Item'} {42}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByTestId('cell-number')).toHaveAttribute('title', '1234');
      expect(screen.getByTestId('cell-mixed')).toHaveAttribute('title', 'Item 42');
    });

    it('respects an explicit title over the truncate-derived one', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-titled" truncate title="Custom title">
                Long content
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByTestId('cell-titled')).toHaveAttribute('title', 'Custom title');
    });
  });

  describe('column widths', () => {
    it('passes width classes through to the th element', () => {
      render(
        <Table className="table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Header data-testid="sized-header" className="w-40">
                Name
              </Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      );
      expect(screen.getByTestId('sized-header')).toHaveClass('w-40');
    });
  });

  describe('selectionMode', () => {
    it('does not set role attribute explicitly when selectionMode is not set', () => {
      render(<BasicTable />);
      expect(screen.getByRole('table')).not.toHaveAttribute('role');
    });

    it('sets role="grid" when selectionMode is "single"', () => {
      render(<BasicTable selectionMode="single" />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('sets role="grid" when selectionMode is "multiple"', () => {
      render(<BasicTable selectionMode="multiple" />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('sets aria-multiselectable="true" when selectionMode is "multiple"', () => {
      render(<BasicTable selectionMode="multiple" />);
      expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('does not set aria-multiselectable when selectionMode is "single"', () => {
      render(<BasicTable selectionMode="single" />);
      expect(screen.getByRole('grid')).not.toHaveAttribute('aria-multiselectable');
    });
  });

  describe('stickyHeader', () => {
    it('applies sticky class to thead when stickyHeader is true', () => {
      const { container } = render(
        <Table stickyHeader>
          <Table.Head>
            <Table.Row>
              <Table.Header>Name</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('sticky');
    });
  });

  describe('Table.Row', () => {
    it('sets aria-selected="true" on a selected row when selectionMode is set', () => {
      render(
        <Table selectionMode="single">
          <Table.Body>
            <Table.Row selected data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not set aria-selected when selectionMode is not set', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row selected data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).not.toHaveAttribute('aria-selected');
    });

    it('sets aria-selected="false" on a non-selected row when selectionMode is set', () => {
      render(
        <Table selectionMode="single">
          <Table.Body>
            <Table.Row selected={false} data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).toHaveAttribute('aria-selected', 'false');
    });

    it('omits aria-selected when selectionMode is set but selected prop is not passed', () => {
      render(
        <Table selectionMode="single">
          <Table.Body>
            <Table.Row data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).not.toHaveAttribute('aria-selected');
    });

    it('calls onClick when row is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Table interactive>
          <Table.Body>
            <Table.Row onClick={handleClick} data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      await user.click(screen.getByTestId('row'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies cursor-pointer class when interactive is true', () => {
      render(
        <Table interactive>
          <Table.Body>
            <Table.Row data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).toHaveClass('cursor-pointer');
    });

    it('applies cursor-pointer class when selectionMode is set', () => {
      render(
        <Table selectionMode="single">
          <Table.Body>
            <Table.Row data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).toHaveClass('cursor-pointer');
    });

    it('does not apply cursor-pointer class when neither interactive nor selectionMode is set', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Table.Foot', () => {
    // Resolves the cell's `border-t` classes the way Tailwind does: an arbitrary
    // variant `[selector]:border-t` applies where `&` (the cell) matches it.
    const hasTopLine = (cell: HTMLElement) =>
      Array.from(cell.classList).some((cls) => {
        if (cls === 'border-t') return true;
        const selector = /^\[(.+)\]:border-t$/.exec(cls)?.[1];
        return (
          selector !== undefined && cell.matches(selector.replaceAll('_', ' ').replace('&', '*'))
        );
      });

    const renderFooter = () =>
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Design review</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Foot>
            <Table.Row>
              <Table.Cell>Subtotal</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
            </Table.Row>
          </Table.Foot>
        </Table>,
      );

    it('draws the top line above the first footer row', () => {
      renderFooter();

      expect(hasTopLine(screen.getByRole('cell', { name: 'Subtotal' }))).toBe(true);
    });

    it('draws no line above the footer rows after the first', () => {
      renderFooter();

      expect(hasTopLine(screen.getByRole('cell', { name: 'Total' }))).toBe(false);
    });
  });

  describe('Table-level props applied to cells', () => {
    it('applies align to all cells', () => {
      render(
        <Table align="right">
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-1">A</Table.Cell>
              <Table.Cell data-testid="cell-2">B</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-1')).toHaveClass('text-right');
      expect(screen.getByTestId('cell-2')).toHaveClass('text-right');
    });

    it('applies placement to all cells', () => {
      render(
        <Table placement="middle">
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-1">A</Table.Cell>
              <Table.Cell data-testid="cell-2">B</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-1')).toHaveClass('align-middle');
      expect(screen.getByTestId('cell-2')).toHaveClass('align-middle');
    });

    it('applies flushMargin to all cells', () => {
      render(
        <Table flushMargin>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-1">A</Table.Cell>
              <Table.Cell data-testid="cell-2">B</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-1')).toHaveClass('px-0');
      expect(screen.getByTestId('cell-2')).toHaveClass('px-0');
    });
  });

  describe('Cell-level overrides', () => {
    it('overrides table-level align on individual Table.Cell', () => {
      render(
        <Table align="center">
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-default">Default</Table.Cell>
              <Table.Cell data-testid="cell-overridden" align="right">
                Overridden
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-default')).toHaveClass('text-center');
      expect(screen.getByTestId('cell-overridden')).toHaveClass('text-right');
    });

    it('overrides table-level placement on individual Table.Cell', () => {
      render(
        <Table placement="bottom">
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-default">Default</Table.Cell>
              <Table.Cell data-testid="cell-overridden" placement="top">
                Overridden
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-default')).toHaveClass('align-bottom');
      expect(screen.getByTestId('cell-overridden')).toHaveClass('align-top');
    });

    it('applies flushMargin on individual Table.Cell independently', () => {
      render(
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-flush" flushMargin>
                Flush
              </Table.Cell>
              <Table.Cell data-testid="cell-normal">Normal</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-flush')).toHaveClass('px-0');
      expect(screen.getByTestId('cell-normal')).not.toHaveClass('px-0');
    });

    it('overrides table-level flushMargin with flushMargin={false} on individual Table.Cell', () => {
      render(
        <Table flushMargin>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="cell-flush">Flush</Table.Cell>
              <Table.Cell data-testid="cell-override" flushMargin={false}>
                Not flush
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('cell-flush')).toHaveClass('px-0');
      expect(screen.getByTestId('cell-override')).not.toHaveClass('px-0');
    });
  });

  describe('Table.Header', () => {
    it('overrides table-level align on individual Table.Header', () => {
      render(
        <Table align="center">
          <Table.Head>
            <Table.Row>
              <Table.Header data-testid="header-default">Default</Table.Header>
              <Table.Header data-testid="header-overridden" align="right">
                Overridden
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row</Table.Cell>
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('header-default')).toHaveClass('text-center');
      expect(screen.getByTestId('header-overridden')).toHaveClass('text-right');
    });
  });

  describe('Table.Header sorting', () => {
    const SortableTable = (props: React.ComponentProps<typeof Table.Header>) => (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header {...props}>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    it('does not render a sort button when sortable is not set', () => {
      render(<SortableTable />);
      expect(screen.queryByRole('button', { name: /sort by/i })).not.toBeInTheDocument();
    });

    it('renders a sort button when sortable is true', () => {
      render(<SortableTable sortable onSort={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Sort by Name' })).toBeInTheDocument();
    });

    it('does not set aria-sort when sortable is not set', () => {
      render(<SortableTable data-testid="th" />);
      expect(screen.getByTestId('th')).not.toHaveAttribute('aria-sort');
    });

    it('sets aria-sort="none" when sortable is true and sortDirection is null', () => {
      render(<SortableTable sortable sortDirection={null} onSort={vi.fn()} data-testid="th" />);
      expect(screen.getByTestId('th')).toHaveAttribute('aria-sort', 'none');
    });

    it.each([
      [null, RiArrowUpDownLine],
      ['asc', RiSortAsc],
      ['desc', RiSortDesc],
    ] as const)('draws the %s sort state with its own icon', (sortDirection, Icon) => {
      const pathOf = (root: Element) => root.querySelector('svg path')?.getAttribute('d');
      const { container: icon } = render(<Icon />);
      render(<SortableTable sortable sortDirection={sortDirection} onSort={vi.fn()} />);
      expect(pathOf(screen.getByRole('button', { name: 'Sort by Name' }))).toBe(pathOf(icon));
    });

    it('sets aria-sort="ascending" when sortDirection is "asc"', () => {
      render(<SortableTable sortable sortDirection="asc" onSort={vi.fn()} data-testid="th" />);
      expect(screen.getByTestId('th')).toHaveAttribute('aria-sort', 'ascending');
    });

    it('sets aria-sort="descending" when sortDirection is "desc"', () => {
      render(<SortableTable sortable sortDirection="desc" onSort={vi.fn()} data-testid="th" />);
      expect(screen.getByTestId('th')).toHaveAttribute('aria-sort', 'descending');
    });

    it('calls onSort when the sort button is clicked', async () => {
      const user = userEvent.setup();
      const handleSort = vi.fn();
      render(<SortableTable sortable onSort={handleSort} />);
      await user.click(screen.getByRole('button', { name: 'Sort by Name' }));
      expect(handleSort).toHaveBeenCalledTimes(1);
    });

    it('disables the sort button when disabled is true', () => {
      render(<SortableTable sortable disabled onSort={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Sort by Name' })).toBeDisabled();
    });

    it('uses column children as the sort button aria-label', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header sortable onSort={vi.fn()}>
                Status
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByRole('button', { name: 'Sort by Status' })).toBeInTheDocument();
    });
  });

  describe('interactive automatically enabled by selectionMode', () => {
    it('adds cursor-pointer to rows when selectionMode enables interactive', () => {
      render(
        <Table selectionMode="multiple">
          <Table.Body>
            <Table.Row data-testid="row">
              <Table.Cell>Row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      expect(screen.getByTestId('row')).toHaveClass('cursor-pointer');
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Customer</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Acme Corp</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    );
    const slots = (name: string) => container.querySelectorAll(`[data-slot="${name}"]`);
    expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
    expect(slots('table-head')).toHaveLength(1);
    expect(slots('table-body')).toHaveLength(1);
    expect(slots('table-foot')).toHaveLength(1);
    expect(slots('table-row')).toHaveLength(3);
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveAttribute(
      'data-slot',
      'table-header',
    );
    expect(screen.getByRole('cell', { name: 'Acme Corp' })).toHaveAttribute(
      'data-slot',
      'table-cell',
    );
  });

  it('lets a consumer override the slot', () => {
    render(
      <Table data-slot="invoices">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Acme Corp</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'invoices');
  });
});

describe('Table Snapshots', () => {
  it('matches snapshot for default table', () => {
    const { container } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row 1</Table.Cell>
            <Table.Cell>Active</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell>Summary</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for size sm', () => {
    const { container } = render(
      <Table size="sm">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for size md', () => {
    const { container } = render(
      <Table size="md">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for size lg', () => {
    const { container } = render(
      <Table size="lg">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for separated table', () => {
    const { container } = render(
      <Table separated>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for stickyHeader table', () => {
    const { container } = render(
      <Table stickyHeader>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for stickyColumn table', () => {
    const { container } = render(
      <Table stickyColumn>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
            <Table.Cell>Active</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for interactive table', () => {
    const { container } = render(
      <Table interactive>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for selectionMode single', () => {
    const { container } = render(
      <Table selectionMode="single">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
          <Table.Row selected>
            <Table.Cell>Selected row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for selectionMode multiple', () => {
    const { container } = render(
      <Table selectionMode="multiple">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row selected>
            <Table.Cell>Row 1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 2</Table.Cell>
          </Table.Row>
          <Table.Row selected>
            <Table.Cell>Row 3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for flushMargin table', () => {
    const { container } = render(
      <Table flushMargin>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for align center table', () => {
    const { container } = render(
      <Table align="center">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for placement middle table', () => {
    const { container } = render(
      <Table placement="middle">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for all sortable header states', () => {
    const { container } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header sortable sortDirection={null} onSort={vi.fn()}>
              Unsorted
            </Table.Header>
            <Table.Header sortable sortDirection="asc" onSort={vi.fn()}>
              Ascending
            </Table.Header>
            <Table.Header sortable sortDirection="desc" onSort={vi.fn()}>
              Descending
            </Table.Header>
            <Table.Header sortable disabled onSort={vi.fn()}>
              Disabled
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>A</Table.Cell>
            <Table.Cell>B</Table.Cell>
            <Table.Cell>C</Table.Cell>
            <Table.Cell>D</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
