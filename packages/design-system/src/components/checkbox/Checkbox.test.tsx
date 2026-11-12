import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders without label', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Test checkbox" />);
      expect(screen.getByText('Test checkbox')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label and description', () => {
      render(<Checkbox label="Test checkbox" description="This is a description" />);
      expect(screen.getByText('Test checkbox')).toBeInTheDocument();
      expect(screen.getByText('This is a description')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('keeps the description out of the name and links it as the description', () => {
      render(<Checkbox label="Test checkbox" description="This is a description" />);
      const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
      expect(checkbox).toHaveAccessibleDescription('This is a description');
    });

    it('keeps a caller aria-describedby next to the description', () => {
      render(
        <>
          <Checkbox
            label="Test checkbox"
            description="This is a description"
            aria-describedby="hint"
          />
          <p id="hint">Hint</p>
        </>,
      );
      expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
        'Hint This is a description',
      );
    });

    it('sets no aria-describedby without a description', () => {
      render(<Checkbox label="Test checkbox" />);
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-describedby');
    });

    it('renders as unchecked by default', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders as checked when checked prop is true', () => {
      render(<Checkbox checked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders as indeterminate when checked prop is "indeterminate"', () => {
      render(<Checkbox checked="indeterminate" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
    });

    it('uses custom id when provided', () => {
      render(<Checkbox id="custom-id" label="Test" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });

    it('generates id when not provided', () => {
      render(<Checkbox label="Test" />);
      expect(screen.getByRole('checkbox').getAttribute('id')).not.toBeNull();
    });

    it('associates label with checkbox via id', () => {
      render(<Checkbox id="test-id" label="Test checkbox" />);
      expect(screen.getByText('Test checkbox')).toHaveAttribute('for', 'test-id');
    });

    it('applies required attribute', () => {
      render(<Checkbox required />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required');
    });

    it('applies value attribute', () => {
      render(<Checkbox value="custom-value" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'custom-value');
    });

    it('applies default value "on" when value is not provided', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'on');
    });

    it('applies custom className', () => {
      render(<Checkbox className="custom-class" />);
      expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
    });

    it('forwards HTML attributes', () => {
      render(
        <Checkbox
          data-testid="custom-checkbox"
          aria-label="Custom checkbox"
          aria-describedby="description"
        />,
      );
      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Custom checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Interaction', () => {
    it('can be toggled', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('is disabled when disabled prop is true', async () => {
      const user = userEvent.setup();
      render(<Checkbox disabled label="Disabled checkbox" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onCheckedChange when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onCheckedChange with false when unchecking', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox checked onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('uses defaultChecked for uncontrolled checkbox', () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('can be uncontrolled with defaultChecked and still toggle', async () => {
      const user = userEvent.setup();
      render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Composition', () => {
    it('renders with Checkbox.Label as children', () => {
      render(
        <Checkbox>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
        </Checkbox>,
      );
      expect(screen.getByText('Test checkbox')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with Checkbox.Label and Checkbox.Description as children', () => {
      render(
        <Checkbox>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Description>This is a description</Checkbox.Description>
        </Checkbox>,
      );
      expect(screen.getByText('Test checkbox')).toBeInTheDocument();
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('links Checkbox.Description to the checkbox', () => {
      render(
        <Checkbox>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Description>This is a description</Checkbox.Description>
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
      expect(checkbox).toHaveAccessibleDescription('This is a description');
    });

    it('links Checkbox.Description with a custom id', () => {
      render(
        <Checkbox>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Description id="custom-description">This is a description</Checkbox.Description>
        </Checkbox>,
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-describedby',
        'custom-description',
      );
    });

    it('associates Checkbox.Label with checkbox via id and htmlFor prop', () => {
      render(
        <Checkbox id="test-id">
          <Checkbox.Label htmlFor="test-id">Test checkbox</Checkbox.Label>
        </Checkbox>,
      );
      expect(screen.getByText('Test checkbox')).toHaveAttribute('for', 'test-id');
    });

    it('forwards HTML attributes to Checkbox.Label', () => {
      render(
        <Checkbox id="test-id">
          <Checkbox.Label
            htmlFor="test-id"
            data-testid="custom-label"
            className="custom-label-class"
            aria-label="Custom label"
          >
            Test checkbox
          </Checkbox.Label>
        </Checkbox>,
      );
      const label = screen.getByTestId('custom-label');
      expect(label).toHaveClass('custom-label-class');
      expect(label).toHaveAttribute('aria-label', 'Custom label');
    });

    it('forwards HTML attributes to Checkbox.Description', () => {
      render(
        <Checkbox>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Description
            data-testid="custom-description"
            className="custom-description-class"
            aria-label="Custom description"
          >
            This is a description
          </Checkbox.Description>
        </Checkbox>,
      );
      const description = screen.getByTestId('custom-description');
      expect(description).toHaveClass('custom-description-class');
      expect(description).toHaveAttribute('aria-label', 'Custom description');
    });

    it('can be toggled when using Checkbox.Label', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox id="checkbox1">
          <Checkbox.Label htmlFor="checkbox1">Option 1</Checkbox.Label>
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox', { name: 'Option 1' });

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('is disabled when disabled prop is true with Checkbox.Label', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox disabled>
          <Checkbox.Label>Disabled checkbox</Checkbox.Label>
        </Checkbox>,
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onCheckedChange when checkbox with Checkbox.Label is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Checkbox id="checkbox1" onCheckedChange={handleChange}>
          <Checkbox.Label htmlFor="checkbox1">Option 1</Checkbox.Label>
        </Checkbox>,
      );

      await user.click(screen.getByRole('checkbox', { name: 'Option 1' }));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('uses defaultChecked for uncontrolled checkbox with Checkbox.Label', () => {
      render(
        <Checkbox defaultChecked>
          <Checkbox.Label>Option 1</Checkbox.Label>
        </Checkbox>,
      );
      expect(screen.getByRole('checkbox', { name: 'Option 1' })).toBeChecked();
    });

    it('can be uncontrolled with defaultChecked and still toggle when using Checkbox.Label', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox defaultChecked>
          <Checkbox.Label>Option 1</Checkbox.Label>
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox', { name: 'Option 1' });

      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Keyboard', () => {
    it('should skip a disabled checkbox with Tab and Shift+Tab', async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before checkbox</button>
          <Checkbox disabled label="Disabled checkbox" />
          <button type="button">After checkbox</button>
        </>,
      );

      const before = screen.getByRole('button', { name: 'Before checkbox' });
      const after = screen.getByRole('button', { name: 'After checkbox' });

      await user.tab();
      expect(before).toHaveFocus();

      await user.tab();
      expect(after).toHaveFocus();

      await user.tab({ shift: true });
      expect(before).toHaveFocus();
    });

    it('should support Space key to toggle', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkBoxElement = screen.getByRole('checkbox');

      await user.tab();
      expect(checkBoxElement).not.toBeChecked();

      await user.keyboard(' ');
      expect(checkBoxElement).toBeChecked();

      await user.keyboard(' ');
      expect(checkBoxElement).not.toBeChecked();
    });

    it('should not toggle on Enter', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkBoxElement = screen.getByRole('checkbox');

      await user.tab();
      expect(checkBoxElement).not.toBeChecked();

      await user.keyboard('{Enter}');
      expect(checkBoxElement).not.toBeChecked();
    });
  });
});

describe('CheckboxGroup', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(
        <Checkbox.Group>
          <Checkbox label="Option 1" />
          <Checkbox label="Option 2" />
          <Checkbox label="Option 3" />
        </Checkbox.Group>,
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('applies custom className', () => {
      render(
        <Checkbox.Group data-testid="group" className="custom-group-class">
          <Checkbox label="Option 1" />
        </Checkbox.Group>,
      );
      expect(screen.getByTestId('group')).toHaveClass('custom-group-class');
    });

    it('forwards HTML attributes', () => {
      render(
        <Checkbox.Group data-testid="group" aria-label="Options">
          <Checkbox label="Option 1" />
        </Checkbox.Group>,
      );
      expect(screen.getByTestId('group')).toHaveAttribute('aria-label', 'Options');
    });

    it('renders a group named by aria-label', () => {
      render(
        <Checkbox.Group aria-label="Notifications">
          <Checkbox label="Email" />
        </Checkbox.Group>,
      );
      expect(screen.getByRole('group', { name: 'Notifications' })).toHaveAttribute(
        'data-slot',
        'checkbox-group',
      );
    });

    it('renders a group named by aria-labelledby', () => {
      render(
        <>
          <span id="notify-label">Notify me by</span>
          <Checkbox.Group aria-labelledby="notify-label">
            <Checkbox label="Email" />
          </Checkbox.Group>
        </>,
      );
      expect(screen.getByRole('group', { name: 'Notify me by' })).toBeInTheDocument();
    });

    it('forwards ref to the root div', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Checkbox.Group ref={ref}>
          <Checkbox label="Option 1" />
        </Checkbox.Group>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

// Snapshot Tests
describe('Checkbox Snapshots', () => {
  it('matches snapshot for default checkbox', () => {
    const { container } = render(<Checkbox id="snapshot-1" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checkbox with label', () => {
    const { container } = render(<Checkbox id="snapshot-2" label="Test checkbox" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checkbox with label and description', () => {
    const { container } = render(
      <Checkbox id="snapshot-3" label="Test checkbox" description="This is a description" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for small checkbox', () => {
    const { container } = render(<Checkbox id="snapshot-4" size="sm" label="Small checkbox" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for danger variant', () => {
    const { container } = render(
      <Checkbox id="snapshot-5" variant="danger" label="Danger checkbox" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checked checkbox', () => {
    const { container } = render(<Checkbox id="snapshot-6" checked label="Checked checkbox" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for indeterminate checkbox', () => {
    const { container } = render(
      <Checkbox id="snapshot-7" checked="indeterminate" label="Indeterminate checkbox" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled checkbox', () => {
    const { container } = render(<Checkbox id="snapshot-8" disabled label="Disabled checkbox" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled checked checkbox', () => {
    const { container } = render(
      <Checkbox id="snapshot-9" disabled checked label="Disabled checked" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checkbox with custom className', () => {
    const { container } = render(
      <Checkbox id="snapshot-10" className="custom-class" label="Custom" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checkbox with Checkbox.Label', () => {
    const { container } = render(
      <Checkbox id="snapshot-11">
        <Checkbox.Label>Test checkbox</Checkbox.Label>
      </Checkbox>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for checkbox with Checkbox.Label and Checkbox.Description', () => {
    const { container } = render(
      <Checkbox id="snapshot-12">
        <Checkbox.Label>Test checkbox</Checkbox.Label>
        <Checkbox.Description>This is a description</Checkbox.Description>
      </Checkbox>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled checkbox with Checkbox.Label', () => {
    const { container } = render(
      <Checkbox id="snapshot-13" disabled>
        <Checkbox.Label>Disabled checkbox</Checkbox.Label>
      </Checkbox>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('CheckboxGroup Snapshots', () => {
  it('matches snapshot for vertical group', () => {
    const { container } = render(
      <Checkbox.Group orientation="vertical">
        <Checkbox id="group-1-1" label="Option 1" />
        <Checkbox id="group-1-2" label="Option 2" />
        <Checkbox id="group-1-3" label="Option 3" />
      </Checkbox.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for horizontal group', () => {
    const { container } = render(
      <Checkbox.Group orientation="horizontal">
        <Checkbox id="group-2-1" label="Option 1" />
        <Checkbox id="group-2-2" label="Option 2" />
        <Checkbox id="group-2-3" label="Option 3" />
      </Checkbox.Group>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <Checkbox.Group>
        <Checkbox label="Email" description="A daily digest" />
        <Checkbox>
          <Checkbox.Label>Push</Checkbox.Label>
          <Checkbox.Description>Mentions only</Checkbox.Description>
        </Checkbox>
      </Checkbox.Group>,
    );

    const [email, push] = screen.getAllByRole('checkbox');
    expect(email).toHaveAttribute('data-slot', 'checkbox');
    expect(push).toHaveAttribute('data-slot', 'checkbox');
    expect(email.closest('[data-slot="checkbox-group"]')).toBeInTheDocument();
    expect(screen.getByText('Email').closest('label')).toHaveAttribute(
      'data-slot',
      'checkbox-label',
    );
    expect(screen.getByText('A daily digest')).toHaveAttribute('data-slot', 'checkbox-description');
    expect(screen.getByText('Push')).toHaveAttribute('data-slot', 'checkbox-label');
    expect(screen.getByText('Mentions only')).toHaveAttribute('data-slot', 'checkbox-description');
  });
});
