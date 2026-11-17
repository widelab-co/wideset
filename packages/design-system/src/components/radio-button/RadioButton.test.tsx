import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  it('renders without label', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" label="Test radio button" />
      </RadioButton.Group>,
    );
    expect(screen.getByText('Test radio button')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with label and description', () => {
    render(
      <RadioButton.Group>
        <RadioButton
          value="option1"
          label="Test radio button"
          description="This is a description"
        />
      </RadioButton.Group>,
    );
    expect(screen.getByText('Test radio button')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" className="custom-class" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('custom-class');
  });

  it('renders as unchecked by default', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).not.toBeChecked();
  });

  it('renders as checked when value matches group value', () => {
    render(
      <RadioButton.Group value="option1">
        <RadioButton value="option1" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('can be selected', async () => {
    const user = userEvent.setup();
    render(
      <RadioButton.Group>
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
      </RadioButton.Group>,
    );
    const radio1 = screen.getByRole('radio', { name: 'Option 1' });
    const radio2 = screen.getByRole('radio', { name: 'Option 2' });

    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it('is disabled when disabled prop is true', async () => {
    const user = userEvent.setup();
    render(
      <RadioButton.Group>
        <RadioButton value="option1" disabled label="Disabled radio button" />
      </RadioButton.Group>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();

    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(radio).not.toBeChecked();
  });

  it('forwards HTML attributes', () => {
    render(
      <RadioButton.Group>
        <RadioButton
          value="option1"
          data-testid="custom-radio"
          aria-label="Custom radio button"
          aria-describedby="description"
        />
      </RadioButton.Group>,
    );
    const radio = screen.getByTestId('custom-radio');
    expect(radio).toHaveAttribute('aria-label', 'Custom radio button');
    expect(radio).toHaveAttribute('aria-describedby', 'description');
  });

  it('uses custom id when provided', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="custom-id" label="Test" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('id', 'custom-id');
  });

  it('generates id when not provided', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" label="Test" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    const id = radio.getAttribute('id');
    expect(id).not.toBeNull();
  });

  it('associates label with radio button via id', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="test-id" label="Test radio button" />
      </RadioButton.Group>,
    );
    const label = screen.getByText('Test radio button');
    expect(label).toHaveAttribute('for', 'test-id');
  });

  it('calls onValueChange when radio button is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioButton.Group onValueChange={handleChange}>
        <RadioButton value="option1" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');

    await user.click(radio);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('uses defaultValue for uncontrolled radio group', () => {
    render(
      <RadioButton.Group defaultValue="option1">
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
      </RadioButton.Group>,
    );
    const radio1 = screen.getByRole('radio', { name: 'Option 1' });
    const radio2 = screen.getByRole('radio', { name: 'Option 2' });
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
  });

  it('can be uncontrolled with defaultValue and still toggle', async () => {
    const user = userEvent.setup();
    render(
      <RadioButton.Group defaultValue="option1">
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
      </RadioButton.Group>,
    );
    const radio1 = screen.getByRole('radio', { name: 'Option 1' });
    const radio2 = screen.getByRole('radio', { name: 'Option 2' });

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it('applies required attribute', () => {
    render(
      <RadioButton.Group required>
        <RadioButton value="option1" />
      </RadioButton.Group>,
    );
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-required');
  });

  it('applies value attribute', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="custom-value" />
      </RadioButton.Group>,
    );
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('value', 'custom-value');
  });

  it('renders with RadioButton.Label as children', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1">
          <RadioButton.Label>Test radio button</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    expect(screen.getByText('Test radio button')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with RadioButton.Label and RadioButton.Description as children', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1">
          <RadioButton.Label>Test radio button</RadioButton.Label>
          <RadioButton.Description>This is a description</RadioButton.Description>
        </RadioButton>
      </RadioButton.Group>,
    );
    expect(screen.getByText('Test radio button')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('associates RadioButton.Label with radio button via id and htmlFor prop', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="test-id">
          <RadioButton.Label htmlFor="test-id">Test radio button</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    const label = screen.getByText('Test radio button');
    expect(label).toHaveAttribute('for', 'test-id');
  });

  it('forwards HTML attributes to RadioButton.Label', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="test-id">
          <RadioButton.Label
            htmlFor="test-id"
            data-testid="custom-label"
            className="custom-label-class"
            aria-label="Custom label"
          >
            Test radio button
          </RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    const label = screen.getByTestId('custom-label');
    expect(label).toHaveClass('custom-label-class');
    expect(label).toHaveAttribute('aria-label', 'Custom label');
  });

  it('forwards HTML attributes to RadioButton.Description', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1">
          <RadioButton.Label>Test radio button</RadioButton.Label>
          <RadioButton.Description
            data-testid="custom-description"
            className="custom-description-class"
            aria-label="Custom description"
          >
            This is a description
          </RadioButton.Description>
        </RadioButton>
      </RadioButton.Group>,
    );
    const description = screen.getByTestId('custom-description');
    expect(description).toHaveClass('custom-description-class');
    expect(description).toHaveAttribute('aria-label', 'Custom description');
  });

  it('can be selected when using RadioButton.Label', async () => {
    const user = userEvent.setup();
    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="option1">
          <RadioButton.Label htmlFor="option1">Option 1</RadioButton.Label>
        </RadioButton>
        <RadioButton value="option2" id="option2">
          <RadioButton.Label htmlFor="option2">Option 2</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    const radio1 = screen.getByRole('radio', { name: 'Option 1' });
    const radio2 = screen.getByRole('radio', { name: 'Option 2' });

    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it('can be selected when clicking RadioButton.Description', async () => {
    const user = userEvent.setup();

    render(
      <RadioButton.Group>
        <RadioButton value="option1" id="option1">
          <RadioButton.Label htmlFor="option1">Option 1</RadioButton.Label>
          <RadioButton.Description>Description 1</RadioButton.Description>
        </RadioButton>
        <RadioButton value="option2" id="option2">
          <RadioButton.Label htmlFor="option2">Option 2</RadioButton.Label>
          <RadioButton.Description>Description 2</RadioButton.Description>
        </RadioButton>
      </RadioButton.Group>,
    );

    const radio1 = screen.getByRole('radio', { name: 'Option 1' });
    const radio2 = screen.getByRole('radio', { name: 'Option 2' });

    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(screen.getByText('Description 1'));
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    await user.click(screen.getByText('Description 2'));
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it('is disabled when disabled prop is true with RadioButton.Label', async () => {
    const user = userEvent.setup();
    render(
      <RadioButton.Group>
        <RadioButton value="option1" disabled>
          <RadioButton.Label>Disabled radio button</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();

    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(radio).not.toBeChecked();
  });
});

describe('RadioButtonGroup', () => {
  it('renders with children', () => {
    render(
      <RadioButton.Group>
        <RadioButton value="option1" label="Option 1" />
        <RadioButton value="option2" label="Option 2" />
      </RadioButton.Group>,
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  describe('Keyboard', () => {
    it('should support Tab/Shift + Tab to change focus when nothing is checked', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before</button>
          <RadioButton.Group>
            <RadioButton value="option1" label="Option 1" />
            <RadioButton value="option2" label="Option 2" />
          </RadioButton.Group>
          <button type="button">After</button>
        </>,
      );

      const radio1 = screen.getByRole('radio', { name: 'Option 1' });
      const beforeRadio = screen.getByRole('button', { name: 'Before' });
      const afterRadio = screen.getByRole('button', { name: 'After' });

      await user.tab();
      expect(beforeRadio).toHaveFocus();

      await user.tab();
      expect(radio1).toHaveFocus();

      await user.tab();
      expect(afterRadio).toHaveFocus();

      await user.tab({ shift: true });
      expect(radio1).toHaveFocus();
    });

    it('should support Tab/Shift + Tab to change focus when a button is checked', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before</button>
          <RadioButton.Group defaultValue="option2">
            <RadioButton value="option1" label="Option 1" />
            <RadioButton value="option2" label="Option 2" />
          </RadioButton.Group>
          <button type="button">After</button>
        </>,
      );

      const radio2 = screen.getByRole('radio', { name: 'Option 2' });
      const beforeRadio = screen.getByRole('button', { name: 'Before' });
      const afterRadio = screen.getByRole('button', { name: 'After' });

      expect(radio2).toBeChecked();

      await user.tab();
      expect(beforeRadio).toHaveFocus();

      await user.tab();
      expect(radio2).toHaveFocus();

      await user.tab();
      expect(afterRadio).toHaveFocus();

      await user.tab({ shift: true });
      expect(radio2).toHaveFocus();
    });

    it('should support Space key to check an unchecked button', async () => {
      const user = userEvent.setup();

      render(
        <RadioButton.Group>
          <RadioButton value="option1" label="Option 1" />
        </RadioButton.Group>,
      );

      const radio = screen.getByRole('radio', { name: 'Option 1' });
      await user.tab();
      expect(radio).toHaveFocus();
      expect(radio).not.toBeChecked();

      await user.keyboard(' ');
      expect(radio).toBeChecked();

      // Stay checked
      await user.keyboard(' ');
      expect(radio).toBeChecked();
    });

    it.each([
      { orientation: 'vertical', prevKey: 'ArrowUp', nextKey: 'ArrowDown' },
      { orientation: 'vertical', prevKey: 'ArrowLeft', nextKey: 'ArrowRight' },
      { orientation: 'horizontal', prevKey: 'ArrowLeft', nextKey: 'ArrowRight' },
      { orientation: 'horizontal', prevKey: 'ArrowUp', nextKey: 'ArrowDown' },
    ] as const)(
      'should support $prevKey/$nextKey navigation ($orientation)',
      async ({ orientation, prevKey, nextKey }) => {
        const user = userEvent.setup();

        render(
          <RadioButton.Group defaultValue="option1" orientation={orientation}>
            <RadioButton value="option1" label="Option 1" />
            <RadioButton value="option2" label="Option 2" />
            <RadioButton value="option3" label="Option 3" />
          </RadioButton.Group>,
        );

        const radio1 = screen.getByRole('radio', { name: 'Option 1' });
        const radio2 = screen.getByRole('radio', { name: 'Option 2' });
        const radio3 = screen.getByRole('radio', { name: 'Option 3' });

        await user.tab();
        expect(radio1).toHaveFocus();
        expect(radio1).toBeChecked();

        const movements = [
          { key: nextKey, next: radio2, previous: radio1 },
          { key: prevKey, next: radio1, previous: radio2 },
          // Wrap from the first radio to the last, then from the last to the first.
          { key: prevKey, next: radio3, previous: radio1 },
          { key: nextKey, next: radio1, previous: radio3 },
        ];

        for (const { key, next, previous } of movements) {
          // Keep the arrow held until focus-triggered selection completes.
          await user.keyboard(`{${key}>}`);
          await waitFor(() => expect(next).toBeChecked());
          await user.keyboard(`{/${key}}`);

          expect(next).toHaveFocus();
          expect(previous).not.toBeChecked();
        }
      },
    );
  });
});

// Snapshot Tests
describe('RadioButton Snapshots', () => {
  it('matches snapshot for default radio button', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-1" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for radio button with label', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-2" label="Test radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for radio button with label and description', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton
          value="option1"
          id="snapshot-3"
          label="Test radio button"
          description="This is a description"
        />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for small radio button', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-4" size="sm" label="Small radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for large radio button', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-5" size="lg" label="Large radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for danger variant', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-6" variant="danger" label="Danger radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checked radio button', () => {
    const { container } = render(
      <RadioButton.Group value="option1">
        <RadioButton value="option1" id="snapshot-7" label="Checked radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled radio button', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-8" disabled label="Disabled radio button" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled checked radio button', () => {
    const { container } = render(
      <RadioButton.Group value="option1">
        <RadioButton value="option1" id="snapshot-9" disabled label="Disabled checked" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for radio button with RadioButton.Label', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-10">
          <RadioButton.Label>Test radio button</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for radio button with RadioButton.Label and RadioButton.Description', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-11">
          <RadioButton.Label>Test radio button</RadioButton.Label>
          <RadioButton.Description>This is a description</RadioButton.Description>
        </RadioButton>
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled radio button with RadioButton.Label', () => {
    const { container } = render(
      <RadioButton.Group>
        <RadioButton value="option1" id="snapshot-12" disabled>
          <RadioButton.Label>Disabled radio button</RadioButton.Label>
        </RadioButton>
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('RadioButtonGroup Snapshots', () => {
  it('matches snapshot for vertical group', () => {
    const { container } = render(
      <RadioButton.Group orientation="vertical">
        <RadioButton value="option1" id="group-1-1" label="Option 1" />
        <RadioButton value="option2" id="group-1-2" label="Option 2" />
        <RadioButton value="option3" id="group-1-3" label="Option 3" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for horizontal group', () => {
    const { container } = render(
      <RadioButton.Group orientation="horizontal">
        <RadioButton value="option1" id="group-2-1" label="Option 1" />
        <RadioButton value="option2" id="group-2-2" label="Option 2" />
        <RadioButton value="option3" id="group-2-3" label="Option 3" />
      </RadioButton.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <RadioButton.Group aria-label="Shipping">
        <RadioButton value="standard" label="Standard" description="3–5 business days" />
        <RadioButton value="express">
          <RadioButton.Label>Express</RadioButton.Label>
          <RadioButton.Description>Next business day</RadioButton.Description>
        </RadioButton>
      </RadioButton.Group>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-slot', 'radio-button-group');
    screen
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).toHaveAttribute('data-slot', 'radio-button'));
    expect(screen.getByText('Standard').closest('label')).toHaveAttribute(
      'data-slot',
      'radio-button-label',
    );
    expect(screen.getByText('3–5 business days')).toHaveAttribute(
      'data-slot',
      'radio-button-description',
    );
    expect(screen.getByText('Express')).toHaveAttribute('data-slot', 'radio-button-label');
    expect(screen.getByText('Next business day')).toHaveAttribute(
      'data-slot',
      'radio-button-description',
    );
  });
});
