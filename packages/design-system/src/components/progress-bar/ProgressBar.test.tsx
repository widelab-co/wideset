import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';

/** The full bar anatomy: header with label and value, track, optional description. */
const LabelledBar = ({
  label = 'Upload',
  description,
  ...props
}: ProgressBarProps & { label?: string; description?: string }) => (
  <ProgressBar {...props}>
    <ProgressBar.Header>
      <ProgressBar.Label>{label}</ProgressBar.Label>
      <ProgressBar.Value />
    </ProgressBar.Header>
    <ProgressBar.Track />
    {description && <ProgressBar.Description>{description}</ProgressBar.Description>}
  </ProgressBar>
);

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
    const { getByText } = render(<LabelledBar label="Progress Label" value={50} />);
    expect(getByText('Progress Label')).toBeInTheDocument();
  });

  it('shows percentage when label is provided', () => {
    const { getByText } = render(<LabelledBar label="Progress" value={33} />);
    expect(getByText('33%')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const { getByText } = render(<LabelledBar description="Progress description" value={50} />);
    expect(getByText('Progress description')).toBeInTheDocument();
  });

  it('shows icon in helper text for success status', () => {
    const { container } = render(
      <LabelledBar status="success" description="Success message" value={50} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows icon in helper text for error status', () => {
    const { container } = render(
      <LabelledBar status="error" description="Error message" value={50} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show icon for default status', () => {
    const { container } = render(
      <LabelledBar status="default" description="Default message" value={50} />,
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
    const { getByText } = render(<LabelledBar label="Progress" value={-10} />);
    expect(getByText('0%')).toBeInTheDocument();
  });

  it('clamps values above 100 to 100', () => {
    const { container } = render(<ProgressBar value={150} />);
    const indicator = container.querySelector('[data-slot="progress-bar-track"] > div');
    expect(indicator).toHaveStyle('transform: translateX(-0%)');
  });

  it('shows 100% label when value is above 100', () => {
    const { getByText } = render(<LabelledBar label="Progress" value={150} />);
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

  it('renders complete component with all props', () => {
    const { getByText, container } = render(
      <LabelledBar
        label="Upload Progress"
        description="Uploading files..."
        status="success"
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

  it('matches snapshot for all statuses', () => {
    const statuses = ['default', 'success', 'error'] as const;

    statuses.forEach((status) => {
      const { container } = render(<ProgressBar status={status} value={50} />);
      expect(container.firstChild).toMatchSnapshot(`ProgressBar with ${status} status`);
    });
  });

  it('matches snapshot for progress bar with label', () => {
    const { container } = render(<LabelledBar label="Progress" value={75} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for progress bar with description', () => {
    const { container } = render(<LabelledBar description="Loading data..." value={30} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for complete progress bar', () => {
    const { container } = render(
      <LabelledBar
        label="File Upload"
        description="Uploading files to server..."
        status="success"
        value={90}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container, rerender } = render(<LabelledBar value={40} label="Upload" />);
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
    const { getByRole } = render(<LabelledBar value={40} label="File upload" />);

    expect(getByRole('progressbar', { name: 'File upload' })).toBeInTheDocument();
  });

  it('falls back to the name "Progress" when nothing names it', () => {
    const { getByRole } = render(<ProgressBar value={40} />);

    expect(getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument();
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
    const { getByRole, getByText } = render(<LabelledBar value={3} max={4} label="Steps" />);

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

describe('Composition', () => {
  const Composed = (props: { value?: number; max?: number; status?: 'default' | 'success' }) => (
    <ProgressBar value={32} max={40} {...props}>
      <ProgressBar.Header data-testid="header" className="header-class">
        <ProgressBar.Label data-testid="label" className="label-class">
          Uploading files
        </ProgressBar.Label>
        <ProgressBar.Value data-testid="value" className="value-class">
          32 / 40
        </ProgressBar.Value>
      </ProgressBar.Header>
      <ProgressBar.Track data-testid="track" className="track-class" />
      <ProgressBar.Description data-testid="description" className="description-class">
        8 files remaining
      </ProgressBar.Description>
    </ProgressBar>
  );

  it('renders every part inside the root', () => {
    render(<Composed />);

    const root = screen.getByRole('progressbar');
    for (const slot of ['header', 'label', 'value', 'track', 'description']) {
      expect(root.querySelector(`[data-slot="progress-bar-${slot}"]`)).toBeInTheDocument();
    }
  });

  it.each([
    ['Header', <ProgressBar.Header key="part" />],
    ['Label', <ProgressBar.Label key="part">Label</ProgressBar.Label>],
    ['Value', <ProgressBar.Value key="part" />],
    ['Track', <ProgressBar.Track key="part" />],
    ['Description', <ProgressBar.Description key="part">Text</ProgressBar.Description>],
  ])('throws when %s renders outside the root', (_name, part) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(() => render(part)).toThrow(
        'useProgressBarContext must be used within a <ProgressBar>',
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('is named by the Label and described by the Description', () => {
    render(<Composed />);

    const bar = screen.getByRole('progressbar', { name: 'Uploading files' });
    expect(bar).toHaveAccessibleDescription('8 files remaining');
    expect(bar).not.toHaveAttribute('aria-label');
  });

  it('keeps a caller aria-labelledby over the Label', () => {
    render(
      <>
        <span id="outside">Outside name</span>
        <ProgressBar value={10} aria-labelledby="outside">
          <ProgressBar.Header>
            <ProgressBar.Label>Inside name</ProgressBar.Label>
          </ProgressBar.Header>
          <ProgressBar.Track />
        </ProgressBar>
      </>,
    );

    expect(screen.getByRole('progressbar', { name: 'Outside name' })).toBeInTheDocument();
  });

  it('exposes the value, so the bar is not indeterminate', () => {
    render(<Composed />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '32');
    expect(bar).toHaveAttribute('aria-valuemax', '40');
    expect(bar).toHaveAttribute('aria-valuetext', '80%');
    expect(bar).toHaveAttribute('data-state', 'loading');
  });

  it('lets aria-valuetext replace the spoken value', () => {
    render(<ProgressBar value={3} max={4} aria-valuetext="3 of 4 steps" aria-label="Setup" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 4 steps');
  });

  it('scales the fill by max', () => {
    render(<Composed />);

    expect(screen.getByTestId('track').firstElementChild).toHaveStyle(
      'transform: translateX(-20%)',
    );
  });

  it('builds the text with formatValue from the clamped value and max', () => {
    render(
      <ProgressBar value={54} max={40} aria-label="Upload">
        <ProgressBar.Value formatValue={(value, max) => `${value} / ${max}`} />
      </ProgressBar>,
    );

    expect(screen.getByText('40 / 40')).toBeInTheDocument();
  });

  it('prefers children over formatValue', () => {
    render(
      <ProgressBar value={10} aria-label="Upload">
        <ProgressBar.Value formatValue={() => 'formatted'}>fixed</ProgressBar.Value>
      </ProgressBar>,
    );

    expect(screen.getByText('fixed')).toBeInTheDocument();
    expect(screen.queryByText('formatted')).not.toBeInTheDocument();
  });

  it('reserves no room for 100% when the circle value uses formatValue', () => {
    render(
      <ProgressBar type="circle" value={5} aria-label="Sync">
        <ProgressBar.Value formatValue={(value) => `${value} files`} />
        <ProgressBar.Track />
      </ProgressBar>,
    );

    expect(screen.getByText('5 files')).not.toHaveClass('min-w-ws-14');
  });

  it('shows its children instead of the percentage', () => {
    render(<Composed />);

    expect(screen.getByTestId('value')).toHaveTextContent('32 / 40');
  });

  it('shows the rounded percentage by default', () => {
    render(
      <ProgressBar value={1} max={3} aria-label="Steps">
        <ProgressBar.Value />
      </ProgressBar>,
    );

    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('reserves room for 100% only for the default circle value', () => {
    const { rerender } = render(
      <ProgressBar type="circle" value={5} aria-label="Sync">
        <ProgressBar.Value />
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByText('5%')).toHaveClass('min-w-ws-14');

    rerender(
      <ProgressBar type="circle" value={5} aria-label="Sync">
        <ProgressBar.Value>5 files</ProgressBar.Value>
        <ProgressBar.Track />
      </ProgressBar>,
    );
    expect(screen.getByText('5 files')).not.toHaveClass('min-w-ws-14');
  });

  it('colours the Description from the root status', () => {
    render(<Composed status="success" />);

    const description = screen.getByTestId('description');
    expect(description).toHaveClass('text-ws-semantic-positive');
    expect(description.querySelector('svg')).toBeInTheDocument();
  });

  it('forwards className and data-* to each part', () => {
    render(<Composed />);

    for (const part of ['header', 'label', 'value', 'track', 'description']) {
      expect(screen.getByTestId(part)).toHaveClass(`${part}-class`);
    }
  });

  it('forwards refs to the root, Header, Value and Track', () => {
    const rootRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const valueRef = createRef<HTMLSpanElement>();
    const trackRef = createRef<HTMLDivElement>();

    render(
      <ProgressBar ref={rootRef} value={50} aria-label="Upload">
        <ProgressBar.Header ref={headerRef}>
          <ProgressBar.Value ref={valueRef} />
        </ProgressBar.Header>
        <ProgressBar.Track ref={trackRef} />
      </ProgressBar>,
    );

    expect(rootRef.current).toBe(screen.getByRole('progressbar'));
    expect(headerRef.current).toHaveAttribute('data-slot', 'progress-bar-header');
    expect(valueRef.current).toHaveAttribute('data-slot', 'progress-bar-value');
    expect(trackRef.current).toHaveAttribute('data-slot', 'progress-bar-track');
  });

  it('renders the track alone for a bar without children', () => {
    render(<ProgressBar value={60} />);

    const root = screen.getByRole('progressbar');
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).toHaveAttribute('data-slot', 'progress-bar-track');
  });

  it('renders the ring alone, without text, for a circle without children', () => {
    render(<ProgressBar type="circle" value={60} aria-label="Sync" />);

    const root = screen.getByRole('progressbar');
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).toHaveAttribute('data-slot', 'progress-bar-track');
    expect(root).not.toHaveTextContent('60%');
  });
});

describe('Invalid numbers', () => {
  const warnSpy = () => vi.spyOn(console, 'warn').mockImplementation(() => {});

  it.each([NaN, Infinity])('renders 0 and warns for value %s', (value) => {
    const warn = warnSpy();
    render(<ProgressBar value={value} aria-label="Upload" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(warn).toHaveBeenCalledWith(
      `ProgressBar \`value\` must be a finite number. Received ${value}.`,
    );
    warn.mockRestore();
  });

  it.each([0, -5, NaN])('falls back to max 100 and warns for max %s', (max) => {
    const warn = warnSpy();
    render(<ProgressBar value={50} max={max} aria-label="Upload" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
    expect(warn).toHaveBeenCalledWith(
      `ProgressBar \`max\` must be a number greater than 0. Received ${max}.`,
    );
    warn.mockRestore();
  });

  it('does not warn when value and max are left out, or when value is only out of range', () => {
    const warn = warnSpy();
    render(<ProgressBar aria-label="Upload" />);
    render(<ProgressBar value={150} max={40} aria-label="Upload" />);

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
