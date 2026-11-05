import { RiCalendarLine, RiFolderLine } from '@remixicon/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Avatar } from '../avatar/Avatar';
import { Select } from './Select';

const baseOptions = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk' },
];

describe('Select', () => {
  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      render(
        <Select defaultOpen defaultValue="poland">
          <Select.Trigger aria-label="Country">
            <Select.Value placeholder="Select country" />
          </Select.Trigger>
          <Select.Content>
            <Select.Search value="" onChange={() => {}} />
            <Select.Group>
              <Select.Label>Europe</Select.Label>
              <Select.Option value="poland">Poland</Select.Option>
            </Select.Group>
            <Select.Separator />
            <Select.Option value="usa">USA</Select.Option>
          </Select.Content>
        </Select>,
      );
      const slot = (name: string) => document.querySelectorAll(`[data-slot="${name}"]`);
      expect(slot('select-trigger')).toHaveLength(1);
      expect(slot('select-value')).toHaveLength(1);
      expect(slot('select-content')).toHaveLength(1);
      expect(slot('select-search')).toHaveLength(1);
      expect(slot('select-group')).toHaveLength(1);
      expect(slot('select-label')).toHaveLength(1);
      expect(slot('select-option')).toHaveLength(2);
      expect(slot('select-separator')).toHaveLength(1);
    });
  });

  describe('Basic rendering', () => {
    it('renders select trigger', () => {
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(<Select options={baseOptions} placeholder="Select country" />);
      expect(screen.getByText('Select country')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Select options={baseOptions} className="custom-class" placeholder="Select" />,
      );
      const select = container.querySelector('.custom-class');
      expect(select).toBeInTheDocument();
    });

    it('renders options when opened', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(trigger).toHaveAttribute('aria-expanded', 'true');
        },
        { timeout: 3000 },
      );

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
          expect(screen.getByText('USA')).toBeInTheDocument();
          expect(screen.getByText('Germany')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Accessible name', () => {
    it('does not set an aria-label from the placeholder or the selected label', async () => {
      const { rerender } = render(<Select options={baseOptions} placeholder="Select country" />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-label');

      rerender(<Select options={baseOptions} value="poland" placeholder="Select country" />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-label');
    });

    it('takes its name from an associated <label>', () => {
      render(
        <>
          <label htmlFor="country">Country</label>
          <Select id="country" options={baseOptions} placeholder="Select country" />
        </>,
      );
      expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
    });

    it('keeps an explicit aria-label', () => {
      render(
        <Select options={baseOptions} placeholder="Select country" aria-label="Home country" />,
      );
      expect(screen.getByRole('combobox', { name: 'Home country' })).toBeInTheDocument();
    });

    it('points every option aria-labelledby at a rendered element', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} placeholder="Select country" />);
      await user.click(screen.getByRole('combobox'));

      const options = await screen.findAllByRole('option');
      for (const option of options) {
        const id = option.getAttribute('aria-labelledby');
        expect(id).toBeTruthy();
        expect(document.getElementById(id as string)).toHaveTextContent(/\S/);
      }
    });
  });

  describe('Controlled and uncontrolled', () => {
    it('renders as uncontrolled by default, selecting the option will update the value', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-placeholder');

      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const polandOption = screen.getByText('Poland');
      await user.click(polandOption);

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
          expect(trigger).not.toHaveAttribute('data-placeholder');
        },
        { timeout: 3000 },
      );
    });

    it('uses defaultValue for uncontrolled select', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} defaultValue="poland" placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          const polandOptions = screen.getAllByText('Poland');
          const polandOption = polandOptions.find((el) => el.closest('[data-state="checked"]'));
          expect(polandOption).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('uses value for controlled select', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Select
          options={baseOptions}
          value="poland"
          onValueChange={handleValueChange}
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          const polandOptions = screen.getAllByText('Poland');
          const polandOption = polandOptions.find((el) => el.closest('[data-state="checked"]'));
          expect(polandOption).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('calls onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Select
          options={baseOptions}
          onValueChange={handleValueChange}
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const polandOption = screen.getByText('Poland');
      await user.click(polandOption);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith('poland');
    });

    it('can be cleared in controlled mode', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      const { rerender } = render(
        <Select
          options={baseOptions}
          value="poland"
          onValueChange={handleValueChange}
          clearable
          placeholder="Select country"
        />,
      );

      await waitFor(() => {
        const clearButton = screen.getByLabelText('Clear selection');
        expect(clearButton).toBeInTheDocument();
      });

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith('');

      rerender(
        <Select
          options={baseOptions}
          value=""
          onValueChange={handleValueChange}
          clearable
          placeholder="Select country"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText('Select country')).toBeInTheDocument();
      });
    });

    it('can be cleared in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={baseOptions}
          defaultValue="poland"
          clearable
          placeholder="Select country"
        />,
      );

      await waitFor(
        () => {
          const clearButton = screen.getByLabelText('Clear selection');
          expect(clearButton).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      await waitFor(
        () => {
          expect(screen.getByText('Select country')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  // Ghost reads as a value, not a boxed control (an issue's properties, a table cell).
  describe('Ghost preset', () => {
    const withPrefix = [
      { label: 'Marek Zieliński', value: 'marek', prefix: <Avatar size="xs" initials="MZ" /> },
    ];
    const arrowOf = (trigger: HTMLElement) => trigger.querySelector('svg[aria-hidden="true"]');

    it('hides the arrow until the trigger is hovered, focused or open', () => {
      render(
        <Select options={withPrefix} defaultValue="marek" preset="ghost" aria-label="Owner" />,
      );
      const arrow = arrowOf(screen.getByRole('combobox', { name: 'Owner' }));
      expect(arrow).toHaveClass(
        'opacity-0',
        'group-hover/select-trigger:not-data-[disabled=true]:opacity-100',
        'group-focus-visible/select-trigger:opacity-100',
        'group-data-[state=open]/select-trigger:opacity-100',
        'pointer-coarse:opacity-100',
      );
    });

    it('keeps the arrow visible on a bordered field', () => {
      render(<Select options={withPrefix} defaultValue="marek" aria-label="Owner" />);
      expect(arrowOf(screen.getByRole('combobox', { name: 'Owner' }))).not.toHaveClass('opacity-0');
    });

    it('draws no divider after the prefix', () => {
      render(
        <Select options={withPrefix} defaultValue="marek" preset="ghost" aria-label="Owner" />,
      );
      const prefix = screen.getByText('MZ').closest('div');
      expect(prefix).toHaveClass('border-r-0');
    });
  });

  // A field reads left to right on one line: a <button> centres and wraps by default, so a long
  // value next to a prefix once broke onto two centred lines.
  describe('Long values', () => {
    const longOptions = [
      {
        label: 'Marek Zieliński from the platform team',
        value: 'marek',
        prefix: <Avatar size="xs" initials="MZ" />,
      },
      { label: 'Ola Nowicka from the design team', value: 'ola' },
    ];

    it('keeps the trigger text left-aligned on one line', () => {
      render(<Select options={longOptions} defaultValue="marek" aria-label="Assignee" />);
      const trigger = screen.getByRole('combobox', { name: 'Assignee' });
      expect(trigger).toHaveClass('text-left', 'whitespace-nowrap');
    });

    it('cuts a long label with an ellipsis next to a prefix', () => {
      render(<Select options={longOptions} defaultValue="marek" aria-label="Assignee" />);
      const label = screen.getByText('Marek Zieliński from the platform team');
      expect(label).toHaveClass('truncate', 'min-w-0', 'flex-1');
      expect(label.parentElement).toHaveClass('min-w-0', 'flex-1');
    });

    it('cuts a long label with an ellipsis without a prefix', () => {
      render(<Select options={longOptions} defaultValue="ola" aria-label="Assignee" />);
      expect(screen.getByText('Ola Nowicka from the design team')).toHaveClass('truncate');
    });
  });

  describe('Disabled state', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Select options={baseOptions} disabled placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-disabled', 'true');
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} disabled placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.queryByText('Poland')).not.toBeInTheDocument();
      });
    });
  });

  describe('Variant state', () => {
    it('applies danger attribute when variant is danger', () => {
      render(<Select options={baseOptions} variant="danger" placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-danger', 'true');
    });

    it('does not apply danger attribute when variant is primary', () => {
      render(<Select options={baseOptions} variant="primary" placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-danger', 'false');
    });
  });

  describe('Allow clear', () => {
    it('does not show clear button without clearable', () => {
      render(<Select options={baseOptions} defaultValue="poland" placeholder="Select country" />);
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('does not show clear button when no value is selected', () => {
      render(<Select options={baseOptions} clearable placeholder="Select country" />);
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('shows clear button when value is selected and clearable is true', async () => {
      render(
        <Select
          options={baseOptions}
          defaultValue="poland"
          clearable
          placeholder="Select country"
        />,
      );

      await waitFor(
        () => {
          const clearButton = screen.getByLabelText('Clear selection');
          expect(clearButton).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('calls onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <Select
          options={baseOptions}
          defaultValue="poland"
          clearable
          onClear={handleClear}
          placeholder="Select country"
        />,
      );

      await waitFor(
        () => {
          const clearButton = screen.getByLabelText('Clear selection');
          expect(clearButton).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('renders the clear button as a sibling of the trigger, not inside it', () => {
      render(<Select options={baseOptions} defaultValue="poland" clearable />);
      const clearButton = screen.getByRole('button', { name: 'Clear selection' });
      expect(clearButton.tagName).toBe('BUTTON');
      expect(screen.getByRole('combobox')).not.toContainElement(clearButton);
    });

    it('clears with the keyboard without opening the menu and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Select
          options={baseOptions}
          defaultValue="poland"
          clearable
          onValueChange={handleValueChange}
          placeholder="Select country"
        />,
      );

      await user.tab();
      expect(screen.getByRole('combobox')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(handleValueChange).toHaveBeenCalledWith('');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
      expect(screen.getByRole('combobox')).toHaveTextContent('Select country');
    });

    it('clears on Space', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <Select options={baseOptions} defaultValue="poland" clearable onClear={handleClear} />,
      );

      screen.getByRole('button', { name: 'Clear selection' }).focus();
      await user.keyboard(' ');

      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('keeps className on the trigger', () => {
      render(<Select options={baseOptions} defaultValue="poland" clearable className="w-full" />);
      expect(screen.getByRole('combobox')).toHaveClass('w-full');
    });

    it('does not show clear button when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={baseOptions}
          defaultValue="poland"
          clearable
          disabled
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
      });
    });
  });

  describe('Options with prefix', () => {
    const prefixOptions = [
      {
        label: 'Calendar Events',
        value: 'calendar',
        prefix: <RiCalendarLine className="text-ws-dynamic-secondary-default size-ws-8" />,
      },
      {
        label: 'Project Files',
        value: 'files',
        prefix: <RiFolderLine className="text-ws-dynamic-secondary-default size-ws-8" />,
      },
      {
        label: 'John Doe',
        value: 'user',
        prefix: (
          <Avatar
            size="xs"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            initials="JD"
          />
        ),
      },
    ];

    it('renders options with prefix icons', async () => {
      const user = userEvent.setup();
      render(<Select options={prefixOptions} placeholder="Select option" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Calendar Events')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const svgIcons = document.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('displays prefix in trigger when option is selected', async () => {
      const user = userEvent.setup();
      render(<Select options={prefixOptions} placeholder="Select option" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Calendar Events')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const calendarOption = screen.getByText('Calendar Events');
      await user.click(calendarOption);

      await waitFor(
        () => {
          const svgIcons = document.querySelectorAll('svg');
          expect(svgIcons.length).toBeGreaterThan(0);
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Disabled options', () => {
    it('renders disabled options', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Canada')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const canadaOption = screen.getByText('Canada');
      expect(canadaOption.closest('[data-disabled]')).toBeInTheDocument();
    });

    it('does not select disabled option when clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();
      render(
        <Select
          options={baseOptions}
          onValueChange={handleValueChange}
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Canada')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const canadaOption = screen.getByText('Canada');
      await user.click(canadaOption);

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('HTML attributes', () => {
    it('forwards HTML attributes', () => {
      render(
        <Select
          options={baseOptions}
          id="test-id"
          name="country"
          data-testid="custom-select"
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('id', 'test-id');
      expect(trigger).toHaveAttribute('name', 'country');
      expect(trigger).toHaveAttribute('data-testid', 'custom-select');
    });
  });

  describe('Hide arrow', () => {
    it('shows arrow by default', () => {
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      const arrowIcon = trigger.querySelector('svg');
      expect(arrowIcon).toBeInTheDocument();
    });

    it('hides arrow when hideArrow is true', () => {
      render(<Select options={baseOptions} hideArrow placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      const arrowIcon = trigger.querySelector('svg');
      expect(arrowIcon).not.toBeInTheDocument();
    });
  });

  describe('hasSearch', () => {
    it('renders search input when open', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} hasSearch placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByRole('searchbox')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('does not render search input when hasSearch is false', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('filters options based on search query', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} hasSearch placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByRole('searchbox')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await user.type(screen.getByRole('searchbox'), 'ger');

      await waitFor(
        () => {
          expect(screen.getByText('Germany')).toBeInTheDocument();
          expect(screen.queryByText('Poland')).not.toBeInTheDocument();
          expect(screen.queryByText('USA')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('restores all options after clearing the search input', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} hasSearch placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByRole('searchbox')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await user.type(screen.getByRole('searchbox'), 'ger');
      await user.clear(screen.getByRole('searchbox'));

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
          expect(screen.getByText('USA')).toBeInTheDocument();
          expect(screen.getByText('Germany')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('restores all options when dropdown is closed and reopened after a search', async () => {
      const user = userEvent.setup();
      render(<Select options={baseOptions} hasSearch placeholder="Select country" />);
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByRole('searchbox')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await user.type(screen.getByRole('searchbox'), 'ger');

      await waitFor(
        () => {
          expect(screen.queryByText('Poland')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await user.keyboard('{Escape}');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Poland')).toBeInTheDocument();
          expect(screen.getByText('USA')).toBeInTheDocument();
          expect(screen.getByText('Germany')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('onOpenChange callback', () => {
    it('calls onOpenChange when dropdown opens', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <Select
          options={baseOptions}
          onOpenChange={handleOpenChange}
          placeholder="Select country"
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(handleOpenChange).toHaveBeenCalledWith(true);
        },
        { timeout: 3000 },
      );
    });
  });
});

describe('Select Keyboard navigation', () => {
  it('opens with ArrowDown and selects highlighted option with Enter', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Select
        options={baseOptions}
        onValueChange={handleValueChange}
        placeholder="Select country"
      />,
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}{Enter}');

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledWith('poland');
    });
  });

  it('skips disabled options when opened from the keyboard', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Select
        options={[
          { label: 'Canada', value: 'canada', disabled: true },
          { label: 'Poland', value: 'poland' },
          { label: 'USA', value: 'usa' },
        ]}
        onValueChange={handleValueChange}
        placeholder="Select country"
      />,
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}{Enter}');

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledWith('poland');
    });
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<Select options={baseOptions} placeholder="Select country" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Poland')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
      expect(screen.queryByText('Poland')).not.toBeInTheDocument();
    });
  });

  describe('with search', () => {
    const openAndWaitForSearch = async (user: ReturnType<typeof userEvent.setup>) => {
      render(<Select options={baseOptions} hasSearch placeholder="Select country" />);
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => expect(screen.getByRole('searchbox')).toHaveFocus(), { timeout: 3000 });
      return screen.getByRole('searchbox');
    };

    it('ArrowDown moves focus from search to first option', async () => {
      const user = userEvent.setup();
      await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Poland' })).toHaveFocus();
      });
    });

    it('ArrowUp moves focus from search to last enabled option', async () => {
      const user = userEvent.setup();
      await openAndWaitForSearch(user);

      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'UK' })).toHaveFocus();
      });
    });

    it('ArrowUp on first option returns focus to search', async () => {
      const user = userEvent.setup();
      const search = await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(screen.getByRole('option', { name: 'Poland' })).toHaveFocus());

      await user.keyboard('{ArrowUp}');

      await waitFor(() => expect(search).toHaveFocus());
    });

    it('Shift+Tab from option returns focus to search', async () => {
      const user = userEvent.setup();
      const search = await openAndWaitForSearch(user);

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(screen.getByRole('option', { name: 'Poland' })).toHaveFocus());

      await user.keyboard('{Shift>}{Tab}{/Shift}');

      await waitFor(() => expect(search).toHaveFocus());
    });

    it('maintains search focus while typing when Select has a pre-selected value', async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={baseOptions}
          hasSearch
          value="poland"
          onValueChange={() => {}}
          placeholder="Select country"
        />,
      );
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => expect(screen.getByRole('searchbox')).toHaveFocus(), { timeout: 3000 });

      await user.keyboard('g');

      await waitFor(() => expect(screen.getByRole('searchbox')).toHaveFocus());
    });
  });
});

describe('Select Snapshots', () => {
  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
  const presets: Array<'border' | 'ghost'> = ['border', 'ghost'];

  sizes.forEach((size) => {
    describe(`Size: ${size}`, () => {
      presets.forEach((preset) => {
        it(`matches snapshot for ${preset} ${size}`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} with value`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              defaultValue="poland"
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} disabled`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              disabled
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} with danger variant`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              variant="danger"
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} with clearable`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              defaultValue="poland"
              clearable
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });

        it(`matches snapshot for ${preset} ${size} with hideArrow`, () => {
          const { container } = render(
            <Select
              options={baseOptions}
              size={size}
              preset={preset}
              hideArrow
              placeholder="Select country"
            />,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });

  describe('With prefix options', () => {
    const prefixOptions = [
      {
        label: 'Calendar Events',
        value: 'calendar',
        prefix: <RiCalendarLine className="text-ws-dynamic-secondary-default size-ws-8" />,
      },
      {
        label: 'Project Files',
        value: 'files',
        prefix: <RiFolderLine className="text-ws-dynamic-secondary-default size-ws-8" />,
      },
    ];

    it('matches snapshot with prefix options', () => {
      const { container } = render(<Select options={prefixOptions} placeholder="Select option" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with prefix option selected', () => {
      const { container } = render(
        <Select options={prefixOptions} defaultValue="calendar" placeholder="Select option" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Sub-components snapshots', () => {
    it('matches snapshot with Select and Select.Trigger', () => {
      const { container } = render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder="Select option" />
          </Select.Trigger>
        </Select>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with Select.Group and Select.Label', () => {
      const { container } = render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder="Select option" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Group 1</Select.Label>
              <Select.Option value="option1">Option 1</Select.Option>
            </Select.Group>
          </Select.Content>
        </Select>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with Select.Separator', () => {
      const { container } = render(
        <Select>
          <Select.Trigger>
            <Select.Value placeholder="Select option" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Option value="option1">Option 1</Select.Option>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Option value="option2">Option 2</Select.Option>
            </Select.Group>
          </Select.Content>
        </Select>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
