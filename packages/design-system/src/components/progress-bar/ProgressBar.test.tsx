import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with default props', () => {
    const { container } = render(<ProgressBar value={50} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar className="custom-class" value={50} />);
    const progressRoot = container.querySelector('.custom-class');
    expect(progressRoot).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const { getByText } = render(<ProgressBar label="Progress Label" value={50} />);
    expect(getByText('Progress Label')).toBeInTheDocument();
  });

  it('shows percentage when label is provided', () => {
    const { getByText } = render(<ProgressBar label="Progress" value={33} />);
    expect(getByText('33%')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const { getByText } = render(<ProgressBar description="Progress description" value={50} />);
    expect(getByText('Progress description')).toBeInTheDocument();
  });

  it('shows icon in helper text for success variant', () => {
    const { container } = render(
      <ProgressBar variant="success" description="Success message" value={50} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows icon in helper text for error variant', () => {
    const { container } = render(
      <ProgressBar variant="error" description="Error message" value={50} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show icon for default variant', () => {
    const { container } = render(
      <ProgressBar variant="default" description="Default message" value={50} />,
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies correct transform style based on value', () => {
    const { container } = render(<ProgressBar value={75} />);
    const indicator = container.querySelector('[role="progressbar"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-25%)');
  });

  it('clamps values below 0 to 0', () => {
    const { container } = render(<ProgressBar value={-10} />);
    const indicator = container.querySelector('[role="progressbar"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });

  it('shows 0% label when value is below 0', () => {
    const { getByText } = render(<ProgressBar label="Progress" value={-10} />);
    expect(getByText('0%')).toBeInTheDocument();
  });

  it('clamps values above 100 to 100', () => {
    const { container } = render(<ProgressBar value={150} />);
    const indicator = container.querySelector('[role="progressbar"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-0%)');
  });

  it('shows 100% label when value is above 100', () => {
    const { getByText } = render(<ProgressBar label="Progress" value={150} />);
    expect(getByText('100%')).toBeInTheDocument();
  });

  it('handles undefined value gracefully', () => {
    const { container } = render(<ProgressBar />);
    const indicator = container.querySelector('[role="progressbar"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });

  it('forwards HTML attributes', () => {
    const { container } = render(
      <ProgressBar data-testid="test-progress" aria-label="Progress indicator" value={50} />,
    );
    const progressBar = container.querySelector('[data-testid="test-progress"]');
    expect(progressBar).toHaveAttribute('aria-label', 'Progress indicator');
  });

  it('forwards HTML attributes when type="circle"', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ProgressBar
        ref={ref}
        type="circle"
        value={50}
        data-testid="test-progress"
        className="test-class"
        aria-label="Upload progress"
      />,
    );

    const progressBar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(progressBar).toHaveAttribute('data-testid', 'test-progress');
    expect(progressBar).toHaveClass('test-class');
    expect(ref.current).toBe(progressBar);
  });

  it('keeps the circle progressbar role when the caller provides another role', () => {
    render(<ProgressBar type="circle" value={50} role="status" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('keeps computed circle ARIA values when caller props conflict', () => {
    render(
      <ProgressBar
        type="circle"
        value={50}
        aria-valuenow={10}
        aria-valuemin={20}
        aria-valuemax={200}
      />,
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('does not forward Radix-only props to the circle DOM element', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      render(
        <ProgressBar
          type="circle"
          value={50}
          asChild
          max={200}
          getValueLabel={(value, max) => `${value} of ${max}`}
        />,
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).not.toHaveAttribute('asChild');
      expect(progressBar).not.toHaveAttribute('max');
      expect(progressBar).not.toHaveAttribute('getValueLabel');
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('renders complete component with all props', () => {
    const { getByText, container } = render(
      <ProgressBar
        label="Upload Progress"
        description="Uploading files..."
        variant="success"
        value={85}
        className="custom-progress"
      />,
    );

    expect(getByText('Upload Progress')).toBeInTheDocument();
    expect(getByText('85%')).toBeInTheDocument();
    expect(getByText('Uploading files...')).toBeInTheDocument();
    expect(container.querySelector('.custom-progress')).toBeInTheDocument();
    expect(container.querySelector('.bg-\\(--ws-semantic-stroke-positive\\)')).toBeInTheDocument();
  });
});

// Snapshot Tests
describe('ProgressBar Snapshots', () => {
  it('matches snapshot for default progress bar', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for circle progress bar', () => {
    const { container } = render(<ProgressBar type="circle" value={50} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for all variants', () => {
    const variants = ['default', 'success', 'error'] as const;

    variants.forEach((variant) => {
      const { container } = render(<ProgressBar variant={variant} value={50} />);
      expect(container.firstChild).toMatchSnapshot(`ProgressBar with ${variant} variant`);
    });
  });

  it('matches snapshot for progress bar with label', () => {
    const { container } = render(<ProgressBar label="Progress" value={75} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for progress bar with description', () => {
    const { container } = render(<ProgressBar description="Loading data..." value={30} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for complete progress bar', () => {
    const { container } = render(
      <ProgressBar
        label="File Upload"
        description="Uploading files to server..."
        variant="success"
        value={90}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container, rerender } = render(<ProgressBar value={40} label="Upload" />);
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      'data-slot',
      'progress-bar',
    );

    rerender(<ProgressBar type="circle" value={40} />);
    expect(container.querySelector('[role="progressbar"]')).toHaveAttribute(
      'data-slot',
      'progress-bar',
    );
  });
});

describe('Accessibility', () => {
  it('exposes the value on the progressbar', () => {
    const { getByRole } = render(<ProgressBar value={65} aria-label="Upload" />);

    const bar = getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('data-state', 'loading');
  });

  it('is named by its visible label', () => {
    const { getByRole } = render(<ProgressBar value={40} label="File upload" />);

    expect(getByRole('progressbar', { name: 'File upload' })).toBeInTheDocument();
  });

  it('falls back to the name "Progress" when nothing names it', () => {
    const { getByRole } = render(<ProgressBar value={40} />);

    expect(getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
  });

  it('names the circle by its label', () => {
    const { getByRole } = render(<ProgressBar type="circle" value={40} label="Upload" />);

    expect(getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument();
  });

  it('falls back to the name "Progress" for the circle type', () => {
    const { getByRole } = render(<ProgressBar type="circle" value={40} />);

    expect(getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
  });

  it('clamps the exposed value to max', () => {
    const { getByRole } = render(<ProgressBar value={150} aria-label="Upload" />);

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('shows the percentage of a custom max', () => {
    const { getByRole, getByText } = render(<ProgressBar value={3} max={4} label="Steps" />);

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    expect(getByText('75%')).toBeInTheDocument();
  });
});

describe('Circle type', () => {
  it('exposes the value and forwards rest props', () => {
    const { getByRole } = render(
      <ProgressBar type="circle" value={30} aria-label="Sync" data-testid="circle" />,
    );

    const bar = getByRole('progressbar', { name: 'Sync' });
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('data-testid', 'circle');
    expect(bar).not.toHaveAttribute('max');
  });
});

describe('ProgressBar error announcement', () => {
  it('inserts a new alert when the variant turns error', () => {
    const { rerender } = render(<ProgressBar description="Uploading" value={50} />);
    const description = screen.getByText('Uploading');

    rerender(<ProgressBar variant="error" description="Uploading" value={50} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Uploading');
    expect(description).not.toBeInTheDocument();
  });
});
