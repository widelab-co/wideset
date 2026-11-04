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
    const indicator = container.querySelector('[data-slot="progress-bar-track"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-25%)');
  });

  it('clamps values below 0 to 0', () => {
    const { container } = render(<ProgressBar value={-10} />);
    const indicator = container.querySelector('[data-slot="progress-bar-track"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });

  it('shows 0% label when value is below 0', () => {
    const { getByText } = render(<ProgressBar label="Progress" value={-10} />);
    expect(getByText('0%')).toBeInTheDocument();
  });

  it('clamps values above 100 to 100', () => {
    const { container } = render(<ProgressBar value={150} />);
    const indicator = container.querySelector('[data-slot="progress-bar-track"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-0%)');
  });

  it('shows 100% label when value is above 100', () => {
    const { getByText } = render(<ProgressBar label="Progress" value={150} />);
    expect(getByText('100%')).toBeInTheDocument();
  });

  it('handles undefined value gracefully', () => {
    const { container } = render(<ProgressBar />);
    const indicator = container.querySelector('[data-slot="progress-bar-track"] > div');
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

  describe('asChild', () => {
    it.each(['bar', 'circle'] as const)(
      'renders the %s root onto the child element, with the parts inside',
      (type) => {
        render(
          <ProgressBar type={type} value={40} aria-label="Upload" asChild>
            <section>
              <ProgressBar.Value />
              <ProgressBar.Track />
            </section>
          </ProgressBar>,
        );

        const progressBar = screen.getByRole('progressbar', { name: 'Upload' });
        expect(progressBar.tagName).toBe('SECTION');
        expect(progressBar).toHaveAttribute('data-slot', 'progress-bar');
        expect(progressBar).toHaveTextContent('40%');
        expect(progressBar.querySelector('[data-slot="progress-bar-track"]')).toBeInTheDocument();
      },
    );

    it('keeps the role on a <div> root when there is no child element to slot onto', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        render(<ProgressBar value={40} asChild />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar.tagName).toBe('DIV');
        expect(progressBar).toHaveAttribute('aria-valuenow', '40');
        expect(consoleError).not.toHaveBeenCalled();
      } finally {
        consoleError.mockRestore();
      }
    });
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

describe('ProgressBar compound parts', () => {
  const composed = (props: { 'aria-valuetext'?: string } = {}) => (
    <ProgressBar value={32} max={40} {...props}>
      <ProgressBar.Header>
        <ProgressBar.Label>Uploading files</ProgressBar.Label>
        <ProgressBar.Value formatValue={(value, max) => `${value} / ${max}`} />
      </ProgressBar.Header>
      <ProgressBar.Track />
      <ProgressBar.Description>8 files remaining</ProgressBar.Description>
    </ProgressBar>
  );

  it('names and describes the progressbar from Label and Description', () => {
    render(composed());
    expect(
      screen.getByRole('progressbar', {
        name: 'Uploading files',
        description: '8 files remaining',
      }),
    ).toBeInTheDocument();
  });

  it('falls back to "Progress" when no label is composed', () => {
    render(
      <ProgressBar value={10}>
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
  });

  it('formats the value with formatValue', () => {
    render(composed());
    expect(screen.getByText('32 / 40')).toBeInTheDocument();
  });

  it('shows the rounded percentage of max by default', () => {
    render(
      <ProgressBar value={32} max={40}>
        <ProgressBar.Value />
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows children of Value instead of the computed text', () => {
    render(
      <ProgressBar value={32}>
        <ProgressBar.Value>Almost there</ProgressBar.Value>
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByText('Almost there')).toBeInTheDocument();
  });

  it('omits aria-valuetext by default so the percentage is announced once', () => {
    // No Label or Description here: they call useId, which would shift the ids in later snapshots.
    render(
      <ProgressBar value={32} max={40}>
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuetext');
  });

  it('passes a custom aria-valuetext on the root through', () => {
    render(composed({ 'aria-valuetext': '32 of 40 files' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '32 of 40 files');
  });

  it('reaches Radix with getValueLabel', () => {
    render(<ProgressBar value={50} getValueLabel={(value, max) => `${value} of ${max}`} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '50 of 100');
  });

  it('shows the value and the error icon, not NaN, on a circle with the error variant', () => {
    render(
      <ProgressBar type="circle" variant="error" value={40} aria-label="Sync">
        <ProgressBar.Value />
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar').querySelector('svg')).toBeInTheDocument();
  });

  it('takes the Description state and icon from the root variant', () => {
    render(
      <ProgressBar value={10} variant="error">
        <ProgressBar.Track />
        <ProgressBar.Description>Upload failed</ProgressBar.Description>
      </ProgressBar>,
    );
    expect(
      screen.getByText('Upload failed').closest('[data-slot="helper-text"]')?.querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('reserves a fixed width for the circle value with fixedWidth', () => {
    render(<ProgressBar type="circle" value={5} fixedWidth />);
    expect(screen.getByText('5%')).toHaveClass('w-ws-14');
  });

  it('uses the label shorthand only as aria-label on a circle', () => {
    render(<ProgressBar type="circle" value={5} label="Sync" />);
    expect(screen.getByRole('progressbar', { name: 'Sync' })).toBeInTheDocument();
    expect(screen.queryByText('Sync')).not.toBeInTheDocument();
  });

  it('renders the label and description shorthand as composed parts', () => {
    render(<ProgressBar value={50} label="Upload" description="Halfway" />);
    expect(
      screen.getByRole('progressbar', { name: 'Upload', description: 'Halfway' }),
    ).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders the Header in a circle without error', () => {
    render(
      <ProgressBar type="circle" value={50} aria-label="Sync">
        <ProgressBar.Header data-testid="header">
          <ProgressBar.Value />
        </ProgressBar.Header>
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it.each([
    ['Header', 'progress-bar-header', (p: object) => <ProgressBar.Header {...p} />],
    [
      'Label',
      'progress-bar-label',
      (p: object) => <ProgressBar.Label {...p}>Name</ProgressBar.Label>,
    ],
    ['Value', 'progress-bar-value', (p: object) => <ProgressBar.Value {...p} />],
    ['Track', 'progress-bar-track', (p: object) => <ProgressBar.Track {...p} />],
    [
      'Description',
      'progress-bar-description',
      (p: object) => <ProgressBar.Description {...p}>Text</ProgressBar.Description>,
    ],
  ])('%s forwards className and data attributes', (_name, slot, part) => {
    render(
      <ProgressBar value={5}>{part({ className: 'custom', 'data-extra': 'yes' })}</ProgressBar>,
    );
    const el = document.querySelector(`[data-slot="${slot}"]`);
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('data-extra', 'yes');
  });

  it.each([
    ['Header', () => <ProgressBar.Header />],
    ['Label', () => <ProgressBar.Label>x</ProgressBar.Label>],
    ['Value', () => <ProgressBar.Value />],
    ['Track', () => <ProgressBar.Track />],
    ['Description', () => <ProgressBar.Description>x</ProgressBar.Description>],
  ])('%s throws outside a ProgressBar', (_name, part) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(part())).toThrow(
      'useProgressBarContext must be used within a <ProgressBar>',
    );
    consoleError.mockRestore();
  });

  it('forwards refs of the parts', () => {
    const track = createRef<HTMLDivElement>();
    const value = createRef<HTMLSpanElement>();
    render(
      <ProgressBar value={5}>
        <ProgressBar.Value ref={value} />
        <ProgressBar.Track ref={track} />
      </ProgressBar>,
    );
    expect(track.current).toHaveAttribute('data-slot', 'progress-bar-track');
    expect(value.current).toHaveAttribute('data-slot', 'progress-bar-value');
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
