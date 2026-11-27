import { RiHome5Line } from '@remixicon/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { NavigationBar } from './NavigationBar';

type ItemProps = Omit<React.ComponentProps<typeof NavigationBar.Item>, 'asChild' | 'children'> & {
  label: string;
};

/** A page link composed the way a consumer writes it. */
const Item = ({ label, ...props }: ItemProps) => (
  <NavigationBar.Item {...props}>
    <NavigationBar.Icon icon={RiHome5Line} />
    <NavigationBar.Label>{label}</NavigationBar.Label>
  </NavigationBar.Item>
);

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
    it('renders a link named by its label', () => {
      render(<Item href="/analytics" label="Analytics" />);
      expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('href', '/analytics');
    });

    it('marks the current page with aria-current', () => {
      render(
        <>
          <Item href="/" label="Dashboard" active />
          <Item href="/analytics" label="Analytics" />
        </>,
      );
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-current');
    });

    it('names the link with what follows the label, such as a tag', () => {
      render(
        <NavigationBar.Item href="/products">
          <NavigationBar.Label>Products</NavigationBar.Label>
          <span>New</span>
        </NavigationBar.Item>,
      );
      expect(screen.getByRole('link', { name: /^Products\s?New$/ })).toBeInTheDocument();
    });

    it('blocks a disabled link and takes it out of the tab order', () => {
      const onClick = vi.fn();
      render(<Item href="/tasks" label="Tasks" disabled onClick={onClick} />);
      const link = screen.getByRole('link', { name: 'Tasks' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
      const notCancelled = fireEvent.click(link);
      expect(notCancelled).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('drops the href of a disabled link and keeps its link role', () => {
      render(<Item href="/tasks" label="Tasks" disabled />);
      expect(screen.getByRole('link', { name: 'Tasks' })).not.toHaveAttribute('href');
    });

    it('keeps a disabled asChild router link from navigating', () => {
      const navigate = vi.fn();
      const onLinkClick = vi.fn();
      // Mimics a router Link that navigates on click without checking defaultPrevented.
      const RouterLink = ({
        to,
        onClick,
        children,
        ...rest
      }: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          href={to}
          {...rest}
          onClick={(event) => {
            onClick?.(event);
            navigate(to);
          }}
        >
          {children}
        </a>
      );
      render(
        <NavigationBar.Item asChild disabled>
          <RouterLink to="/tasks" onClick={onLinkClick}>
            <NavigationBar.Label>Tasks</NavigationBar.Label>
          </RouterLink>
        </NavigationBar.Item>,
      );
      const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Tasks' }));
      expect(notCancelled).toBe(false);
      expect(onLinkClick).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('calls onClick on an enabled link', async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      const user = userEvent.setup();
      render(<Item href="/analytics" label="Analytics" onClick={onClick} />);
      await user.click(screen.getByRole('link', { name: 'Analytics' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders as its child with asChild, which holds the parts', () => {
      // Mimics a router Link: forwards className and props onto the anchor.
      const RouterLink = ({
        to,
        children,
        ...rest
      }: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={to} data-router-link {...rest}>
          {children}
        </a>
      );
      render(
        <NavigationBar.Item asChild active>
          <RouterLink to="/products">
            <NavigationBar.Icon icon={RiHome5Line} />
            <NavigationBar.Label>Products</NavigationBar.Label>
          </RouterLink>
        </NavigationBar.Item>,
      );
      const link = screen.getByRole('link', { name: 'Products' });
      expect(link).toHaveAttribute('data-router-link');
      expect(link).toHaveAttribute('href', '/products');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(link).toHaveClass('rounded-ws-control-lg');
    });
  });

  describe('NavigationBar.Icon', () => {
    it('is hidden from screen readers', () => {
      const { container } = render(<Item href="/" label="Dashboard" />);
      expect(container.querySelector('[data-slot="navigation-bar-icon"]')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('is dimmed on every link but the current page', () => {
      const { container } = render(
        <>
          <Item href="/" label="Dashboard" active />
          <Item href="/analytics" label="Analytics" />
        </>,
      );
      const [current, other] = container.querySelectorAll('[data-slot="navigation-bar-icon"]');
      expect(current).not.toHaveClass('opacity-75');
      expect(other).toHaveClass('text-ws-static-subtle', 'opacity-75');
    });

    it('throws outside NavigationBar.Item', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<NavigationBar.Icon icon={RiHome5Line} />)).toThrow(
        'useNavigationBarItemContext must be used within a <NavigationBar.Item>',
      );
      vi.restoreAllMocks();
    });
  });

  describe('Keyboard', () => {
    it('moves through the links in order and skips a disabled one', async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar>
          <NavigationBar.Nav>
            <Item href="/" label="Dashboard" active />
            <Item href="/tasks" label="Tasks" disabled />
            <Item href="/analytics" label="Analytics" />
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
      const { container } = render(
        <NavigationBar data-testid="bar">
          <NavigationBar.Start data-testid="start" />
          <NavigationBar.Nav>
            <Item href="/" label="Dashboard" />
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
      expect(container.querySelector('[data-slot="navigation-bar-icon"]')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toHaveAttribute('data-slot', 'navigation-bar-label');
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
            <Item href="/" label="Dashboard" active />
            <NavigationBar.Item href="/products">
              <NavigationBar.Icon icon={RiHome5Line} />
              <NavigationBar.Label>Products</NavigationBar.Label>
              <span>New</span>
            </NavigationBar.Item>
            <Item href="/tasks" label="Tasks" disabled />
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
