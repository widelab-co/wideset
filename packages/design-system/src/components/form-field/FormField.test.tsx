import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextInput } from '../text-input/TextInput';
import { FormField } from './FormField';

describe('FormField', () => {
  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      const { container } = render(
        <FormField label="Billing email" helperText="We send receipts here.">
          <input aria-label="Billing email" />
        </FormField>,
      );
      expect(container.firstChild).toHaveAttribute('data-slot', 'form-field');
      expect(container.querySelector('[data-slot="field-label"]')).toBeInTheDocument();
      expect(screen.getByText('We send receipts here.')).toHaveAttribute(
        'data-slot',
        'helper-text',
      );
    });
  });

  it('renders children and label', () => {
    render(
      <FormField label="My Label">
        <div data-testid="child">Child</div>
      </FormField>,
    );

    expect(screen.getByText('My Label')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies custom className on container', () => {
    const { container } = render(
      <FormField label="Label" className="custom-class">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies vertical layout by default', () => {
    const { container, rerender } = render(
      <FormField label="Label">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toHaveClass('flex-col');

    rerender(
      <FormField variant="horizontal" label="My Label" helperText="My description">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toHaveClass('flex-row');
    expect(container.firstChild).toHaveClass('items-start');
    expect(screen.getByText('My description')).toBeInTheDocument();
  });

  it('renders helper text for error with icon when enabled', () => {
    const { container } = render(
      <FormField label="Label" errorText="Error message">
        <div>Child</div>
      </FormField>,
    );

    const helper = screen.getByText('Error message');
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveClass('text-ws-semantic-negative');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders helper text in default state without icon', () => {
    const { container } = render(
      <FormField label="Label" helperText="Helper message">
        <div>Child</div>
      </FormField>,
    );

    const helper = screen.getByText('Helper message');
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveClass('text-ws-static-subtle');
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('renders default helper text', () => {
    render(
      <FormField label="Label" helperText="Some help">
        <div>Child</div>
      </FormField>,
    );

    const helper = screen.getByText('Some help');
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveClass('text-ws-static-subtle');
  });

  it('prioritizes errorText over helperText when both are provided', () => {
    render(
      <FormField label="Label" errorText="Error message" helperText="Helper message">
        <div>Child</div>
      </FormField>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper message')).not.toBeInTheDocument();
  });

  it('does not render helper text element when no helper-related props provided', () => {
    render(
      <FormField label="Label" helperTextId="helper-id">
        <div>Child</div>
      </FormField>,
    );

    expect(document.querySelector('#helper-id')).not.toBeInTheDocument();
  });

  it('supports changing root WrapperComponent to fieldset', () => {
    const { container } = render(
      <FormField label="Label" WrapperComponent="fieldset">
        <div>Child</div>
      </FormField>,
    );

    expect((container.firstChild as HTMLElement).tagName).toBe('FIELDSET');
  });

  it('renders aside at the end of the label row', () => {
    render(
      <FormField label="Count" aside="5/10">
        <div>Child</div>
      </FormField>,
    );

    expect(screen.getByText('5/10')).toHaveAttribute('data-slot', 'field-label-aside');
  });

  it('renders suffix inside the label', () => {
    render(
      <FormField label="Nickname" htmlFor="nick" suffix="(optional)">
        <input id="nick" />
      </FormField>,
    );

    expect(screen.getByRole('textbox', { name: 'Nickname (optional)' })).toBeInTheDocument();
  });

  it('renders tooltip as a button next to the label, not inside it', () => {
    render(
      <FormField label="Email" htmlFor="email" tooltip="Help text" tooltipAriaLabel="About email">
        <input id="email" />
      </FormField>,
    );

    const button = screen.getByRole('button', { name: 'About email' });
    expect(button.closest('label')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('keeps the required asterisk out of the accessible name', () => {
    render(
      <FormField label="Email" htmlFor="email" required>
        <input id="email" />
      </FormField>,
    );

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
});

describe('FormField helper text linking', () => {
  it('describes the control with the helper text', () => {
    render(
      <FormField label="Email" htmlFor="email" helperText="We send receipts here.">
        <input id="email" />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAccessibleDescription('We send receipts here.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('describes the control with the error text and marks it invalid', () => {
    render(
      <FormField label="Email" htmlFor="email" helperText="Hint" errorText="Enter an email.">
        <input id="email" />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAccessibleDescription('Enter an email.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks the control invalid while an error shows, even if it sets aria-invalid={false}', () => {
    render(
      <FormField label="Email" htmlFor="email" errorText="Enter an email.">
        <input id="email" aria-invalid={false} />
      </FormField>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('links the error text to the input of a composed TextInput', () => {
    render(
      <FormField label="Email" htmlFor="email" errorText="Enter an email.">
        <TextInput>
          <TextInput.Input id="email" />
        </TextInput>
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAccessibleDescription('Enter an email.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it("keeps the control's own aria-describedby and uses helperTextId", () => {
    render(
      <>
        <span id="extra">Extra</span>
        <FormField label="Email" htmlFor="email" helperText="Hint" helperTextId="email-hint">
          <input id="email" aria-describedby="extra" />
        </FormField>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-describedby',
      'extra email-hint',
    );
  });

  it('does not repeat helperTextId the control already points at', () => {
    render(
      <FormField label="Email" htmlFor="email" helperText="Hint" helperTextId="email-hint">
        <input id="email" aria-describedby="email-hint" />
      </FormField>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-describedby',
      'email-hint',
    );
  });

  it('leaves the control alone without helper or error text', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-describedby');
  });
});

describe('FormField Snapshots', () => {
  it('matches snapshot for default form field', () => {
    const { container } = render(
      <FormField label="Label" helperText="Help">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for horizontal variant', () => {
    const { container } = render(
      <FormField variant="horizontal" label="Label" helperText="Description">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with fieldset', () => {
    const { container } = render(
      <FormField WrapperComponent="fieldset" label="Label">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with error and icon', () => {
    const { container } = render(
      <FormField label="Email" errorText="Invalid email">
        <div>Child</div>
      </FormField>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
