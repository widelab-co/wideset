import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './Calendar';

describe('Calendar', () => {
  describe('Rendering', () => {
    it('should render days view by default', () => {
      render(<Calendar mode="single" />);

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should render with footer text', () => {
      render(<Calendar mode="single" footer="Pick a date" />);

      expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('should render with custom footer element', () => {
      render(<Calendar mode="single" footer={<span data-testid="custom-footer">Custom</span>} />);

      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    });

    it('should allow to pass additional props', () => {
      render(<Calendar mode="single" className="custom-class" data-testid="calendar" />);

      expect(screen.getByTestId('calendar')).toHaveClass('custom-class');
    });
  });

  describe('Interaction', () => {
    it('should open month picker when month trigger is clicked', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Select month'));

      expect(screen.getByRole('listbox', { name: 'Month selection' })).toBeInTheDocument();
      expect(screen.getByText('Select month')).toBeInTheDocument();

      const monthOptions = screen.getAllByRole('option');
      expect(monthOptions).toHaveLength(12);
    });

    it('should call onMonthSelect when a month is clicked', async () => {
      const user = userEvent.setup();
      const onMonthSelect = vi.fn();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} onMonthSelect={onMonthSelect} />);

      await user.click(screen.getByLabelText('Select month'));
      await user.click(screen.getByRole('option', { name: 'Mar' }));

      expect(onMonthSelect).toHaveBeenCalledWith(2);
    });

    it('should close month picker after selection', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Select month'));
      await user.click(screen.getByRole('option', { name: 'Mar' }));

      expect(screen.queryByRole('listbox', { name: 'Month selection' })).not.toBeInTheDocument();
    });

    it('should open year picker when year trigger is clicked', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Select year'));

      expect(screen.getByRole('listbox', { name: 'Year selection' })).toBeInTheDocument();
      expect(screen.getByText('Select year')).toBeInTheDocument();
    });

    it('should call onYearSelect when a year is clicked', async () => {
      const user = userEvent.setup();
      const onYearSelect = vi.fn();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} onYearSelect={onYearSelect} />);

      await user.click(screen.getByLabelText('Select year'));

      const yearButtons = screen.getAllByRole('option');
      await user.click(yearButtons[0]);

      expect(onYearSelect).toHaveBeenCalledTimes(1);
    });

    it('should navigate year pages in year picker', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Select year'));

      const yearsBefore = screen.getAllByRole('option').map((btn) => btn.textContent);

      await user.click(screen.getByTestId('next-year-button'));

      const yearsAfter = screen.getAllByRole('option').map((btn) => btn.textContent);

      expect(yearsAfter).not.toEqual(yearsBefore);
    });

    it('should switch from month picker to year picker', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Select month'));
      expect(screen.getByRole('listbox', { name: 'Month selection' })).toBeInTheDocument();

      await user.click(document.body);
      expect(screen.queryByRole('listbox', { name: 'Month selection' })).not.toBeInTheDocument();

      await user.click(screen.getByLabelText('Select year'));
      expect(screen.getByRole('listbox', { name: 'Year selection' })).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for days view', () => {
      const { container } = render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for range mode', () => {
      const { container } = render(
        <Calendar
          mode="range"
          month={new Date(2025, 0, 1)}
          selected={{ from: new Date(2025, 0, 10), to: new Date(2025, 0, 15) }}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with footer', () => {
      const { container } = render(
        <Calendar mode="single" month={new Date(2025, 0, 1)} footer="Select a date" />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('Controlled vs uncontrolled month', () => {
    it('should update displayed month internally when uncontrolled', async () => {
      const user = userEvent.setup();

      render(<Calendar mode="single" selected={new Date(2025, 0, 1)} />);

      await user.click(screen.getByLabelText('Next month'));

      expect(screen.getByLabelText('Select month')).toHaveTextContent('Feb');
    });

    it('should not update displayed month internally when controlled', async () => {
      const user = userEvent.setup();
      const onMonthChange = vi.fn();

      render(<Calendar mode="single" month={new Date(2025, 0, 1)} onMonthChange={onMonthChange} />);

      await user.click(screen.getByLabelText('Next month'));

      expect(onMonthChange).toHaveBeenCalledTimes(1);
      expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(1);
      expect(screen.getByLabelText('Select month')).toHaveTextContent('Jan');
    });

    it('should open on defaultMonth when uncontrolled', () => {
      render(<Calendar mode="single" defaultMonth={new Date(2025, 4, 15)} />);

      expect(screen.getByLabelText('Select month')).toHaveTextContent('May');
      expect(screen.getByLabelText('Select year')).toHaveTextContent('2025');
    });

    it('should navigate from defaultMonth when uncontrolled', async () => {
      const user = userEvent.setup();
      const onMonthChange = vi.fn();

      render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 4, 15)}
          onMonthChange={onMonthChange}
        />,
      );

      await user.click(screen.getByLabelText('Next month'));

      expect(onMonthChange).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText('Select month')).toHaveTextContent('Jun');
    });

    it('should prefer month over defaultMonth when controlled', () => {
      render(
        <Calendar
          mode="single"
          month={new Date(2025, 0, 1)}
          defaultMonth={new Date(2025, 4, 1)}
          onMonthChange={() => {}}
        />,
      );

      expect(screen.getByLabelText('Select month')).toHaveTextContent('Jan');
    });

    it('should open on the month of today when nothing is selected', () => {
      render(<Calendar mode="single" today={new Date(2024, 0, 10)} />);

      expect(screen.getByRole('grid', { name: 'January 2024' })).toBeInTheDocument();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Calendar mode="single" month={new Date(2025, 0, 1)} footer="Pick a date" />,
    );

    expect(container.querySelector('[data-slot="calendar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="calendar-month-caption"]')).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toHaveAttribute('data-slot', 'calendar-footer');

    await user.click(screen.getByLabelText('Select month'));
    expect(screen.getByRole('listbox', { name: 'Month selection' })).toHaveAttribute(
      'data-slot',
      'calendar-month-grid',
    );
  });

  it('marks the year grid with data-slot', async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" month={new Date(2025, 0, 1)} />);

    await user.click(screen.getByLabelText('Select year'));
    expect(screen.getByRole('listbox')).toHaveAttribute('data-slot', 'calendar-year-grid');
  });
});
