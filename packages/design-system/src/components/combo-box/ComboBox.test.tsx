import { RiCheckboxBlankCircleLine } from '@remixicon/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { RemixiconProps } from '../../types/icon.types';
import { ComboBox } from './ComboBox';

const options = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk' },
];

// Thin wrapper over a real Remix icon so the component under test still gets the
// exact type it ships with, while keeping a stable test id to assert on.
const MockIcon = (props: RemixiconProps) => (
  <RiCheckboxBlankCircleLine data-testid="mock-icon" {...props} />
);

describe('ComboBox', () => {
  describe('rendering', () => {
    it('should render with placeholder', () => {
      render(<ComboBox options={options} placeholder="Select country" />);
      expect(screen.getByText('Select country')).toBeInTheDocument();
    });

    it('should render with defaultValue', () => {
      render(<ComboBox options={options} defaultValue="poland" />);
      expect(screen.getByText('Poland')).toBeInTheDocument();
    });

    it('should render with prefix icon', () => {
      render(
        <ComboBox options={options} placeholder="Select country">
          <ComboBox.Prefix>
            <ComboBox.Icon icon={MockIcon} />
          </ComboBox.Prefix>
        </ComboBox>,
      );
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should spread rest props onto the trigger element', () => {
      render(
        <ComboBox
          options={options}
          placeholder="Select country"
          id="country-combobox"
          aria-label="Country"
          data-testid="country-trigger"
        />,
      );

      const trigger = screen.getByRole('combobox', { name: 'Country' });
      expect(trigger).toHaveAttribute('id', 'country-combobox');
      expect(trigger).toHaveAttribute('data-testid', 'country-trigger');
    });
  });

  describe('opening and closing', () => {
    it('should open dropdown on click and show options', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" />);

      await user.click(screen.getByText('Select country'));

      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });

    it('should link the trigger to the listbox with aria-controls', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" />);

      await user.click(screen.getByText('Select country'));

      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        const listbox = screen.getByRole('listbox');

        expect(listbox).toHaveAttribute('id');
        expect(combobox).toHaveAttribute('aria-controls', listbox.id);
      });
    });

    it('should close dropdown on Escape', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" />);

      await user.click(screen.getByText('Select country'));
      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('filtering', () => {
    it('should filter options on typing', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" disallowCustomValue />);

      await user.click(screen.getByText('Select country'));
      await user.keyboard('pol');

      await waitFor(() => {
        const listItems = screen.getAllByRole('option');
        expect(listItems).toHaveLength(1);
        expect(listItems[0]).toHaveTextContent('Poland');
      });
    });

    it('should highlight the filtered option while typing', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" disallowCustomValue />);

      await user.click(screen.getByText('Select country'));
      await user.keyboard('pol');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Poland' })).toHaveAttribute(
          'data-highlighted',
          'true',
        );
      });
    });

    it('should clear the search filter after blur in disallowCustomValue mode', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" disallowCustomValue />);

      await user.click(screen.getByText('Select country'));
      await user.keyboard('pol');
      await user.tab();
      await user.click(screen.getByText('Select country'));

      await waitFor(() => {
        expect(screen.queryByDisplayValue('pol')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
        const listItems = screen.getAllByRole('option');
        expect(listItems).toHaveLength(options.length);
      });
    });

    it('should clear the search filter after clicking outside in disallowCustomValue mode', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ComboBox options={options} placeholder="Select country" disallowCustomValue />
          <button type="button">Outside</button>
        </>,
      );

      await user.click(screen.getByText('Select country'));
      await user.keyboard('pol');
      await user.click(screen.getByText('Outside'));
      await user.click(screen.getByText('Select country'));

      await waitFor(() => {
        expect(screen.queryByDisplayValue('pol')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(options.length);
      });
    });
  });

  describe('selection', () => {
    it('should select option on click', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" onChange={onChange} />);

      await user.click(screen.getByText('Select country'));
      await waitFor(() => {
        expect(screen.getByText('Poland')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Poland'));

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('poland');
        expect(screen.getByText('Poland')).toBeInTheDocument();
      });
    });

    it('should not select disabled option', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" onChange={onChange} />);

      await user.click(screen.getByText('Select country'));
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Canada'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should clear selected value when clear button is clicked', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      const user = userEvent.setup();
      render(
        <ComboBox
          options={options}
          placeholder="Select country"
          defaultValue="poland"
          clearable
          onChange={onChange}
          onClear={onClear}
        />,
      );

      await user.click(screen.getByLabelText('Clear selection'));

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
        expect(onClear).toHaveBeenCalled();
        expect(screen.getByText('Select country')).toBeInTheDocument();
      });
    });

    it('should show the clear button while typing', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" clearable />);

      await user.click(screen.getByText('Select country'));
      await user.keyboard('pol');

      await waitFor(() => {
        expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
      });
    });

    it('should leave combobox unselected when cleared in disallowCustomValue mode', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ComboBox
          options={options}
          placeholder="Select country"
          defaultValue="poland"
          disallowCustomValue
          onChange={onChange}
        />,
      );

      await user.click(screen.getByText('Poland'));
      await user.clear(screen.getByDisplayValue('Poland'));

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
      });

      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Select country')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should move the combobox role to the filter input while open', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" aria-label="Country" />);

      await user.click(screen.getByRole('combobox', { name: 'Country' }));

      await waitFor(() => {
        const combobox = screen.getByRole('combobox', { name: 'Country' });
        expect(combobox.tagName).toBe('INPUT');
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
      });
      expect(screen.getAllByRole('combobox')).toHaveLength(1);
    });

    it('should keep aria-activedescendant on the option when ComboBox.Item gets an id', async () => {
      const user = userEvent.setup();
      render(
        <ComboBox options={options}>
          <ComboBox.Trigger placeholder="Select country" aria-label="Country" />
          <ComboBox.Content>
            {(option) => <ComboBox.Item id={`custom-${option.value}`} value={option.value} />}
          </ComboBox.Content>
        </ComboBox>,
      );

      await user.click(screen.getByRole('combobox', { name: 'Country' }));
      const input = await screen.findByRole('combobox', { name: 'Country', expanded: true });
      await waitFor(() => expect(input).toHaveFocus());

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Poland' }).id,
      );
    });

    it('should point aria-activedescendant at the highlighted option', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" aria-label="Country" />);

      await user.click(screen.getByRole('combobox', { name: 'Country' }));
      const input = await screen.findByRole('combobox', { name: 'Country', expanded: true });
      await waitFor(() => expect(input).toHaveFocus());

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'Poland' }).id,
      );

      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', { name: 'USA' }).id,
      );
    });

    it('should be named by aria-labelledby', async () => {
      const user = userEvent.setup();
      render(
        <>
          <span id="country-label">Country</span>
          <ComboBox aria-labelledby="country-label" options={options} placeholder="Select" />
        </>,
      );

      expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();

      await user.click(screen.getByRole('combobox', { name: 'Country' }));

      expect(
        await screen.findByRole('combobox', { name: 'Country', expanded: true }),
      ).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate with ArrowDown and select with Enter', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" onChange={onChange} />);

      await user.click(screen.getByText('Select country'));
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('usa');
      });
    });

    it('should highlight the first enabled option when opening with a disabled first option', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ComboBox
          options={[
            { label: 'Canada', value: 'canada', disabled: true },
            { label: 'Poland', value: 'poland' },
            { label: 'USA', value: 'usa' },
          ]}
          placeholder="Select country"
          onChange={onChange}
        />,
      );

      await user.click(screen.getByText('Select country'));
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('poland');
      });
    });
  });

  describe('controlled mode', () => {
    it('should reflect external value changes', () => {
      const { rerender } = render(
        <ComboBox options={options} value="poland" placeholder="Select country" />,
      );
      expect(screen.getByText('Poland')).toBeInTheDocument();

      rerender(<ComboBox options={options} value="usa" placeholder="Select country" />);
      expect(screen.getByText('USA')).toBeInTheDocument();
    });
  });

  describe('custom value by default', () => {
    it('should update custom value while typing', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" onChange={onChange} />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('custom');

      await waitFor(() => {
        expect(onChange).toHaveBeenLastCalledWith('custom');
      });
    });

    it('should accept typed custom value on Enter', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" onChange={onChange} />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('custom text{Enter}');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('custom text');
      });
    });

    it('should filter options while typing custom value', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('pol');

      await waitFor(() => {
        const listItems = screen.getAllByRole('option');
        expect(listItems).toHaveLength(1);
        expect(listItems[0]).toHaveTextContent('Poland');
        expect(listItems[0]).toHaveAttribute('data-highlighted', 'true');
      });
    });

    it('should commit typed custom value on blur', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" onChange={onChange} />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('custom blur');
      await user.tab();

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('custom blur');
        expect(screen.getByText('custom blur')).toBeInTheDocument();
      });
    });

    it('should show typed custom value after blur in controlled mode', async () => {
      const user = userEvent.setup();

      const ControlledComboBox = () => {
        const [value, setValue] = React.useState('');

        return (
          <ComboBox
            options={options}
            placeholder="Type or select"
            value={value}
            onChange={setValue}
          />
        );
      };

      render(<ControlledComboBox />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('controlled blur');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('controlled blur')).toBeInTheDocument();
      });
    });

    it('should show typed custom value after blur when clearable is enabled', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" clearable />);

      await user.click(screen.getByText('Type or select'));
      await user.keyboard('clearable blur');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('clearable blur')).toBeInTheDocument();
      });
    });

    it('should show selected option label when reopened in custom value mode', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Type or select" defaultValue="poland" />);

      await user.click(screen.getByText('Poland'));

      await waitFor(() => {
        expect(screen.getByDisplayValue('Poland')).toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should not open when disabled', async () => {
      const user = userEvent.setup();
      render(<ComboBox options={options} placeholder="Select country" disabled />);

      await user.click(screen.getByText('Select country'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('should match snapshot for default ComboBox', () => {
      const { container } = render(<ComboBox options={options} placeholder="Select country" />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with prefix icon', () => {
      const { container } = render(
        <ComboBox options={options} placeholder="Select country">
          <ComboBox.Prefix>
            <ComboBox.Icon icon={MockIcon} />
          </ComboBox.Prefix>
        </ComboBox>,
      );
      expect(container).toMatchSnapshot();
    });

    it.each(['sm', 'md', 'lg'] as const)('should match snapshot for size="%s"', (size) => {
      const { container } = render(
        <ComboBox options={options} placeholder="Select country" size={size} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for danger variant', () => {
      const { container } = render(
        <ComboBox options={options} placeholder="Select country" variant="danger" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for disabled state', () => {
      const { container } = render(
        <ComboBox options={options} placeholder="Select country" disabled />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for opened dropdown with options', async () => {
      const user = userEvent.setup();
      const { baseElement } = render(<ComboBox options={options} placeholder="Select country" />);

      await user.click(screen.getByText('Select country'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(baseElement).toMatchSnapshot();
    });
  });
});

describe('ComboBox data-slot', () => {
  it('marks each part with data-slot', async () => {
    const user = userEvent.setup();
    render(
      <ComboBox options={options} placeholder="Select country">
        <ComboBox.Prefix inner>
          <ComboBox.Icon icon={RiCheckboxBlankCircleLine} />
        </ComboBox.Prefix>
      </ComboBox>,
    );
    const slot = (name: string) => document.querySelectorAll(`[data-slot="${name}"]`);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'combo-box-trigger');
    expect(slot('combo-box-prefix')).toHaveLength(1);
    expect(slot('combo-box-icon')).toHaveLength(1);

    await user.click(screen.getByText('Select country'));

    await waitFor(() => {
      expect(slot('combo-box-content')).toHaveLength(1);
    });
    expect(slot('combo-box-item')).toHaveLength(options.length);
  });
});

// Kept after the snapshot blocks: an earlier render would shift the useId values they record.
describe('ComboBox aria-invalid', () => {
  it('marks the filter input invalid in the danger variant', async () => {
    const user = userEvent.setup();
    render(<ComboBox options={options} placeholder="Select country" variant="danger" />);

    await user.click(screen.getByText('Select country'));

    // Open, the filter input carries the combobox role.
    expect(await screen.findByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('ComboBox clear button', () => {
  it('places the clear button in the row, right before the chevron', () => {
    render(<ComboBox options={options} defaultValue="poland" clearable />);

    const clearButton = screen.getByRole('button', { name: 'Clear selection' });
    // In the row: no offset or negative margin pulls it away from the chevron.
    expect(clearButton.className).not.toMatch(/(^|\s)-?(right|left)-|-ml-/);
    expect(clearButton.previousElementSibling).toHaveTextContent('Poland');
    expect(clearButton.nextElementSibling?.querySelector('svg')).toBeInTheDocument();
  });
});
