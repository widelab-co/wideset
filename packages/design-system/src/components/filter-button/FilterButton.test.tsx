import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FilterButton, type FilterButtonProps } from './FilterButton';

type WrapperProps = {
  options: FilterButtonProps['options'];
};

const ControlledWrapper = ({ options }: WrapperProps) => {
  const [value, setValue] = useState<string[]>([]);
  return <FilterButton options={options} value={value} onChange={setValue} />;
};

describe('FilterButton', () => {
  const options: FilterButtonProps['options'] = [
    { label: 'Poland', value: 'poland' },
    { label: 'USA', value: 'usa' },
    { label: 'Germany', value: 'germany' },
    { label: 'Canada', value: 'canada', disabled: true },
  ];

  describe('Long values', () => {
    it('cuts a long selected value with an ellipsis instead of clipping it', () => {
      render(
        <FilterButton
          options={[{ label: 'Marek Zieliński from the platform team', value: 'marek' }]}
          defaultValue={['marek']}
          onChange={() => {}}
        />,
      );
      expect(screen.getByText('Marek Zieliński from the platform team')).toHaveClass(
        'truncate',
        'min-w-0',
      );
    });
  });

  describe('Basic rendering', () => {
    it('renders placeholder when empty', () => {
      render(<FilterButton options={options} defaultValue={[]} onChange={() => {}} />);
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('renders with default label', () => {
      render(<FilterButton options={options} defaultValue={['poland']} onChange={() => {}} />);
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(
        <FilterButton
          options={options}
          defaultValue={[]}
          onChange={() => {}}
          placeholder="Select countries"
        />,
      );
      expect(screen.getByText('Select countries')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(
        <FilterButton
          options={options}
          defaultValue={['poland']}
          onChange={() => {}}
          label="Country"
        />,
      );
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders single selected value', () => {
      render(<FilterButton options={options} defaultValue={['poland']} onChange={() => {}} />);
      expect(screen.getByText('Poland')).toBeInTheDocument();
    });

    it('renders multiple selected values with counter', () => {
      render(
        <FilterButton
          options={options}
          defaultValue={['poland', 'usa', 'germany']}
          onChange={() => {}}
        />,
      );
      expect(screen.getByText('Poland, +2')).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('renders disabled button', () => {
      render(<FilterButton options={options} defaultValue={[]} onChange={() => {}} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('pointer-events-none');
    });
  });

  describe('Select logic', () => {
    it('calls onChange in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterButton options={options} defaultValue={[]} onChange={onChange} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Poland'));

      expect(onChange).toHaveBeenCalledWith(['poland']);
    });

    it('manages internal state when uncontrolled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterButton options={options} defaultValue={['poland']} onChange={onChange} />);

      expect(screen.getByText('Poland')).toBeInTheDocument();

      const [trigger] = screen.getAllByRole('button');
      await user.click(trigger);
      await user.click(screen.getByRole('option', { name: 'USA' }));

      expect(onChange).toHaveBeenCalledWith(['poland', 'usa']);
    });

    it('updates display when selecting options (controlled)', async () => {
      const user = userEvent.setup();
      render(<ControlledWrapper options={options} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await user.click(screen.getByRole('option', { name: 'Poland' }));
      expect(screen.getByText('Filter')).toBeInTheDocument();

      await user.click(screen.getByRole('option', { name: 'USA' }));
      expect(screen.getByText('Poland, +1')).toBeInTheDocument();
    });

    it('calls onChange when selecting', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterButton options={options} defaultValue={[]} onChange={onChange} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Poland'));

      expect(onChange).toHaveBeenCalledWith(['poland']);
    });

    it('calls onChange when deselecting', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterButton options={options} defaultValue={['poland']} onChange={onChange} />);

      const [trigger] = screen.getAllByRole('button');
      await user.click(trigger);
      await user.click(screen.getByRole('option', { name: 'Poland' }));

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('calls onChange when clicking reset', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <FilterButton options={options} defaultValue={['poland', 'usa']} onChange={onChange} />,
      );

      await user.click(screen.getByRole('button', { name: /clear filter/i }));

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Clear button', () => {
    it('is a sibling of the trigger, not nested inside it', () => {
      render(<FilterButton options={options} defaultValue={['poland']} onChange={() => {}} />);
      const clear = screen.getByRole('button', { name: 'Clear filter' });
      const trigger = screen.getByRole('button', { name: /poland/i });
      expect(trigger).not.toContainElement(clear);
    });

    it('clears with the keyboard without opening the menu and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<FilterButton options={options} defaultValue={['poland']} onChange={onChange} />);

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Clear filter' })).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith([]);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus();
    });

    it('is disabled when the filter is disabled', () => {
      render(
        <FilterButton options={options} defaultValue={['poland']} onChange={() => {}} disabled />,
      );
      expect(screen.getByRole('button', { name: 'Clear filter' })).toBeDisabled();
    });
  });

  describe('Variant props', () => {
    it('does not pass `selected` to the DOM', () => {
      render(<FilterButton options={options} onChange={() => {}} selected />);
      expect(screen.getByRole('button', { name: 'Filter' })).not.toHaveAttribute('selected');
    });
  });

  describe('Options with disabled items', () => {
    it('does not select disabled options', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<FilterButton options={options} defaultValue={[]} onChange={onChange} />);

      await user.click(screen.getByRole('button'));

      const canadaOption = screen.getByText('Canada');
      await user.click(canadaOption);

      // Should not have been called because Canada is disabled
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('List height', () => {
    it('stops the list at 18rem and at the room left in the window', async () => {
      const user = userEvent.setup();
      render(<FilterButton options={options} onChange={() => {}} />);

      await user.click(screen.getByRole('button', { name: 'Filter' }));

      const list = screen.getByRole('listbox', { name: 'Filter' });
      expect(list.closest('[data-slot="popup-container"]')).toHaveClass(
        'max-h-[var(--radix-popover-content-available-height)]',
      );
      expect(list.closest('[data-slot="scroll-area"]')).toHaveClass('max-h-[18rem]');
    });
  });

  describe('Custom className', () => {
    it('merges custom className with default classes', () => {
      render(
        <FilterButton
          options={options}
          defaultValue={[]}
          onChange={() => {}}
          className="custom-class"
        />,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});

// Snapshot Tests
describe('FilterButton Snapshots', () => {
  const options: FilterButtonProps['options'] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

  describe('Empty state', () => {
    sizes.forEach((size) => {
      it(`matches snapshot for size ${size}`, () => {
        const { container } = render(
          <FilterButton options={options} defaultValue={[]} onChange={() => {}} size={size} />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });

      it(`matches snapshot for size ${size} disabled`, () => {
        const { container } = render(
          <FilterButton
            options={options}
            defaultValue={[]}
            onChange={() => {}}
            size={size}
            disabled
          />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Selected state', () => {
    sizes.forEach((size) => {
      it(`matches snapshot for size ${size} with single selection`, () => {
        const { container } = render(
          <FilterButton
            options={options}
            defaultValue={['option1']}
            onChange={() => {}}
            size={size}
          />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });

      it(`matches snapshot for size ${size} with multiple selections`, () => {
        const { container } = render(
          <FilterButton
            options={options}
            defaultValue={['option1', 'option2']}
            onChange={() => {}}
            size={size}
          />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Custom props', () => {
    it('matches snapshot with custom placeholder', () => {
      const { container } = render(
        <FilterButton
          options={options}
          defaultValue={[]}
          onChange={() => {}}
          placeholder="Select items"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with custom label', () => {
      const { container } = render(
        <FilterButton
          options={options}
          defaultValue={['option1']}
          onChange={() => {}}
          label="Items"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('FilterButton keyboard navigation', () => {
  it('focuses next enabled item on ArrowDown, skips disabled, and loops at the end', async () => {
    const user = userEvent.setup();
    const navOptions: FilterButtonProps['options'] = [
      { label: 'Poland', value: 'poland' },
      { label: 'USA', value: 'usa' },
      { label: 'Germany', value: 'germany', disabled: true },
      { label: 'Canada', value: 'canada' },
    ];

    render(<FilterButton options={navOptions} defaultValue={[]} onChange={() => {}} />);

    await user.click(screen.getByRole('button'));

    const items = screen.getAllByRole('option');

    expect(items[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[3]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(items[0]).toHaveFocus();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(<FilterButton options={[{ label: 'Active', value: 'active' }]} onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'data-slot',
      'filter-button',
    );
  });
});
