import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ActionBar } from './ActionBar';
import { ActionBarActions } from './ActionBarActions';
import { ActionBarCount } from './ActionBarCount';
import { ActionBarSelectAll } from './ActionBarSelectAll';

describe('ActionBar', () => {
  it('renders children', () => {
    render(
      <ActionBar>
        <span>Action</span>
      </ActionBar>,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('preserves the action subtree when the legacy count is hidden', () => {
    const { rerender } = render(
      <ActionBar isOpen amountSelected={2}>
        <button type="button">Archive</button>
      </ActionBar>,
    );
    const archive = screen.getByRole('button', { name: 'Archive' });
    archive.focus();

    rerender(
      <ActionBar isOpen>
        <button type="button">Archive</button>
      </ActionBar>,
    );

    expect(screen.getByRole('button', { name: 'Archive' })).toBe(archive);
    expect(archive).toHaveFocus();
  });

  it('renders close button when onClose is provided', () => {
    render(<ActionBar isOpen onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('does not render close button when onClose is omitted', () => {
    render(<ActionBar isOpen />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<ActionBar isOpen onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders "N selected" when amountSelected is set', () => {
    render(<ActionBar amountSelected={5} />);
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('renders "1 selected" when amountSelected is 1', () => {
    render(<ActionBar amountSelected={1} />);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('renders "0 selected" when amountSelected is 0', () => {
    render(<ActionBar amountSelected={0} />);
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });

  it('renders label from formatter tuple when amountSelected is [count, format]', () => {
    render(<ActionBar amountSelected={[3, (n) => `Wybrano: ${n}`]} />);
    expect(screen.getByText('Wybrano: 3')).toBeInTheDocument();
  });

  it('does not render selected label when amountSelected is omitted', () => {
    render(<ActionBar />);
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('does not render selected label when amountSelected is NaN', () => {
    render(<ActionBar isOpen amountSelected={Number.NaN} />);
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('renders leading group before actions group', () => {
    render(
      <ActionBar isOpen onClose={() => {}} amountSelected={2}>
        <button>Delete</button>
      </ActionBar>,
    );
    const bar = screen.getByRole('button', { name: 'Close' }).closest('[data-state]')!;
    const groups = Array.from(bar.children);
    const leadingIdx = groups.findIndex((el) => el.querySelector('[aria-label="Close"]'));
    const actionsIdx = groups.findIndex((el) => el.textContent?.includes('Delete'));
    expect(leadingIdx).toBeGreaterThanOrEqual(0);
    expect(actionsIdx).toBeGreaterThanOrEqual(0);
    expect(leadingIdx).toBeLessThan(actionsIdx);
  });

  it('forwards HTML attributes', () => {
    render(<ActionBar data-testid="bar" aria-label="action bar" role="group" />);
    const el = screen.getByTestId('bar');
    expect(el).toHaveAttribute('aria-label', 'action bar');
    expect(el).toHaveAttribute('role', 'group');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ActionBar ref={ref} data-testid="bar" />);
    expect(ref.current).toBe(screen.getByTestId('bar'));
  });

  describe('isOpen', () => {
    it('is accessible when open', () => {
      render(<ActionBar data-testid="bar" isOpen />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-state', 'open');
      expect(bar).not.toHaveAttribute('aria-hidden');
      expect(bar).not.toHaveAttribute('inert');
    });

    it('is hidden when closed', () => {
      render(<ActionBar data-testid="bar" isOpen={false} />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-state', 'closed');
      expect(bar).toHaveAttribute('aria-hidden', 'true');
      expect(bar).toHaveAttribute('inert');
    });

    it('is hidden when isOpen is omitted', () => {
      render(<ActionBar data-testid="bar" />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-state', 'closed');
      expect(bar).toHaveAttribute('aria-hidden', 'true');
      expect(bar).toHaveAttribute('inert');
    });

    it('remains in the DOM when closed', () => {
      render(<ActionBar data-testid="bar" />);
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });
  });
});

// Snapshot Tests
describe('ActionBar Snapshots', () => {
  const positions = ['top', 'bottom'] as const;
  const aligns = ['left', 'center', 'right'] as const;

  describe('isOpen states', () => {
    it('matches snapshot when open', () => {
      const { container } = render(
        <ActionBar isOpen amountSelected={3} onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when closed', () => {
      const { container } = render(
        <ActionBar amountSelected={3} onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('position', () => {
    positions.forEach((position) => {
      it(`matches snapshot for position=${position}`, () => {
        const { container } = render(
          <ActionBar isOpen position={position} amountSelected={2} onClose={() => {}}>
            <span>Action</span>
          </ActionBar>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('align', () => {
    aligns.forEach((align) => {
      it(`matches snapshot for align=${align}`, () => {
        const { container } = render(
          <ActionBar isOpen align={align} amountSelected={2} onClose={() => {}}>
            <span>Action</span>
          </ActionBar>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('onClose', () => {
    it('matches snapshot with onClose provided', () => {
      const { container } = render(
        <ActionBar isOpen amountSelected={3} onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot without onClose', () => {
      const { container } = render(
        <ActionBar isOpen amountSelected={3}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('amountSelected', () => {
    it('matches snapshot with amountSelected omitted', () => {
      const { container } = render(
        <ActionBar isOpen onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with amountSelected=0', () => {
      const { container } = render(
        <ActionBar isOpen amountSelected={0} onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with amountSelected=5', () => {
      const { container } = render(
        <ActionBar isOpen amountSelected={5} onClose={() => {}}>
          <span>Action</span>
        </ActionBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <ActionBar isOpen data-testid="bar">
        <button type="button">Delete</button>
      </ActionBar>,
    );
    expect(screen.getByTestId('bar')).toHaveAttribute('data-slot', 'action-bar');
  });
});

describe('Composed ActionBar', () => {
  it('renders the count as a status with its native props', () => {
    render(
      <ActionBar isOpen>
        <ActionBarCount aria-label="Selection count">3 selected</ActionBarCount>
      </ActionBar>,
    );

    const count = screen.getByRole('status', { name: 'Selection count' });
    expect(count).toHaveAttribute('data-slot', 'action-bar-count');
    expect(count).toHaveTextContent('3 selected');
  });

  it('forwards actions props to the raised segment', () => {
    render(
      <ActionBar isOpen>
        <ActionBarActions role="group" aria-label="Selection actions" />
      </ActionBar>,
    );

    expect(screen.getByRole('group', { name: 'Selection actions' })).toHaveAttribute(
      'data-slot',
      'action-bar-actions',
    );
  });

  it.each([
    ['indeterminate', true],
    [true, false],
  ] as const)('updates Select all from %s to %s by keyboard', async (checked, next) => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <ActionBar isOpen>
        <ActionBarActions>
          <ActionBarSelectAll checked={checked} onCheckedChange={onCheckedChange} />
        </ActionBarActions>
      </ActionBar>,
    );

    await user.tab();
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toHaveAttribute('data-slot', 'action-bar-select-all');
    expect(checkbox).toHaveFocus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(next);
  });
});
