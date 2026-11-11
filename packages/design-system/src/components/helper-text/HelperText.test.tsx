import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HelperText } from './HelperText';

describe('HelperText', () => {
  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      render(<HelperText>Helper text</HelperText>);
      expect(screen.getByText('Helper text')).toHaveAttribute('data-slot', 'helper-text');
    });
  });

  it('renders as a span element', () => {
    render(<HelperText>Helper text</HelperText>);
    const element = screen.getByText('Helper text');
    expect(element.tagName).toBe('SPAN');
  });

  it('renders text content', () => {
    render(<HelperText>Helper text</HelperText>);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('returns null when children is empty and showIcon is false', () => {
    const { container } = render(<HelperText showIcon={false}></HelperText>);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when children is empty and showIcon is undefined', () => {
    const { container } = render(<HelperText></HelperText>);
    expect(container.firstChild).toBeNull();
  });

  it('returns an icon when children is empty but showIcon is true and state is not default', () => {
    const { container } = render(<HelperText showIcon={true} state="error"></HelperText>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<HelperText className="custom-class">Helper text</HelperText>);
    const element = screen.getByText('Helper text');
    expect(element).toHaveClass('custom-class');
  });

  it('keeps its own classes next to a custom className', () => {
    render(
      <HelperText state="error" className="custom-class">
        Helper text
      </HelperText>,
    );
    const element = screen.getByText('Helper text');
    expect(element).toHaveClass('custom-class', 'typography-body-sm', 'py-ws-3');
    expect(element).toHaveClass('text-ws-semantic-negative');
  });

  it('forwards HTML attributes', () => {
    render(
      <HelperText data-testid="helper-text" aria-label="Helper text" id="helper-id">
        Helper text
      </HelperText>,
    );
    const element = screen.getByTestId('helper-text');
    expect(element).toHaveAttribute('aria-label', 'Helper text');
    expect(element).toHaveAttribute('id', 'helper-id');
  });

  it('handles data attributes', () => {
    render(<HelperText data-custom="value">Helper text</HelperText>);
    const element = screen.getByText('Helper text');
    expect(element).toHaveAttribute('data-custom', 'value');
  });

  describe('Icon display', () => {
    it('does not show icon when showIcon is false', () => {
      const { container } = render(
        <HelperText state="error" showIcon={false}>
          Helper text
        </HelperText>,
      );
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('does not show icon when showIcon is undefined', () => {
      const { container } = render(<HelperText state="error">Helper text</HelperText>);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('shows icon when showIcon is true', () => {
      const { container } = render(
        <HelperText state="error" showIcon>
          Error message
        </HelperText>,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});

// Snapshot Tests
describe('HelperText Snapshots', () => {
  const states: Array<'default' | 'error' | 'warning' | 'success'> = [
    'default',
    'error',
    'warning',
    'success',
  ];

  states.forEach((state) => {
    it(`matches snapshot for state ${state}`, () => {
      const { container } = render(<HelperText state={state}>Helper text</HelperText>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('matches snapshot without icon', () => {
    const { container } = render(
      <HelperText state="error" showIcon={false}>
        Helper text
      </HelperText>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
