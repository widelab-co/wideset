import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  describe('Basic rendering', () => {
    it('should render tooltip trigger', () => {
      render(
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Label>Tooltip content</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Hover me' });
      expect(button).toBeInTheDocument();
    });

    it('should render tooltip content when open', async () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Label>Tooltip content</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      await waitFor(() => {
        const labels = screen.getAllByText('Tooltip content');
        expect(labels.length).toBeGreaterThan(0);
      });
    });

    it('should apply default variant', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toHaveClass('bg-ws-static-inverse-background');
    });
  });

  describe('Arrow prop', () => {
    it('should render arrow by default', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      const arrow = content.querySelector('[data-testid="tooltip-arrow"]');
      expect(arrow).toBeInTheDocument();
    });

    it('should not render arrow when arrow is false', () => {
      render(
        <Tooltip arrow={false} defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      const arrow = content.querySelector('[data-testid="tooltip-arrow"]');
      expect(arrow).not.toBeInTheDocument();
    });

    // Radix may flip the content to the other side when it would overflow the viewport, so the
    // arrow must not be placed from the requested side.
    it("the arrow's classes do not depend on the requested side", () => {
      const arrowClassFor = (side: 'top' | 'bottom') => {
        const { unmount } = render(
          <Tooltip defaultOpen>
            <Tooltip.Trigger asChild>
              <Button>Hover me</Button>
            </Tooltip.Trigger>
            <Tooltip.Content side={side} data-testid="tooltip-content">
              <Tooltip.Label>Tooltip</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>,
        );
        const className = screen
          .getByTestId('tooltip-content')
          .querySelector('[data-testid="tooltip-arrow"]')?.className;
        unmount();
        return className;
      };
      expect(arrowClassFor('top')).toBe(arrowClassFor('bottom'));
    });

    it("the arrow is placed from the content's resolved data-side", () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toHaveAttribute('data-side');
      // The selectors key on the direct parent's data-side, so the arrow must stay its child.
      expect(content.querySelector(':scope > [data-testid="tooltip-arrow"]')).toHaveClass(
        '[[data-side=top]>&]:top-full',
        '[[data-side=right]>&]:right-full',
        '[[data-side=bottom]>&]:bottom-full',
        '[[data-side=left]>&]:left-full',
      );
    });
  });

  describe('Interaction', () => {
    it('should show tooltip on hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Label>Tooltip content</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const button = screen.getByRole('button', { name: 'Hover me' });
      await user.hover(button);
      await waitFor(
        () => {
          const labels = screen.getAllByText('Tooltip content');
          expect(labels.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Keyboard', () => {
    it('should open on keyboard focus and close with Escape', async () => {
      const user = userEvent.setup();

      render(
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Label>Tooltip content</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });

      await user.tab();
      expect(trigger).toHaveFocus();
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { name: 'Tooltip content' })).toBeInTheDocument();
        expect(trigger).toHaveFocus();
      });

      await user.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('tooltip', { name: 'Tooltip content' })).not.toBeInTheDocument(),
      );
      expect(trigger).toHaveFocus();
    });

    it('should close tooltip when focus leaves the trigger', async () => {
      const user = userEvent.setup();

      render(
        <>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button>Hover me</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Tooltip content</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <button type="button">After</button>
        </>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const afterButton = screen.getByRole('button', { name: 'After' });

      await user.tab();
      expect(trigger).toHaveFocus();
      expect(screen.getByRole('tooltip', { name: 'Tooltip content' })).toBeInTheDocument();

      await user.tab();
      expect(afterButton).toHaveFocus();
      await waitFor(() =>
        expect(screen.queryByRole('tooltip', { name: 'Tooltip content' })).not.toBeInTheDocument(),
      );
    });
  });

  // Snapshot Tests
  describe('Tooltip Snapshots', () => {
    it('matches snapshot for default tooltip', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip Label</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });

    it('matches snapshot for inverse variant', () => {
      render(
        <Tooltip variant="inverse" defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip Label</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });

    it('matches snapshot without arrow', () => {
      render(
        <Tooltip arrow={false} defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip Label</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });

    it('matches snapshot with label and description', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip Label</Tooltip.Label>
            <Tooltip.Description>Tooltip Description</Tooltip.Description>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });

    it('matches snapshot with different sides', () => {
      const sides = ['top', 'right', 'bottom', 'left'] as const;
      sides.forEach((side) => {
        const { unmount } = render(
          <Tooltip defaultOpen>
            <Tooltip.Trigger asChild>
              <Button>Hover me</Button>
            </Tooltip.Trigger>
            <Tooltip.Content side={side} data-testid="tooltip-content">
              <Tooltip.Label>Tooltip Label</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>,
        );
        const content = screen.getByTestId('tooltip-content');
        expect(content).toMatchSnapshot();
        unmount();
      });
    });

    it('matches snapshot with custom className', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content className="max-w-48" data-testid="tooltip-content">
            <Tooltip.Label>Tooltip Label</Tooltip.Label>
            <Tooltip.Description>Long description text</Tooltip.Description>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });

    it('matches snapshot with Portal', () => {
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content data-testid="tooltip-content">
              <Tooltip.Label>Tooltip Label</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(content).toMatchSnapshot();
    });
  });

  describe('Portal', () => {
    it('renders the content in document.body by default', () => {
      const { container } = render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content">
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      const content = screen.getByTestId('tooltip-content');
      expect(container).not.toContainElement(content);
      expect(document.body).toContainElement(content);
    });

    it('renders the content in portalContainer when provided', () => {
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content" portalContainer={portalContainer}>
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      expect(portalContainer).toContainElement(screen.getByTestId('tooltip-content'));
      portalContainer.remove();
    });

    it('keeps forceMount content mounted while the tooltip is closed', () => {
      render(
        <Tooltip open={false}>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="tooltip-content" forceMount>
            <Tooltip.Label>Tooltip</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>,
      );
      expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'closed');
    });

    it('renders into the container of an enclosing Tooltip.Portal', () => {
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
      render(
        <Tooltip defaultOpen>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal container={portalContainer}>
            <Tooltip.Content data-testid="tooltip-content">
              <Tooltip.Label>Tooltip</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );
      expect(portalContainer).toContainElement(screen.getByTestId('tooltip-content'));
      portalContainer.remove();
    });

    it('keeps content mounted while closed when Tooltip.Portal has forceMount', () => {
      render(
        <Tooltip open={false}>
          <Tooltip.Trigger asChild>
            <Button>Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Portal forceMount>
            <Tooltip.Content data-testid="tooltip-content">
              <Tooltip.Label>Tooltip</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );
      expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'closed');
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>Share</Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Label>Label</Tooltip.Label>
          <Tooltip.Description>Description</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>,
    );
    const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
    await waitFor(() => expect(slot('tooltip-content')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Share' })).toHaveAttribute(
      'data-slot',
      'tooltip-trigger',
    );
    expect(slot('tooltip-label')).toHaveTextContent('Label');
    expect(slot('tooltip-description')).toHaveTextContent('Description');
    expect(slot('tooltip-arrow')).toBeInTheDocument();
  });
});
