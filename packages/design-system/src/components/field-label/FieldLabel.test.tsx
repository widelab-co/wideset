import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '../tooltip/Tooltip';
import { FieldLabel } from './FieldLabel';

describe('FieldLabel', () => {
  describe('Rendering', () => {
    it('renders a <label> with its children', () => {
      render(<FieldLabel htmlFor="email">Email</FieldLabel>);
      expect(screen.getByText('Email').closest('label')).toHaveAttribute('for', 'email');
    });

    it('marks the label with data-slot', () => {
      const { container } = render(<FieldLabel>Email</FieldLabel>);
      expect(container.firstChild).toHaveAttribute('data-slot', 'field-label');
    });

    it('merges className onto the label', () => {
      const { container } = render(<FieldLabel className="custom-class">Email</FieldLabel>);
      expect(container.firstChild).toHaveClass('custom-class', 'inline-flex');
    });

    it('forwards the ref to the label', () => {
      const ref = createRef<HTMLLabelElement>();
      render(<FieldLabel ref={ref}>Email</FieldLabel>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('forwards HTML and aria attributes to the label', () => {
      render(
        <FieldLabel id="label-id" data-testid="field-label" aria-describedby="description">
          Email
        </FieldLabel>,
      );
      const label = screen.getByTestId('field-label');
      expect(label).toHaveAttribute('id', 'label-id');
      expect(label).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('required', () => {
    it('draws a decorative asterisk', () => {
      render(<FieldLabel required>Email</FieldLabel>);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
      expect(asterisk).toHaveAttribute('data-slot', 'field-label-required');
    });

    it('keeps the asterisk out of the accessible name', () => {
      render(
        <>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <input id="email" />
        </>,
      );
      expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    });

    it('draws no asterisk when not required', () => {
      render(<FieldLabel>Email</FieldLabel>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('FieldLabel.Suffix', () => {
    it('renders inside the label with data-slot', () => {
      render(
        <FieldLabel>
          Email <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
        </FieldLabel>,
      );
      const suffix = screen.getByText('(optional)');
      expect(suffix).toHaveAttribute('data-slot', 'field-label-suffix');
      expect(suffix.closest('label')).toBeInTheDocument();
    });

    it('is part of the accessible name', () => {
      render(
        <>
          <FieldLabel htmlFor="email">
            Email <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
          </FieldLabel>
          <input id="email" />
        </>,
      );
      expect(screen.getByRole('textbox', { name: 'Email (optional)' })).toBeInTheDocument();
    });
  });

  describe('FieldLabel.Tooltip', () => {
    it('is a button named "More information" by default', () => {
      render(<FieldLabel.Tooltip>Help text</FieldLabel.Tooltip>);
      const button = screen.getByRole('button', { name: 'More information' });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('data-slot', 'field-label-tooltip');
    });

    it('takes its name from aria-label', () => {
      render(<FieldLabel.Tooltip aria-label="Więcej informacji">Help text</FieldLabel.Tooltip>);
      expect(screen.getByRole('button', { name: 'Więcej informacji' })).toBeInTheDocument();
      expect(screen.queryByLabelText('More information')).not.toBeInTheDocument();
    });

    it('hides its icon from assistive technology', () => {
      const { container } = render(<FieldLabel.Tooltip>Help text</FieldLabel.Tooltip>);
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('forwards the ref and rest props to the button', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <FieldLabel.Tooltip ref={ref} data-testid="info" className="custom-class">
          Help text
        </FieldLabel.Tooltip>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(screen.getByTestId('info')).toHaveClass('custom-class');
    });

    it('shows the tooltip content on hover', async () => {
      const user = userEvent.setup();
      render(
        <FieldLabel.Tooltip>
          <Tooltip.Label>Help text</Tooltip.Label>
        </FieldLabel.Tooltip>,
      );
      await user.hover(screen.getByRole('button', { name: 'More information' }));
      await waitFor(
        () => {
          expect(screen.getAllByText('Help text').length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );
    });

    it('opens from the keyboard', async () => {
      const user = userEvent.setup();
      render(
        <FieldLabel.Tooltip>
          <Tooltip.Label>Help text</Tooltip.Label>
        </FieldLabel.Tooltip>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'More information' })).toHaveFocus();
      await waitFor(
        () => {
          expect(screen.getAllByText('Help text').length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );
    });
  });

  describe('FieldLabel.Aside', () => {
    it('renders its content with data-slot', () => {
      render(<FieldLabel.Aside>0/100</FieldLabel.Aside>);
      expect(screen.getByText('0/100')).toHaveAttribute('data-slot', 'field-label-aside');
    });

    it('forwards the ref and rest props', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <FieldLabel.Aside ref={ref} data-testid="aside" className="custom-class">
          <span>Custom aside</span>
        </FieldLabel.Aside>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(screen.getByTestId('aside')).toHaveClass('custom-class');
    });
  });

  describe('FieldLabel.Description', () => {
    it('renders its content with data-slot', () => {
      render(<FieldLabel.Description>This is a description</FieldLabel.Description>);
      expect(screen.getByText('This is a description')).toHaveAttribute(
        'data-slot',
        'field-label-description',
      );
    });

    it('forwards the ref and rest props', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(
        <FieldLabel.Description ref={ref} id="desc" className="custom-class">
          This is a description
        </FieldLabel.Description>,
      );
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(screen.getByText('This is a description')).toHaveAttribute('id', 'desc');
      expect(screen.getByText('This is a description')).toHaveClass('custom-class');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for basic label', () => {
      const { container } = render(<FieldLabel>Test Label</FieldLabel>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for required label', () => {
      const { container } = render(<FieldLabel required>Test Label</FieldLabel>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for label with suffix', () => {
      const { container } = render(
        <FieldLabel>
          Test Label <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
        </FieldLabel>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for the tooltip button', () => {
      const { container } = render(
        <FieldLabel.Tooltip>
          <Tooltip.Label>Help text</Tooltip.Label>
        </FieldLabel.Tooltip>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for a composed label row', () => {
      const { container } = render(
        <div>
          <FieldLabel required>
            Test Label <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
          </FieldLabel>
          <FieldLabel.Tooltip>
            <Tooltip.Label>Help text</Tooltip.Label>
          </FieldLabel.Tooltip>
          <FieldLabel.Aside>0/100</FieldLabel.Aside>
          <FieldLabel.Description>This is a description</FieldLabel.Description>
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for label with long text', () => {
      const longText =
        'This is a very long label text that should wrap properly when it exceeds the available width';
      const { container } = render(<FieldLabel>{longText}</FieldLabel>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('deprecated props', () => {
    it('renders the parts from the old props, with the button outside the label', () => {
      const { container } = render(
        <FieldLabel
          htmlFor="email"
          suffix="(optional)"
          tooltip="Help"
          tooltipAriaLabel="About email"
          aside="0/100"
          description="Hint"
        >
          Email
        </FieldLabel>,
      );

      const label = container.querySelector('[data-slot="field-label"]');
      expect(label).toContainElement(screen.getByText('(optional)'));
      expect(screen.getByRole('button', { name: 'About email' }).closest('label')).toBeNull();
      expect(container.querySelector('[data-slot="field-label-aside"]')).toHaveTextContent('0/100');
      expect(container.querySelector('[data-slot="field-label-description"]')).toHaveTextContent(
        'Hint',
      );
    });

    it('does not pass the old props to the label as attributes', () => {
      render(<FieldLabel tooltip="Help">Email</FieldLabel>);

      expect(screen.getByText('Email').closest('label')).not.toHaveAttribute('tooltip');
    });
  });
});
