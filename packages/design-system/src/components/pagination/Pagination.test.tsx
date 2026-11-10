import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders basic pagination with numbers type', () => {
    render(<Pagination pagesCount={5} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders overflow type pagination', () => {
    render(<Pagination pagesCount={5} type="overflow" />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('of 5')).toBeInTheDocument();
  });

  it('renders custom ofLabel in overflow type pagination', () => {
    render(<Pagination pagesCount={5} type="overflow" ofLabel="z" />);

    expect(screen.getByText('z 5')).toBeInTheDocument();
  });

  it('renders custom prevLabel and nextLabel in overflow type pagination', () => {
    render(<Pagination pagesCount={5} type="overflow" prevLabel="Wstecz" nextLabel="Dalej" />);

    expect(screen.getByText('Wstecz')).toBeInTheDocument();
    expect(screen.getByText('Dalej')).toBeInTheDocument();
  });

  it('shows rows per page section when rowsPerPageOptions is provided', () => {
    render(<Pagination pagesCount={3} rowsPerPageOptions={[5, 10, 20]} />);
    expect(screen.getByText('Rows per page')).toBeInTheDocument();
  });

  it('renders custom rowsPerPageLabel', () => {
    render(
      <Pagination pagesCount={3} rowsPerPageOptions={[5, 10, 20]} rowsPerPageLabel="Wiersze" />,
    );
    expect(screen.getByText('Wiersze')).toBeInTheDocument();
  });

  it('hides rows per page section when rowsPerPageOptions is false', () => {
    render(<Pagination pagesCount={3} rowsPerPageOptions={false} />);
    expect(screen.queryByText('Rows per page')).not.toBeInTheDocument();
  });

  it('calls onChangeActivePage when page is clicked', () => {
    const onChangeActivePage = vi.fn();
    render(<Pagination pagesCount={5} onChangeActivePage={onChangeActivePage} />);

    fireEvent.click(screen.getByText('3'));
    expect(onChangeActivePage).toHaveBeenCalledWith(3);
  });

  it('does not change local page in controlled mode until parent updates activePage', () => {
    const onChangeActivePage = vi.fn();
    render(<Pagination pagesCount={5} activePage={2} onChangeActivePage={onChangeActivePage} />);

    fireEvent.click(screen.getByRole('button', { name: '3' }));

    expect(onChangeActivePage).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '3' })).not.toHaveAttribute('aria-current');
  });

  it('disables previous button on first page', () => {
    render(<Pagination pagesCount={5} defaultActivePage={1} />);
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination pagesCount={5} defaultActivePage={5} />);
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });

  it('renders ellipsis for large page counts', () => {
    render(<Pagination pagesCount={10} defaultActivePage={5} />);
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('shows all in-between pages in overflow dropdown', async () => {
    const user = userEvent.setup();
    render(<Pagination pagesCount={10} defaultActivePage={1} maxVisiblePages={5} />);

    await user.click(screen.getByLabelText('Select page between 5 and 9'));

    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('renders composable API with numbers', () => {
    render(
      <Pagination pagesCount={10} activePage={5} rowsPerPageOptions={[5, 10, 20]}>
        <Pagination.RowsPerPage />
        <Pagination.Numbers />
      </Pagination>,
    );

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('throws error when pagesCount is lower than 1', () => {
    expect(() => render(<Pagination pagesCount={0} />)).toThrow(
      'Pagination: `pagesCount` must be greater than or equal to 1.',
    );
  });

  describe('Keyboard', () => {
    describe('Ellipsis', () => {
      it.each([
        { key: 'Enter', input: '{Enter}' },
        { key: 'Space', input: ' ' },
      ])(
        'supports $key and arrow keys to select a hidden page from the ellipsis',
        async ({ input }) => {
          const user = userEvent.setup();

          render(<Pagination pagesCount={10} defaultActivePage={1} maxVisiblePages={5} />);

          const trigger = screen.getByRole('combobox', { name: 'Select page between 5 and 9' });
          trigger.focus();
          await user.keyboard(input);

          const fifthPageOption = screen.getByRole('option', { name: '5' });
          await waitFor(() => expect(fifthPageOption).toHaveFocus());

          await user.keyboard('{ArrowDown}');
          expect(screen.getByRole('option', { name: '6' })).toHaveFocus();
          await user.keyboard('{ArrowUp}');
          expect(fifthPageOption).toHaveFocus();
          await user.keyboard(input);

          await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: '5' })).toHaveAttribute(
              'aria-current',
              'page',
            );
            expect(screen.getByRole('button', { name: '5' })).toHaveFocus();
          });
        },
      );

      it('moves focus to the active page when selecting a hidden page removes the ellipsis trigger', async () => {
        const user = userEvent.setup();

        render(<Pagination pagesCount={10} defaultActivePage={1} maxVisiblePages={5} />);

        const trigger = screen.getByRole('combobox', { name: 'Select page between 5 and 9' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('option', { name: '5' })).toHaveFocus());
        await user.keyboard('{End}');
        expect(screen.getByRole('option', { name: '9' })).toHaveFocus();
        await user.keyboard('{Enter}');

        expect(trigger).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: '9' })).toHaveAttribute('aria-current', 'page');
        await waitFor(() => expect(screen.getByRole('button', { name: '9' })).toHaveFocus());
      });

      it.each([
        { page: 5, moveFocusAway: false, expectedFocus: 'selected page' },
        { page: 9, moveFocusAway: false, expectedFocus: 'selected page' },
        { page: 9, moveFocusAway: true, expectedFocus: 'other control' },
      ])(
        'keeps focus on the $expectedFocus after a delayed update to page $page with an overridden data-slot',
        async ({ page, moveFocusAway }) => {
          const user = userEvent.setup();
          const onChangeActivePage = vi.fn();
          const content = (activePage: number) => (
            <>
              <Pagination
                pagesCount={10}
                activePage={activePage}
                onChangeActivePage={onChangeActivePage}
                maxVisiblePages={5}
              >
                <Pagination.Numbers data-slot="custom-pagination-numbers" />
              </Pagination>
              <button type="button">After pagination</button>
            </>
          );
          const { rerender } = render(content(1));

          const trigger = screen.getByRole('combobox', { name: 'Select page between 5 and 9' });
          await user.click(trigger);
          await user.click(screen.getByRole('option', { name: String(page) }));

          expect(onChangeActivePage).toHaveBeenCalledExactlyOnceWith(page);
          expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
          expect(screen.queryByRole('button', { name: String(page) })).not.toBeInTheDocument();
          await waitFor(() => expect(trigger).toHaveFocus());

          const after = screen.getByRole('button', { name: 'After pagination' });
          if (moveFocusAway) await user.click(after);

          // The parent applies the requested page after the menu has already closed.
          rerender(content(page));

          const selectedPage = screen.getByRole('button', { name: String(page) });
          expect(selectedPage).toHaveAttribute('aria-current', 'page');
          expect(moveFocusAway ? after : selectedPage).toHaveFocus();
        },
      );

      it.each([5, 9])(
        'moves focus to page %i after pointer selection from the ellipsis',
        async (page) => {
          const user = userEvent.setup();

          render(<Pagination pagesCount={10} defaultActivePage={1} maxVisiblePages={5} />);

          const trigger = screen.getByRole('combobox', { name: 'Select page between 5 and 9' });
          await user.click(trigger);
          await user.click(screen.getByRole('option', { name: String(page) }));

          const activePage = screen.getByRole('button', { name: String(page) });
          expect(activePage).toHaveAttribute('aria-current', 'page');
          await waitFor(() => expect(activePage).toHaveFocus());
        },
      );

      it('restores focus to the ellipsis trigger on Escape without changing the page', async () => {
        const user = userEvent.setup();

        render(<Pagination pagesCount={10} defaultActivePage={1} maxVisiblePages={5} />);

        const trigger = screen.getByRole('combobox', { name: 'Select page between 5 and 9' });
        trigger.focus();
        await user.keyboard('{Enter}');
        await waitFor(() => expect(screen.getByRole('option', { name: '5' })).toHaveFocus());
        await user.keyboard('{Escape}');

        await waitFor(() => {
          expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
          expect(trigger).toHaveFocus();
        });
        expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
      });
    });

    describe('Overflow', () => {
      it.each([
        { key: 'Enter', input: '{Enter}' },
        { key: 'Space', input: ' ' },
      ])(
        'supports $key and arrow keys to select a page from overflow and keeps focus after selection',
        async ({ input }) => {
          const user = userEvent.setup();

          render(<Pagination pagesCount={10} defaultActivePage={1} type="overflow" />);

          const trigger = screen.getByRole('combobox');
          trigger.focus();
          await user.keyboard(input);

          await user.keyboard('{ArrowDown}');
          expect(screen.getByRole('option', { name: '2' })).toHaveFocus();
          await user.keyboard(input);

          await waitFor(() => {
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            expect(trigger).toHaveTextContent('2');
            expect(trigger).toHaveFocus();
          });
        },
      );

      it.each([
        { key: 'Enter', input: '{Enter}', direction: 'next', startPage: 2, endPage: 3 },
        { key: 'Space', input: ' ', direction: 'next', startPage: 2, endPage: 3 },
        { key: 'Enter', input: '{Enter}', direction: 'previous', startPage: 3, endPage: 2 },
        { key: 'Space', input: ' ', direction: 'previous', startPage: 3, endPage: 2 },
      ])(
        'supports $key on the $direction button in overflow mode',
        async ({ input, direction, startPage, endPage }) => {
          const user = userEvent.setup();

          render(<Pagination type="overflow" pagesCount={5} defaultActivePage={startPage} />);

          // Overflow buttons are named by their visible text, not the aria-label fallback.
          const navigationButton = screen.getByRole('button', {
            name: direction === 'next' ? 'Next' : 'Prev',
          });
          const pageSelect = screen.getByRole('combobox');

          expect(pageSelect).toHaveTextContent(`${startPage}`);
          navigationButton.focus();
          await user.keyboard(input);

          expect(pageSelect).toHaveTextContent(`${endPage}`);
        },
      );
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('supports $key to select a numbered page', async ({ input }) => {
      const user = userEvent.setup();

      render(<Pagination pagesCount={5} />);

      const firstPage = screen.getByRole('button', { name: '1' });
      const thirdPage = screen.getByRole('button', { name: '3' });

      expect(firstPage).toHaveAttribute('aria-current', 'page');
      thirdPage.focus();

      await user.keyboard(input);

      expect(thirdPage).toHaveAttribute('aria-current', 'page');
      expect(firstPage).not.toHaveAttribute('aria-current');
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('supports $key to navigate to the next page', async ({ input }) => {
      const user = userEvent.setup();

      render(<Pagination pagesCount={5} defaultActivePage={1} />);

      const nextPage = screen.getByLabelText('Go to next page');
      const secondPage = screen.getByRole('button', { name: '2' });

      nextPage.focus();
      await user.keyboard(input);

      expect(secondPage).toHaveAttribute('aria-current', 'page');
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])('supports $key to navigate to the previous page', async ({ input }) => {
      const user = userEvent.setup();

      render(<Pagination pagesCount={5} defaultActivePage={2} />);

      const prevPage = screen.getByLabelText('Go to previous page');
      const firstPage = screen.getByRole('button', { name: '1' });

      prevPage.focus();
      await user.keyboard(input);

      expect(firstPage).toHaveAttribute('aria-current', 'page');
    });

    it.each([
      { key: 'Enter', input: '{Enter}', direction: 'next', startPage: 4, endPage: 5 },
      { key: 'Enter', input: '{Enter}', direction: 'previous', startPage: 2, endPage: 1 },
      { key: 'Space', input: ' ', direction: 'next', startPage: 4, endPage: 5 },
      { key: 'Space', input: ' ', direction: 'previous', startPage: 2, endPage: 1 },
    ] as const)(
      'supports Tab navigation after $key disables the $direction button',
      async ({ input, direction, startPage, endPage }) => {
        const user = userEvent.setup();

        render(<Pagination pagesCount={5} defaultActivePage={startPage} />);

        const navigationButton = screen.getByLabelText(`Go to ${direction} page`);
        const activePageButton = screen.getByRole('button', { name: `${endPage}` });

        navigationButton.focus();
        await user.keyboard(input);

        expect(activePageButton).toHaveAttribute('aria-current', 'page');
        expect(navigationButton).toBeDisabled();

        await user.tab({ shift: direction === 'next' });

        expect(activePageButton).toHaveFocus();
      },
    );

    it('supports Tab and Shift+Tab to move between controls and leave pagination', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before pagination</button>
          <Pagination pagesCount={3} defaultActivePage={2} />
          <button type="button">After pagination</button>
        </>,
      );

      const before = screen.getByRole('button', { name: 'Before pagination' });
      const after = screen.getByRole('button', { name: 'After pagination' });
      const controls = [
        screen.getByRole('button', { name: 'Go to previous page' }),
        screen.getByRole('button', { name: '1' }),
        screen.getByRole('button', { name: '2' }),
        screen.getByRole('button', { name: '3' }),
        screen.getByRole('button', { name: 'Go to next page' }),
      ];

      await user.tab();
      expect(before).toHaveFocus();

      for (const control of [...controls, after]) {
        await user.tab();
        expect(control).toHaveFocus();
      }

      for (const control of [...controls].reverse().concat(before)) {
        await user.tab({ shift: true });
        expect(control).toHaveFocus();
      }
    });
  });
});

describe('Pagination Snapshots', () => {
  it('matches snapshot for numbers type', () => {
    const { container } = render(<Pagination pagesCount={10} defaultActivePage={4} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for overflow type', () => {
    const { container } = render(
      <Pagination pagesCount={10} defaultActivePage={4} type="overflow" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with rows per page', () => {
    const { container } = render(
      <Pagination
        pagesCount={10}
        defaultActivePage={4}
        rowsPerPageOptions={[5, 10, 20]}
        defaultItemsPerPage={10}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for composable API', () => {
    const { container } = render(
      <Pagination pagesCount={10} activePage={5} rowsPerPageOptions={[5, 10, 20]}>
        <Pagination.RowsPerPage />
        <Pagination.Numbers />
      </Pagination>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <>
        <Pagination pagesCount={20} defaultActivePage={10} rowsPerPageOptions={[10, 25]}>
          <Pagination.RowsPerPage />
          <Pagination.Numbers />
        </Pagination>
        <Pagination pagesCount={20}>
          <Pagination.Overflow />
        </Pagination>
      </>,
    );

    const navigations = screen.getAllByRole('navigation');
    expect(navigations.map((nav) => nav.getAttribute('data-slot'))).toEqual([
      'pagination',
      'pagination',
    ]);
    expect(container.querySelector('[data-slot="pagination-rows-per-page"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="pagination-numbers"]')).toBeInTheDocument();
    expect(container.querySelectorAll('li[data-slot="pagination-numbers-item"]').length).toBe(7);
    expect(container.querySelector('[data-slot="pagination-overflow"]')).toBeInTheDocument();
  });
});

describe('Overflow accessible names', () => {
  it('names the prev and next buttons by their visible text', () => {
    render(<Pagination pagesCount={5} defaultActivePage={2} type="overflow" />);

    expect(screen.getByRole('button', { name: 'Prev' })).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: 'Next' })).not.toHaveAttribute('aria-label');
  });

  it('falls back to the aria labels when the visible labels are empty', () => {
    render(<Pagination pagesCount={5} type="overflow" prevLabel="" nextLabel="" />);

    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
  });
});
