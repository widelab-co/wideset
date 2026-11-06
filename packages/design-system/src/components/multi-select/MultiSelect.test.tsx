import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MultiSelect } from './MultiSelect';

const baseOptions = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk' },
];

describe('MultiSelect', () => {
  describe('Basic rendering', () => {
    it('renders trigger button', () => {
      render(<MultiSelect options={baseOptions} placeholder="Select countries" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(<MultiSelect options={baseOptions} placeholder="Select countries" />);
      expect(screen.getByText('Select countries')).toBeInTheDocument();
    });

    it('renders options when opened', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });
  });

  describe('Selection behavior', () => {
    it('updates value in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('Poland'));

      await waitFor(() => {
        expect(screen.getByTestId('multi-select-trigger')).toHaveTextContent('Poland');
      });
    });

    it('calls onValueChange in controlled mode', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <MultiSelect
          options={baseOptions}
          value={['poland']}
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('USA'));

      expect(handleValueChange).toHaveBeenCalledWith(['poland', 'usa']);
    });

    it('does not select disabled option', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <MultiSelect
          options={baseOptions}
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('Canada'));

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it('shows aggregated label when selected values exceed maxVisibleTags', () => {
      render(
        <MultiSelect
          options={baseOptions}
          defaultValue={['poland', 'usa', 'germany']}
          maxVisibleTags={2}
          multiValuesLabel="items"
          placeholder="Select countries"
        />,
      );

      expect(screen.getByText('3 items')).toBeInTheDocument();
    });
  });

  describe('Tag removal', () => {
    it('keeps the tag remove controls out of the tab order and the accessibility tree', () => {
      render(<MultiSelect options={baseOptions} defaultValue={['poland']} placeholder="Select" />);

      const trigger = screen.getByRole('button', { name: /Poland/ });
      expect(trigger.querySelectorAll('[role="button"], [tabindex="0"]')).toHaveLength(0);
    });

    it('removes a tag when its remove control is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          defaultValue={['poland', 'usa']}
          onValueChange={handleValueChange}
          placeholder="Select"
        />,
      );

      const trigger = screen.getByRole('button', { name: /Poland/ });
      const removeControls = trigger.querySelectorAll('[data-slot="tag"] > [aria-hidden="true"]');
      await user.click(removeControls[0] as HTMLElement);

      expect(handleValueChange).toHaveBeenLastCalledWith(['usa']);
    });

    it('removes the last tag on Backspace', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          defaultValue={['poland', 'usa']}
          onValueChange={handleValueChange}
          placeholder="Select"
        />,
      );

      screen.getByRole('button', { name: /Poland/ }).focus();
      await user.keyboard('{Backspace}');

      expect(handleValueChange).toHaveBeenLastCalledWith(['poland']);
    });

    it('does nothing on Backspace when disabled', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          defaultValue={['poland']}
          onValueChange={handleValueChange}
          placeholder="Select"
          disabled
        />,
      );

      screen.getByRole('button', { name: /Poland/ }).focus();
      await user.keyboard('{Backspace}');

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Clearable', () => {
    it('shows clear button and clears selection', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      const handleClear = vi.fn();

      render(
        <MultiSelect
          options={baseOptions}
          value={['poland']}
          onValueChange={handleValueChange}
          onClear={handleClear}
          clearable
          placeholder="Select countries"
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleValueChange).toHaveBeenCalledWith([]);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('clears with the keyboard and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          defaultValue={['poland']}
          clearable
          placeholder="Select countries"
        />,
      );

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Select countries/ })).toHaveFocus();
    });
  });

  describe('Disabled state', () => {
    it('does not open when disabled', async () => {
      const user = userEvent.setup();

      render(<MultiSelect options={baseOptions} disabled placeholder="Select countries" />);

      await user.click(screen.getByRole('button', { name: /select countries/i }));

      await waitFor(() => {
        expect(screen.queryByText('Poland')).not.toBeInTheDocument();
      });
    });
  });

  describe('Composable mode', () => {
    it('renders composable structure with primitive trigger and options', () => {
      render(
        <MultiSelect>
          <MultiSelect.Trigger asChild>
            <button>Select countries</button>
          </MultiSelect.Trigger>
          <MultiSelect.Content shouldUsePrimitive={false}>
            <MultiSelect.Option
              option={{ value: 'poland', label: 'Poland' }}
              isSelected
              isDisabled={false}
              onSelect={() => undefined}
            />
          </MultiSelect.Content>
        </MultiSelect>,
      );

      expect(screen.getByText('Select countries')).toBeInTheDocument();
    });
  });
});

describe('MultiSelect Keyboard navigation', () => {
  it('opens with keyboard and toggles a value with Enter without closing the menu', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <MultiSelect
        options={baseOptions}
        onValueChange={handleValueChange}
        placeholder="Select countries"
      />,
    );

    const trigger = screen.getByRole('button', { name: /select countries/i });
    trigger.focus();

    await user.keyboard('{Enter}{ArrowDown}{Enter}');

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledWith(['usa']);
      expect(screen.getByText('Poland')).toBeInTheDocument();
    });
  });

  it('keeps danger option visibly highlighted during keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <MultiSelect
        options={[
          { label: 'Keep', value: 'keep' },
          { label: 'Delete', value: 'delete', variant: 'danger' },
        ]}
        placeholder="Select countries"
      />,
    );

    const trigger = screen.getByRole('button', { name: /select countries/i });
    trigger.focus();

    await user.keyboard('{Enter}{ArrowDown}');

    const dangerItem = screen.getByText('Delete').closest('[role="menuitemcheckbox"]');

    await waitFor(() => {
      expect(dangerItem).toHaveAttribute('data-highlighted', '');
    });

    expect(dangerItem).toHaveClass(
      'data-[highlighted]:not-aria-disabled:bg-ws-dynamic-danger-alpha-hover',
    );
  });

  describe('with search', () => {
    const openAndWaitForSearch = async (user: ReturnType<typeof userEvent.setup>) => {
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );
      await user.click(screen.getByTestId('multi-select-trigger'));
      await waitFor(() => expect(screen.getByRole('searchbox')).toHaveFocus());
      return screen.getByRole('searchbox');
    };

    it('ArrowDown moves focus from search to first item', async () => {
      const user = userEvent.setup();
      await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox', { name: /poland/i })).toHaveFocus();
      });
    });

    it('ArrowUp moves focus from search to last enabled item', async () => {
      const user = userEvent.setup();
      await openAndWaitForSearch(user);

      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox', { name: /uk/i })).toHaveFocus();
      });
    });

    it('ArrowUp on first item returns focus to search', async () => {
      const user = userEvent.setup();
      const search = await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('menuitemcheckbox', { name: /poland/i })).toHaveFocus(),
      );

      await user.keyboard('{ArrowUp}');

      await waitFor(() => expect(search).toHaveFocus());
    });

    it('Shift+Tab from item returns focus to search', async () => {
      const user = userEvent.setup();
      const search = await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('menuitemcheckbox', { name: /poland/i })).toHaveFocus(),
      );

      await user.keyboard('{Shift>}{Tab}{/Shift}');

      await waitFor(() => expect(search).toHaveFocus());
    });

    it('Escape from item closes the dropdown', async () => {
      const user = userEvent.setup();
      await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(screen.getByRole('menuitemcheckbox', { name: /poland/i })).toHaveFocus(),
      );

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menuitemcheckbox')).not.toBeInTheDocument();
      });
    });
  });
});

describe('MultiSelect Snapshots', () => {
  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
  const presets: Array<'border' | 'ghost'> = ['border', 'ghost'];

  sizes.forEach((size) => {
    describe(`Size: ${size}`, () => {
      presets.forEach((preset) => {
        it(`matches snapshot for ${preset} ${size}`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} with values`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              defaultValue={['poland', 'usa']}
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} disabled`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              disabled
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} danger`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              variant="danger"
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} clearable`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              defaultValue={['poland']}
              clearable
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} hideArrow`, () => {
          const { container } = render(
            <MultiSelect
              options={baseOptions}
              size={size}
              preset={preset}
              hideArrow
              placeholder="Select countries"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });

  describe('Sub-components snapshots', () => {
    it('matches snapshot with Root and Trigger', () => {
      const { container } = render(
        <MultiSelect>
          <MultiSelect.Trigger asChild>
            <button>Select countries</button>
          </MultiSelect.Trigger>
        </MultiSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with Group and Label', () => {
      const { container } = render(
        <MultiSelect>
          <MultiSelect.Trigger asChild>
            <button>Select countries</button>
          </MultiSelect.Trigger>
          <MultiSelect.Content shouldUsePrimitive={false}>
            <MultiSelect.Group>
              <MultiSelect.Label>Group 1</MultiSelect.Label>
              <MultiSelect.Option
                option={{ value: 'option-1', label: 'Option 1' }}
                isSelected
                isDisabled={false}
                onSelect={() => undefined}
              />
            </MultiSelect.Group>
          </MultiSelect.Content>
        </MultiSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with Separator', () => {
      const { container } = render(
        <MultiSelect>
          <MultiSelect.Trigger asChild>
            <button>Select countries</button>
          </MultiSelect.Trigger>
          <MultiSelect.Content shouldUsePrimitive={false}>
            <MultiSelect.Group>
              <MultiSelect.Option
                option={{ value: 'option-1', label: 'Option 1' }}
                isSelected
                isDisabled={false}
                onSelect={() => undefined}
              />
            </MultiSelect.Group>
            <MultiSelect.Separator />
            <MultiSelect.Group>
              <MultiSelect.Option
                option={{ value: 'option-2', label: 'Option 2' }}
                isSelected={false}
                isDisabled={false}
                onSelect={() => undefined}
              />
            </MultiSelect.Group>
          </MultiSelect.Content>
        </MultiSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('hasSearch', () => {
    it('renders search input when open', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
      });
    });

    it('focuses search input when dropdown opens', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toHaveFocus();
      });
    });

    it('filters options based on search input', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'pol');

      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
        expect(screen.queryByText('USA')).not.toBeInTheDocument();
        expect(screen.queryByText('Germany')).not.toBeInTheDocument();
      });
    });

    it('shows empty state when search returns no results', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'xyz');

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
        expect(screen.queryByRole('menuitemcheckbox')).not.toBeInTheDocument();
      });
    });

    it('shows custom noResultsLabel when search returns no results', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          noResultsLabel="No matches found"
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'xyz');

      await waitFor(() => {
        expect(screen.getByText('No matches found')).toBeInTheDocument();
        expect(screen.queryByText('No results found')).not.toBeInTheDocument();
      });
    });

    it('restores all options after clearing the search input', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'pol');
      await user.clear(screen.getByRole('searchbox'));

      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });

    it('shows new options when options prop changes', async () => {
      const user = userEvent.setup();
      const newOption = { label: 'France', value: 'france' };
      const { rerender } = render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      expect(screen.queryByText('France')).not.toBeInTheDocument();

      rerender(
        <MultiSelect
          options={[...baseOptions, newOption]}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText('France')).toBeInTheDocument();
      });
    });

    it('restores all options when dropdown is closed and reopened after a search', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSearch
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'pol');

      await waitFor(() => {
        expect(screen.queryByText('USA')).not.toBeInTheDocument();
      });

      await user.keyboard('{Escape}');
      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });
  });

  describe('hasSelectAll', () => {
    it('renders "Select all" item when open', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByText('Select all')).toBeInTheDocument();
      });
    });

    it('selects all options when "Select all" is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('Select all'));

      expect(handleValueChange).toHaveBeenCalledWith(
        baseOptions.filter((o) => !o.disabled).map((o) => o.value),
      );
    });

    it('does not select disabled options when "Select all" is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('Select all'));

      expect(handleValueChange).toHaveBeenCalledWith(
        baseOptions.filter((o) => !o.disabled).map((o) => o.value),
      );
    });

    it('deselects all non-disabled options when "Deselect all" is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          value={baseOptions.map((o) => o.value)}
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.click(screen.getByText('Deselect all'));

      expect(handleValueChange).toHaveBeenCalledWith(['canada']);
    });

    it('shows "Deselect all" label when all options are selected', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          value={baseOptions.map((o) => o.value)}
          onValueChange={vi.fn()}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));

      await waitFor(() => {
        expect(screen.getByText('Deselect all')).toBeInTheDocument();
      });
    });
  });

  describe('hasSelectAll with hasSearch', () => {
    it('selects only filtered options when search is active', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          hasSearch
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'land');
      await user.click(screen.getByText('Select all'));

      expect(handleValueChange).toHaveBeenCalledWith(['poland']);
    });

    it('preserves selections outside the active filter when Select all is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          hasSearch
          value={['usa']}
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'land');
      await user.click(screen.getByText('Select all'));

      expect(handleValueChange).toHaveBeenCalledWith(['usa', 'poland']);
    });

    it('deselects only filtered options when Deselect all is clicked with active search', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <MultiSelect
          options={baseOptions}
          hasSelectAll
          hasSearch
          value={['poland', 'usa']}
          onValueChange={handleValueChange}
          placeholder="Select countries"
          data-testid="multi-select-trigger"
        />,
      );

      await user.click(screen.getByTestId('multi-select-trigger'));
      await user.type(screen.getByRole('searchbox'), 'land');
      await user.click(screen.getByText('Deselect all'));

      expect(handleValueChange).toHaveBeenCalledWith(['usa']);
    });
  });
});

describe('MultiSelect data-slot', () => {
  describe('data-slot', () => {
    it('marks each part with data-slot', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={baseOptions} placeholder="Select countries" hasSelectAll />,
      );
      expect(container.firstChild).toHaveAttribute('data-slot', 'multi-select');
      const trigger = screen.getByRole('button', { name: /select countries/i });
      expect(trigger).toHaveAttribute('data-slot', 'multi-select-trigger');
      expect(screen.getByText('Select countries')).toHaveAttribute(
        'data-slot',
        'multi-select-value',
      );

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toHaveAttribute('data-slot', 'multi-select-content');
      });
      const slot = (name: string) => document.querySelectorAll(`[data-slot="${name}"]`);
      expect(slot('multi-select-option')).toHaveLength(baseOptions.length + 1);
      expect(slot('multi-select-separator')).toHaveLength(1);
    });

    it('marks the composable parts with data-slot', () => {
      render(
        <MultiSelect defaultOpen>
          <MultiSelect.Trigger>Countries</MultiSelect.Trigger>
          <MultiSelect.Content shouldUsePrimitive={false}>
            <MultiSelect.Group>
              <MultiSelect.Label>Europe</MultiSelect.Label>
              <MultiSelect.Option
                option={{ value: 'poland', label: 'Poland' }}
                isSelected
                isDisabled={false}
                onSelect={() => undefined}
              />
            </MultiSelect.Group>
            <MultiSelect.Separator />
          </MultiSelect.Content>
        </MultiSelect>,
      );
      const slot = (name: string) => document.querySelectorAll(`[data-slot="${name}"]`);
      expect(screen.getByText('Countries')).toHaveAttribute('data-slot', 'multi-select-trigger');
      expect(slot('multi-select-content')).toHaveLength(1);
      expect(slot('multi-select-group')).toHaveLength(1);
      expect(slot('multi-select-label')).toHaveLength(1);
      expect(slot('multi-select-option')).toHaveLength(1);
      expect(slot('multi-select-separator')).toHaveLength(1);
    });
  });
});

describe('MultiSelect list height', () => {
  it('stops the list at 18rem and at the room left in the window', async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={baseOptions} placeholder="Select countries" />);

    await user.click(screen.getByRole('button', { name: /select countries/i }));

    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('max-h-[var(--radix-dropdown-menu-content-available-height)]');
    expect(menu.querySelector('[data-slot="scroll-area"]')).toHaveClass('max-h-[18rem]');
  });
});
