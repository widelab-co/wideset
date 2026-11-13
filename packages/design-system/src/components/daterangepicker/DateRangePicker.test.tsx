import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DateRangePicker } from './DateRangePicker';

const FIXED_DATE = new Date(2025, 5, 15);

describe('DateRangePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render trigger with placeholder', () => {
      render(<DateRangePicker placeholder="Select range" />);

      expect(screen.getByPlaceholderText('Select range')).toBeInTheDocument();
    });

    it('should render as disabled', () => {
      render(<DateRangePicker disabled />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should display preset label in trigger when defaultDatePreset is set', () => {
      render(<DateRangePicker defaultDatePreset="thisMonth" placeholder="Select range" />);

      const input = screen.getByPlaceholderText('Select range') as HTMLInputElement;
      expect(input.value).toBe('This Month');
    });

    it('should match snapshot', () => {
      const { container } = render(<DateRangePicker placeholder="Select range" className="w-72" />);

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with default preset', () => {
      const { container } = render(
        <DateRangePicker
          defaultDatePreset="thisWeek"
          placeholder="Select range"
          className="w-72"
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Popup', () => {
    it('should open popup on click', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker />);
      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Presets panel', () => {
    it('should show presets panel when showDatePresets is true', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker showDatePresets />);
      await user.click(screen.getByRole('button'));

      expect(screen.getByText('This Week')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should not show presets panel when showDatePresets is false', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker showDatePresets={false} />);
      await user.click(screen.getByRole('button'));

      expect(screen.queryByText('This Week')).not.toBeInTheDocument();
    });

    it('should select a preset and close popup', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DateRangePicker showDatePresets onSelect={onSelect} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('This Week'));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ from: expect.any(String), to: expect.any(String) }),
        'thisWeek',
      );
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('should stay open when clicking Custom', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker showDatePresets />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Custom'));

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should respect weekStartsOn for thisWeek preset', async () => {
      const user = userEvent.setup();
      const onSelectSunday = vi.fn();
      const onSelectMonday = vi.fn();

      const { unmount } = render(
        <DateRangePicker showDatePresets weekStartsOn={0} onSelect={onSelectSunday} />,
      );
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('This Week'));
      expect(onSelectSunday).toHaveBeenCalledWith(
        { from: '2025-06-15', to: '2025-06-21' },
        'thisWeek',
      );
      unmount();

      render(<DateRangePicker showDatePresets weekStartsOn={1} onSelect={onSelectMonday} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('This Week'));
      expect(onSelectMonday).toHaveBeenCalledWith(
        { from: '2025-06-09', to: '2025-06-15' },
        'thisWeek',
      );
    });

    it('should match snapshot when opened with presets', async () => {
      const user = userEvent.setup();
      const { baseElement } = render(
        <DateRangePicker showDatePresets placeholder="Select range" className="w-72" />,
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('should count a preset from the today prop', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DateRangePicker showDatePresets today={new Date(2024, 0, 10)} onSelect={onSelect} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button', { name: 'Last Month' }));

      expect(onSelect).toHaveBeenCalledWith({ from: '2023-12-01', to: '2023-12-31' }, 'lastMonth');
    });

    it('should count defaultDatePreset from the today prop', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker defaultDatePreset="thisMonth" today={new Date(2024, 0, 10)} />);
      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('grid', { name: 'January 2024' })).toBeInTheDocument();
    });
  });

  describe('Calendar selection', () => {
    it('should select a date range via calendar and call onSelect', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DateRangePicker onSelect={onSelect} defaultMonth={new Date(2026, 2)} />);
      await user.click(screen.getByRole('button'));

      await user.click(screen.getByText('10'));
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(onSelect).not.toHaveBeenCalled();

      await user.click(screen.getByText('15'));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ from: expect.any(String), to: expect.any(String) }),
        'custom',
      );
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  describe('Controlled mode', () => {
    it('should display the controlled selected range in the trigger', () => {
      render(
        <DateRangePicker
          selected={{ from: '2025-06-10', to: '2025-06-15' }}
          placeholder="Select range"
        />,
      );

      const input = screen.getByPlaceholderText('Select range') as HTMLInputElement;
      expect(input.value).toBe('06/10/25 – 06/15/25');
    });

    it('should display the controlled activeDatePreset label in the trigger', () => {
      render(<DateRangePicker activeDatePreset="thisWeek" placeholder="Select range" />);

      const input = screen.getByPlaceholderText('Select range') as HTMLInputElement;
      expect(input.value).toBe('This Week');
    });

    it('should keep the first click of a range picked in the calendar', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(
        <DateRangePicker selected={{}} onSelect={onSelect} defaultMonth={new Date(2026, 2)} />,
      );
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button', { name: /March 10th, 2026/ }));
      await user.click(screen.getByRole('button', { name: /March 15th, 2026/ }));

      expect(onSelect).toHaveBeenCalledWith({ from: '2026-03-10', to: '2026-03-15' }, 'custom');
    });

    it('should report a one-day range when the start day is clicked twice', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DateRangePicker onSelect={onSelect} defaultMonth={new Date(2026, 2)} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button', { name: /March 10th, 2026/ }));
      await user.click(screen.getByRole('button', { name: /March 10th, 2026/ }));

      expect(onSelect).toHaveBeenCalledWith({ from: '2026-03-10', to: '2026-03-10' }, 'custom');
    });

    it('should not commit a single click when the popup closes', async () => {
      const user = userEvent.setup();

      render(<DateRangePicker defaultMonth={new Date(2026, 2)} />);
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button', { name: /March 10th, 2026/ }));
      await user.keyboard('{Escape}');

      expect(screen.getByPlaceholderText('Select date range')).toHaveValue('');
    });
  });

  describe('Accessible name', () => {
    it('should be named by an associated <label htmlFor>', () => {
      render(
        <>
          <label htmlFor="when">Travel dates</label>
          <DateRangePicker id="when" defaultDatePreset="thisMonth" />
        </>,
      );

      expect(screen.getByLabelText('Travel dates')).toBe(screen.getByRole('button'));
      expect(screen.getByRole('button', { name: 'Travel dates' })).toBeInTheDocument();
    });

    it('should be named by aria-labelledby', () => {
      render(
        <>
          <span id="when-label">Travel dates</span>
          <DateRangePicker aria-labelledby="when-label" />
        </>,
      );

      expect(screen.getByRole('button', { name: 'Travel dates' })).toBeInTheDocument();
    });

    it('should use a caller aria-label', () => {
      render(<DateRangePicker aria-label="Travel dates" defaultDatePreset="thisMonth" />);

      expect(screen.getByRole('button', { name: 'Travel dates' })).toBeInTheDocument();
    });

    it('should fall back to the placeholder without a label', () => {
      render(<DateRangePicker />);

      expect(screen.getByRole('button', { name: 'Select date range' })).toBeInTheDocument();
    });

    it('should fall back to the displayed value without a label', () => {
      render(<DateRangePicker defaultDatePreset="thisMonth" />);

      expect(screen.getByRole('button', { name: 'This Month' })).toBeInTheDocument();
    });
  });

  describe('Ref', () => {
    it('should forward ref to the trigger button', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<DateRangePicker ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Preset labels', () => {
    it('should show a custom preset label in the trigger', () => {
      render(
        <DateRangePicker defaultDatePreset="thisWeek" presetLabels={{ thisWeek: 'This week' }} />,
      );

      expect(screen.getByRole('button', { name: 'This week' })).toBeInTheDocument();
    });

    it('should fall back to the built-in label for a key left undefined', async () => {
      const user = userEvent.setup();

      render(
        <DateRangePicker
          showDatePresets
          presetLabels={{ thisWeek: undefined, lastMonth: 'Last month' }}
        />,
      );
      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('button', { name: 'This Week' })).toBeInTheDocument();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showDatePresets />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('data-slot', 'date-range-picker');

    await user.click(trigger);
    expect(document.querySelector('[data-slot="date-range-picker-presets"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
  });
});
