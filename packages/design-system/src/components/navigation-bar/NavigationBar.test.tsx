import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { NavigationBar } from './NavigationBar';

const Icon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon" {...props} />;

describe('NavigationBar', () => {
  describe('Root', () => {
    it('renders a header, the banner landmark at the top of the page', () => {
      render(<NavigationBar />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('draws the bottom line by default', () => {
      render(<NavigationBar />);
      expect(screen.getByRole('banner')).toHaveClass('border-b', 'border-ws-static-base');
    });

    it('drops the line with divider={false}', () => {
      render(<NavigationBar divider={false} />);
      expect(screen.getByRole('banner')).not.toHaveClass('border-b');
    });

    it('passes rest props and merges className', () => {
      render(
        <NavigationBar data-testid="bar" aria-label="App" className="bg-ws-static-foreground" />,
      );
      const bar = screen.getByTestId('bar');
      expect(bar).toHaveAttribute('aria-label', 'App');
      expect(bar).toHaveClass('bg-ws-static-foreground', 'h-ws-20');
    });
  });

  describe('NavigationBar.Nav', () => {
    it('is a navigation landmark named "Main" by default', () => {
      render(<NavigationBar.Nav />);
      expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    });

    it('takes another name through aria-label', () => {
      render(<NavigationBar.Nav aria-label="Product" />);
      expect(screen.getByRole('navigation', { name: 'Product' })).toBeInTheDocument();
    });
  });

  describe('NavigationBar.Item', () => {
    it('renders a link with its label and href', () => {
      render(<NavigationBar.Item href="/analytics" label="Analytics" />);
      expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('href', '/analytics');
    });

    it('marks the current page with aria-current', () => {
      render(
        <>
          <NavigationBar.Item href="/" label="Dashboard" active />
          <NavigationBar.Item href="/analytics" label="Analytics" />
        </>,
      );
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-current');
    });

    it('renders the icon hidden from screen readers', () => {
      render(<NavigationBar.Item href="/" icon={Icon} label="Dashboard" />);
      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    });

    it('renders the badge inside the link, after the label', () => {
      render(<NavigationBar.Item href="/products" label="Products" badge="New" />);
      const link = screen.getByRole('link');
      expect(link).toContainElement(screen.getByText('New'));
      expect(link).toHaveTextContent(/^ProductsNew$/);
    });

    it('blocks a disabled link and takes it out of the tab order', () => {
      const onClick = vi.fn();
      render(<NavigationBar.Item href="/tasks" label="Tasks" disabled onClick={onClick} />);
      const link = screen.getByRole('link', { name: 'Tasks' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
      const notCancelled = fireEvent.click(link);
      expect(notCancelled).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('calls onClick on an enabled link', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      const user = userEvent.setup();
      render(<NavigationBar.Item href="/analytics" label="Analytics" onClick={onClick} />);
      await user.click(screen.getByRole('link', { name: 'Analytics' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('injects the icon and label into the asChild element', () => {
      // Mimics a router Link: forwards className and props onto the anchor.
      const RouterLink = ({
        to,
        children,
        ...rest
      }: {
        to: string;
        children?: React.ReactNode;
      } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={to} data-router-link {...rest}>
          {children}
        </a>
      );
      render(
        <NavigationBar.Item asChild icon={Icon} label="Products" active>
          <RouterLink to="/products" />
        </NavigationBar.Item>,
      );
      const link = screen.getByRole('link', { name: 'Products' });
      expect(link).toHaveAttribute('data-router-link');
      expect(link).toHaveAttribute('href', '/products');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(link).toHaveClass('rounded-ws-control-lg');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Keyboard', () => {
    it('moves through the links in order and skips a disabled one', async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar>
          <NavigationBar.Nav>
            <NavigationBar.Item href="/" label="Dashboard" active />
            <NavigationBar.Item href="/tasks" label="Tasks" disabled />
            <NavigationBar.Item href="/analytics" label="Analytics" />
          </NavigationBar.Nav>
        </NavigationBar>,
      );
      await user.tab();
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Analytics' })).toHaveFocus();
    });
  });

  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      render(
        <NavigationBar data-testid="bar">
          <NavigationBar.Start data-testid="start" />
          <NavigationBar.Nav>
            <NavigationBar.Item href="/" label="Dashboard" />
          </NavigationBar.Nav>
          <NavigationBar.End data-testid="end">
            <NavigationBar.Actions data-testid="actions" />
          </NavigationBar.End>
        </NavigationBar>,
      );
      expect(screen.getByTestId('bar')).toHaveAttribute('data-slot', 'navigation-bar');
      expect(screen.getByTestId('start')).toHaveAttribute('data-slot', 'navigation-bar-start');
      expect(screen.getByRole('navigation')).toHaveAttribute('data-slot', 'navigation-bar-nav');
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
        'data-slot',
        'navigation-bar-item',
      );
      expect(screen.getByTestId('end')).toHaveAttribute('data-slot', 'navigation-bar-end');
      expect(screen.getByTestId('actions')).toHaveAttribute('data-slot', 'navigation-bar-actions');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for a bar with links and actions', () => {
      const { container } = render(
        <NavigationBar>
          <NavigationBar.Start>
            <button type="button" aria-label="Open menu" />
          </NavigationBar.Start>
          <NavigationBar.Nav>
            <NavigationBar.Item href="/" icon={Icon} label="Dashboard" active />
            <NavigationBar.Item href="/products" icon={Icon} label="Products" badge="New" />
            <NavigationBar.Item href="/tasks" icon={Icon} label="Tasks" disabled />
          </NavigationBar.Nav>
          <NavigationBar.End>
            <NavigationBar.Actions>
              <button type="button" aria-label="Settings" />
            </NavigationBar.Actions>
          </NavigationBar.End>
        </NavigationBar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot without the divider', () => {
      const { container } = render(<NavigationBar divider={false} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
