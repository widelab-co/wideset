import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button/Button';
import { ActionBar } from './ActionBar';
import type { ActionBarProps, ActionBarSelectAllProps } from './ActionBar.types';

const Bar = ({
  selectAll,
  ...props
}: Partial<ActionBarProps> & { selectAll?: ActionBarSelectAllProps }) => (
  <ActionBar isOpen data-testid="bar" {...props}>
    <ActionBar.Count>4 rows selected</ActionBar.Count>
    <ActionBar.Actions>
      <ActionBar.SelectAll checked="indeterminate" {...selectAll} />
      <Button variant="secondary" size="sm">
        Publish
      </Button>
      <Button variant="danger" preset="ghost" size="sm">
        Delete
      </Button>
    </ActionBar.Actions>
  </ActionBar>
);

describe('ActionBar', () => {
  describe('Rendering', () => {
    it('renders the count, Select all and the actions', () => {
      render(<Bar />);
      expect(screen.getByText('4 rows selected')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
    });

    it('announces the count politely', () => {
      render(<Bar />);
      expect(screen.getByRole('status')).toHaveTextContent('4 rows selected');
    });

    it('shows Select all as indeterminate while only some items are selected', () => {
      render(<Bar />);
      expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
        'aria-checked',
        'mixed',
      );
    });

    it('takes another label for Select all', () => {
      render(<Bar selectAll={{ label: 'Zaznacz wszystkie' }} />);
      expect(screen.getByRole('checkbox', { name: 'Zaznacz wszystkie' })).toBeInTheDocument();
    });

    it('marks each part with data-slot', () => {
      render(<Bar />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-slot', 'action-bar');
      expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'action-bar-count');
      expect(bar.querySelector('[data-slot="action-bar-actions"]')).toBeInTheDocument();
      expect(bar.querySelector('[data-slot="action-bar-select-all"]')).toContainElement(
        screen.getByRole('checkbox', { name: 'Select all' }),
      );
    });
  });

  describe('isOpen', () => {
    it('is accessible when open', () => {
      render(<Bar />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-state', 'open');
      expect(bar).not.toHaveAttribute('aria-hidden');
      expect(bar).not.toHaveAttribute('inert');
    });

    it('is hidden and inert when closed', () => {
      render(<Bar isOpen={false} />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('data-state', 'closed');
      expect(bar).toHaveAttribute('aria-hidden', 'true');
      expect(bar).toHaveAttribute('inert');
    });

    it('is closed when isOpen is omitted', () => {
      render(<ActionBar data-testid="bar" />);
      expect(screen.getByTestId('bar')).toHaveAttribute('data-state', 'closed');
    });

    it('stays in the DOM when closed, so it can animate out', () => {
      render(<Bar isOpen={false} />);
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('selects every item from the indeterminate state', async () => {
      const onCheckedChange = vi.fn();
      render(<Bar selectAll={{ onCheckedChange }} />);
      await userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('clears the selection once every item is selected', async () => {
      const onCheckedChange = vi.fn();
      render(<Bar selectAll={{ checked: true, onCheckedChange }} />);
      await userEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it('tabs through Select all and the actions in visual order', async () => {
      render(<Bar />);
      await userEvent.tab();
      expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Publish' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    });
  });

  describe('Props', () => {
    it('forwards HTML attributes and merges className on the root', () => {
      render(<Bar aria-label="Bulk actions" role="region" className="custom" />);
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('aria-label', 'Bulk actions');
      expect(bar).toHaveAttribute('role', 'region');
      expect(bar).toHaveClass('custom', 'fixed');
    });

    it('forwards attributes and className on the parts', () => {
      render(
        <ActionBar isOpen>
          <ActionBar.Count data-testid="count" className="custom-count">
            1 row selected
          </ActionBar.Count>
          <ActionBar.Actions data-testid="actions" aria-label="Row actions" className="custom">
            <ActionBar.SelectAll aria-describedby="hint" />
          </ActionBar.Actions>
        </ActionBar>,
      );
      expect(screen.getByTestId('count')).toHaveClass('custom-count', 'typography-label-sm');
      expect(screen.getByTestId('actions')).toHaveAttribute('aria-label', 'Row actions');
      expect(screen.getByTestId('actions')).toHaveClass('custom');
      expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
        'aria-describedby',
        'hint',
      );
    });

    it('forwards refs to the root, the parts and the checkbox', () => {
      const bar = createRef<HTMLDivElement>();
      const count = createRef<HTMLParagraphElement>();
      const actions = createRef<HTMLDivElement>();
      const selectAll = createRef<HTMLButtonElement>();
      render(
        <ActionBar ref={bar} isOpen>
          <ActionBar.Count ref={count}>1 row selected</ActionBar.Count>
          <ActionBar.Actions ref={actions}>
            <ActionBar.SelectAll ref={selectAll} />
          </ActionBar.Actions>
        </ActionBar>,
      );
      expect(bar.current).toHaveAttribute('data-slot', 'action-bar');
      expect(count.current).toHaveAttribute('data-slot', 'action-bar-count');
      expect(actions.current).toHaveAttribute('data-slot', 'action-bar-actions');
      expect(selectAll.current).toBe(screen.getByRole('checkbox', { name: 'Select all' }));
    });
  });
});

describe('ActionBar Snapshots', () => {
  it('matches snapshot when open', () => {
    const { container } = render(<Bar />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when closed', () => {
    const { container } = render(<Bar isOpen={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  (['top', 'bottom'] as const).forEach((position) => {
    it(`matches snapshot for position=${position}`, () => {
      const { container } = render(<Bar position={position} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  (['left', 'center', 'right'] as const).forEach((align) => {
    it(`matches snapshot for align=${align}`, () => {
      const { container } = render(<Bar align={align} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
