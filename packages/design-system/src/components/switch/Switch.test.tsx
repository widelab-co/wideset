import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  describe('Basic rendering', () => {
    it('should render a switch element', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('should render without label by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(screen.queryByText('Label')).not.toBeInTheDocument();
    });

    it('should not be checked by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeChecked();
      expect(switchElement).not.toBeDisabled();
    });

    it('should be checked when defaultChecked is true', () => {
      render(<Switch defaultChecked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeChecked();
    });

    it('should associate label with switch', () => {
      render(<Switch id="test-switch" label="Accessible Label" />);
      const label = screen.getByText('Accessible Label').closest('label');
      expect(label).toHaveAttribute('for', 'test-switch');
    });
  });

  describe('Label rendering', () => {
    it('should render label when provided', () => {
      render(<Switch label="Test Label" />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render label on the right by default', () => {
      render(<Switch label="Right Label" />);
      const container = screen.getByText('Right Label').parentElement;
      expect(container).not.toHaveClass('flex-row-reverse');
    });

    it('should render label on the left when labelPosition is left', () => {
      render(<Switch label="Left Label" labelPosition="left" />);
      const container = screen.getByText('Left Label').parentElement;
      expect(container).toHaveClass('flex-row-reverse');
    });

    it('should render label on the right when labelPosition is right', () => {
      render(<Switch label="Right Label" labelPosition="right" />);
      const container = screen.getByText('Right Label').parentElement;
      expect(container).not.toHaveClass('flex-row-reverse');
    });

    it('renders label and ignores children when both are provided', () => {
      render(
        // @ts-expect-error label and children are mutually exclusive
        <Switch label="String label">
          <Switch.Label>Composed label</Switch.Label>
        </Switch>,
      );
      expect(screen.getByText('String label')).toBeInTheDocument();
      expect(screen.queryByText('Composed label')).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('toggles from unchecked to checked on click', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      expect(switchElement).not.toBeChecked();
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
    });

    it('toggles back to unchecked on second click', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      await user.click(switchElement);
      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    it('calls onCheckedChange with true when switching on', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleCheckedChange} />);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledOnce();
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it('calls onCheckedChange with false when switching off', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch defaultChecked onCheckedChange={handleCheckedChange} />);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledOnce();
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Disabled state', () => {
    it('should render disabled switch', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('should not be clickable when disabled', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch disabled onCheckedChange={handleCheckedChange} />);
      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);
      expect(handleCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML attributes', () => {
      render(<Switch data-testid="custom-switch" aria-label="Toggle setting" />);
      const switchElement = screen.getByTestId('custom-switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Toggle setting');
    });

    it('puts className on the same element as ref', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Switch ref={ref} label="Label" className="custom-class" />);
      expect(ref.current).toBe(screen.getByRole('switch'));
      expect(ref.current).toHaveClass('custom-class');
      expect(ref.current?.parentElement).not.toHaveClass('custom-class');
    });

    it('puts wrapperClassName on the row', () => {
      render(<Switch label="Label" wrapperClassName="w-full" className="custom-class" />);
      const row = screen.getByRole('switch').parentElement;
      expect(row).toHaveClass('w-full');
      expect(row).not.toHaveClass('custom-class');
    });

    it('should handle data attributes', () => {
      render(<Switch data-testid="test-switch" data-custom="value" />);
      const switchElement = screen.getByTestId('test-switch');
      expect(switchElement).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Switch.Label', () => {
    it('renders with Switch.Label as children', () => {
      render(
        <Switch>
          <Switch.Label>Test switch</Switch.Label>
        </Switch>,
      );
      expect(screen.getByText('Test switch')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('associates Switch.Label with switch via id and htmlFor prop', () => {
      render(
        <Switch id="test-id">
          <Switch.Label htmlFor="test-id">Test switch</Switch.Label>
        </Switch>,
      );
      const label = screen.getByText('Test switch');
      expect(label).toHaveAttribute('for', 'test-id');
    });

    it('associates Switch.Label with switch automatically when htmlFor is not provided', () => {
      render(
        <Switch id="test-id">
          <Switch.Label>Test switch</Switch.Label>
        </Switch>,
      );
      const label = screen.getByText('Test switch');
      expect(label).toHaveAttribute('for', 'test-id');
    });

    it('associates Switch.Label with switch using generated fallback id when no id is provided', () => {
      render(
        <Switch>
          <Switch.Label>Test switch</Switch.Label>
        </Switch>,
      );
      const label = screen.getByText('Test switch');
      const switchEl = screen.getByRole('switch');
      expect(label).toHaveAttribute('for', switchEl.id);
    });

    it('can be toggled when using Switch.Label', async () => {
      const user = userEvent.setup();
      render(
        <Switch id="switch1">
          <Switch.Label htmlFor="switch1">Option 1</Switch.Label>
        </Switch>,
      );
      const switchElement = screen.getByRole('switch', { name: 'Option 1' });

      expect(switchElement).not.toBeChecked();
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    it('calls onCheckedChange when switch with Switch.Label is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Switch id="switch1" onCheckedChange={handleChange}>
          <Switch.Label htmlFor="switch1">Option 1</Switch.Label>
        </Switch>,
      );
      const switchElement = screen.getByRole('switch', { name: 'Option 1' });

      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('forwards HTML attributes to Switch.Label', () => {
      render(
        <Switch id="test-id">
          <Switch.Label
            htmlFor="test-id"
            data-testid="custom-label"
            className="custom-label-class"
            aria-label="Custom label"
          >
            Test switch
          </Switch.Label>
        </Switch>,
      );
      const label = screen.getByTestId('custom-label');
      expect(label).toHaveClass('custom-label-class');
      expect(label).toHaveAttribute('aria-label', 'Custom label');
    });
  });

  describe('Switch.Description', () => {
    it('renders next to Switch.Label and forwards attributes', () => {
      render(
        <Switch>
          <Switch.Label>Email notifications</Switch.Label>
          <Switch.Description className="custom-class" data-testid="description">
            Sent once a day
          </Switch.Description>
        </Switch>,
      );
      const description = screen.getByText('Sent once a day');
      expect(description).toHaveAttribute('data-slot', 'switch-description');
      expect(description).toHaveClass('custom-class');
      expect(description).toHaveAttribute('data-testid', 'description');
    });

    it('describes the switch', () => {
      render(
        <Switch aria-describedby="external">
          <Switch.Label>Email notifications</Switch.Label>
          <Switch.Description>Sent once a day</Switch.Description>
        </Switch>,
      );
      const switchElement = screen.getByRole('switch');
      const description = screen.getByText('Sent once a day');
      expect(switchElement).toHaveAccessibleDescription('Sent once a day');
      expect(switchElement.getAttribute('aria-describedby')?.split(' ')).toEqual([
        'external',
        description.id,
      ]);
    });

    it('keeps a caller id on the description', () => {
      render(
        <Switch>
          <Switch.Label>Email notifications</Switch.Label>
          <Switch.Description id="custom-id">Sent once a day</Switch.Description>
        </Switch>,
      );
      expect(screen.getByRole('switch')).toHaveAttribute('aria-describedby', 'custom-id');
    });
  });

  describe('Keyboard', () => {
    it('should skip a disabled switch with Tab and Shift+Tab', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before switch</button>
          <Switch disabled label="Disabled switch" />
          <button type="button">After switch</button>
        </>,
      );

      const before = screen.getByRole('button', { name: 'Before switch' });
      const after = screen.getByRole('button', { name: 'After switch' });

      await user.tab();
      expect(before).toHaveFocus();

      await user.tab();
      expect(after).toHaveFocus();

      await user.tab({ shift: true });
      expect(before).toHaveFocus();
    });

    it('should support Enter key to toggle', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      await user.tab();
      expect(switchElement).not.toBeChecked();

      await user.keyboard('{Enter}');
      expect(switchElement).toBeChecked();

      await user.keyboard('{Enter}');
      expect(switchElement).not.toBeChecked();
    });

    it('should support Space key to toggle', async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      await user.tab();
      expect(switchElement).not.toBeChecked();

      await user.keyboard(' ');
      expect(switchElement).toBeChecked();

      await user.keyboard(' ');
      expect(switchElement).not.toBeChecked();
    });
  });
});

describe('Switch Snapshots', () => {
  const labelPositions: Array<'left' | 'right'> = ['left', 'right'];

  it('matches snapshot without label', () => {
    const { container } = render(<Switch id="snapshot" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with label unchecked', () => {
    const { container } = render(<Switch id="snapshot" label="Switch" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with label checked', () => {
    const { container } = render(<Switch id="snapshot" label="Switch" defaultChecked />);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('Label positions', () => {
    labelPositions.forEach((labelPosition) => {
      it(`matches snapshot for labelPosition ${labelPosition}`, () => {
        const { container } = render(
          <Switch id="snapshot" label="Switch Label" labelPosition={labelPosition} />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Disabled state', () => {
    it('matches snapshot for disabled unchecked', () => {
      const { container } = render(<Switch id="snapshot" label="Switch" disabled />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for disabled checked', () => {
      const { container } = render(<Switch id="snapshot" label="Switch" disabled defaultChecked />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Sizes', () => {
    const sizes: Array<'sm' | 'lg'> = ['sm', 'lg'];

    sizes.forEach((size) => {
      it(`matches snapshot for ${size} size without label`, () => {
        const { container } = render(<Switch id="snapshot" size={size} />);
        expect(container.firstChild).toMatchSnapshot();
      });

      it(`matches snapshot for ${size} size with label`, () => {
        const { container } = render(<Switch id="snapshot" size={size} label="Switch Label" />);
        expect(container.firstChild).toMatchSnapshot();
      });

      it(`matches snapshot for ${size} size unchecked`, () => {
        const { container } = render(<Switch id="snapshot" size={size} label="Switch" />);
        expect(container.firstChild).toMatchSnapshot();
      });

      it(`matches snapshot for ${size} size checked`, () => {
        const { container } = render(
          <Switch id="snapshot" size={size} label="Switch" defaultChecked />,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Switch Snapshots with Switch.Label', () => {
    it('matches snapshot for switch with Switch.Label', () => {
      const { container } = render(
        <Switch id="snapshot-1">
          <Switch.Label>Test switch</Switch.Label>
        </Switch>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for disabled switch with Switch.Label', () => {
      const { container } = render(
        <Switch id="snapshot-2" disabled>
          <Switch.Label>Disabled switch</Switch.Label>
        </Switch>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <>
        <Switch label="Email notifications" />
        <Switch>
          <Switch.Label>Push notifications</Switch.Label>
        </Switch>
      </>,
    );

    screen
      .getAllByRole('switch')
      .forEach((control) => expect(control).toHaveAttribute('data-slot', 'switch'));
    expect(screen.getByText('Email notifications')).toHaveAttribute('data-slot', 'switch-label');
    expect(screen.getByText('Push notifications')).toHaveAttribute('data-slot', 'switch-label');
  });
});
