import { RiBugLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tile } from './Tile';

describe('Tile', () => {
  describe('Basic rendering', () => {
    it('should render tile with children', () => {
      render(<Tile>Content</Tile>);

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render tile with title, description, and icon', () => {
      const { container } = render(
        <Tile description="Tile Description" icon={RiBugLine} title="Tile Title">
          Content
        </Tile>,
      );

      expect(screen.getByText('Tile Title')).toBeInTheDocument();
      expect(screen.getByText('Tile Description')).toBeInTheDocument();
      expect(container.querySelectorAll('svg')).toHaveLength(1);
    });

    it('should be static: no role, no tab stop, no aria state', () => {
      render(<Tile data-testid="tile">Content</Tile>);

      const tile = screen.getByTestId('tile');
      expect(tile.tagName).toBe('DIV');
      expect(tile).not.toHaveAttribute('role');
      expect(tile).not.toHaveAttribute('tabindex');
      expect(tile).not.toHaveAttribute('aria-disabled');
    });

    it('should render onto the child element with asChild', () => {
      render(
        <Tile asChild>
          <li>Content</li>
        </Tile>,
      );

      const item = screen.getByText('Content');
      expect(item.tagName).toBe('LI');
      expect(item).toHaveClass('rounded-ws-container-md');
    });
  });

  describe('Tile.Checkbox', () => {
    it('should expose checkbox semantics, not a toggle button', () => {
      render(<Tile.Checkbox checked title="Logs" />);

      const checkbox = screen.getByRole('checkbox', { name: /Logs/ });
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).not.toHaveAttribute('aria-pressed');
    });

    it('should toggle on click and on Space', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(<Tile.Checkbox onCheckedChange={onCheckedChange} title="Logs" />);

      const checkbox = screen.getByRole('checkbox', { name: /Logs/ });
      await user.click(checkbox);
      expect(onCheckedChange).toHaveBeenLastCalledWith(true);

      checkbox.focus();
      await user.keyboard(' ');
      expect(onCheckedChange).toHaveBeenCalledTimes(2);
    });

    it('should use the native disabled attribute', () => {
      render(<Tile.Checkbox disabled title="Logs" />);

      expect(screen.getByRole('checkbox', { name: /Logs/ })).toBeDisabled();
    });

    it('should not nest an interactive control inside the tile', () => {
      const { container } = render(
        <Tile.Checkbox checked title="Logs">
          <Tile.Indicator />
        </Tile.Checkbox>,
      );

      const root = screen.getByRole('checkbox', { name: /Logs/ });
      expect(
        root.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])'),
      ).toHaveLength(0);
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });

  describe('Tile.Radio', () => {
    it('should expose radiogroup and radio semantics', () => {
      render(
        <Tile.RadioGroup value="pro">
          <Tile.Radio title="Starter" value="starter" />
          <Tile.Radio title="Pro" value="pro" />
        </Tile.RadioGroup>,
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /Starter/ })).toHaveAttribute(
        'aria-checked',
        'false',
      );
      expect(screen.getByRole('radio', { name: /Pro/ })).toHaveAttribute('aria-checked', 'true');
    });

    it('should give the group an accessible name from label', () => {
      render(
        <Tile.RadioGroup label="Plan" value="pro">
          <Tile.Radio title="Pro" value="pro" />
        </Tile.RadioGroup>,
      );

      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    });

    it('should draw a decorative asterisk on the label when required', () => {
      render(
        <Tile.RadioGroup label="Plan" value="pro" required>
          <Tile.Radio title="Pro" value="pro" />
        </Tile.RadioGroup>,
      );

      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    });

    it('should let an explicit aria-label win over label', () => {
      render(
        <Tile.RadioGroup aria-label="Billing plan" label="Plan" value="pro">
          <Tile.Radio title="Pro" value="pro" />
        </Tile.RadioGroup>,
      );

      expect(screen.getByRole('radiogroup', { name: 'Billing plan' })).toBeInTheDocument();
    });

    // Arrow-key navigation itself belongs to Radix and is not re-tested here,
    // in line with RadioButton and Checkbox. What is worth asserting is the
    // consequence for consumers: the whole group is one tab stop, not one per
    // tile.
    it('should be a single tab stop for the whole group', async () => {
      const user = userEvent.setup();

      render(
        <>
          <Tile.RadioGroup value="starter">
            <Tile.Radio title="Starter" value="starter" />
            <Tile.Radio title="Pro" value="pro" />
            <Tile.Radio title="Enterprise" value="enterprise" />
          </Tile.RadioGroup>
          <button type="button">After</button>
        </>,
      );

      await user.tab();
      const radios = screen.getAllByRole('radio');
      expect(radios.some((radio) => radio === document.activeElement)).toBe(true);

      // One more Tab leaves the group entirely, rather than stepping through
      // the remaining tiles.
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <>
        <Tile icon={RiBugLine} title="Team" description="8 members" />
        <Tile.Checkbox title="Backups">
          <Tile.Indicator />
        </Tile.Checkbox>
        <Tile.RadioGroup aria-label="Plan">
          <Tile.Radio value="pro" title="Pro" />
        </Tile.RadioGroup>
      </>,
    );

    const slot = (name: string) => container.querySelector(`[data-slot="${name}"]`);
    expect(slot('tile')).toBeInTheDocument();
    expect(slot('tile-body')).toBeInTheDocument();
    expect(slot('tile-icon')).toBeInTheDocument();
    expect(screen.getByText('Team')).toHaveAttribute('data-slot', 'tile-title');
    expect(screen.getByText('8 members')).toHaveAttribute('data-slot', 'tile-description');
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'tile-checkbox');
    expect(slot('tile-indicator')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-slot', 'tile-radio-group');
    expect(screen.getByRole('radio')).toHaveAttribute('data-slot', 'tile-radio');
  });
});
