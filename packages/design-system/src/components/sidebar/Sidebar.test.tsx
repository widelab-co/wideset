import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  describe('Root behavior', () => {
    describe('Basic rendering', () => {
      it('should render children', () => {
        render(
          <Sidebar>
            <div>Test content</div>
          </Sidebar>,
        );
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });

      it('should apply custom className', () => {
        const { container } = render(
          <Sidebar className="custom-class">
            <div>Content</div>
          </Sidebar>,
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('custom-class');
      });
    });

    describe('Uncontrolled mode', () => {
      it('should start expanded by default', () => {
        const { container } = render(
          <Sidebar>
            <div>Content</div>
          </Sidebar>,
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-state', 'expanded');
      });

      it('should start collapsed when defaultCollapsed is true', () => {
        const { container } = render(
          <Sidebar defaultCollapsed>
            <div>Content</div>
          </Sidebar>,
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-state', 'collapsed');
      });

      it('should call onCollapsedChange when state changes', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();
        render(
          <Sidebar onCollapsedChange={handleChange}>
            <Sidebar.Trigger />
          </Sidebar>,
        );
        const trigger = screen.getByRole('button');
        await user.click(trigger);
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });

    describe('Controlled mode', () => {
      it('should respect collapsed prop when true', () => {
        const { container } = render(
          <Sidebar collapsed>
            <div>Content</div>
          </Sidebar>,
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-state', 'collapsed');
      });

      it('should respect collapsed prop when false', () => {
        const { container } = render(
          <Sidebar collapsed={false}>
            <div>Content</div>
          </Sidebar>,
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveAttribute('data-state', 'expanded');
      });

      it('should call onCollapsedChange when toggled', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();
        render(
          <Sidebar collapsed={false} onCollapsedChange={handleChange}>
            <Sidebar.Trigger />
          </Sidebar>,
        );
        const trigger = screen.getByRole('button');
        await user.click(trigger);
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Sidebar.Section', () => {
    it('should render Sidebar.Expanded content when sidebar is expanded', () => {
      render(
        <Sidebar collapsed={false}>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Expanded Content</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Collapsed Content</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.getByText('Expanded Content')).toBeInTheDocument();
      expect(screen.queryByText('Collapsed Content')).not.toBeInTheDocument();
    });

    it('should render Sidebar.Collapsed content when sidebar is collapsed', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Expanded Content</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Collapsed Content</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.getByText('Collapsed Content')).toBeInTheDocument();
      expect(screen.queryByText('Expanded Content')).not.toBeInTheDocument();
    });

    it('should not render section when collapsed and Sidebar.Collapsed is omitted', () => {
      const { container } = render(
        <Sidebar collapsed>
          <Sidebar.Section className="custom-wrapper">
            <Sidebar.Expanded>
              <div>Expanded Content</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.queryByText('Expanded Content')).not.toBeInTheDocument();
      expect(container.querySelector('.custom-wrapper')).not.toBeInTheDocument();
    });

    it('should keep content without a mode wrapper in both modes', async () => {
      const user = userEvent.setup();
      render(
        <Sidebar>
          <Sidebar.Section>
            <nav aria-label="Main">
              <Sidebar.Item href="#" label="Dashboard" />
            </nav>
          </Sidebar.Section>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const item = screen.getByRole('link', { name: 'Dashboard' });

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('link', { name: 'Dashboard' })).toBe(item);
    });

    it('should keep a section that mixes plain content with a mode wrapper', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Section data-testid="section">
            <Sidebar.Expanded>
              <span>Northwind</span>
            </Sidebar.Expanded>
            <Sidebar.Trigger />
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.getByTestId('section')).toBeInTheDocument();
      expect(screen.queryByText('Northwind')).not.toBeInTheDocument();
    });

    it('should apply className to wrapper', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Section className="custom-wrapper">
            <Sidebar.Expanded>
              <div>Content</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      const wrapper = container.querySelector('.custom-wrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Sidebar.Trigger', () => {
    it('should render a button', () => {
      render(
        <Sidebar>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label when expanded', () => {
      render(
        <Sidebar collapsed={false}>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have correct aria-label when collapsed', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Expand sidebar');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle sidebar state when clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Sidebar defaultCollapsed={false}>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const root = container.firstChild as HTMLElement;
      const trigger = screen.getByRole('button');

      expect(root).toHaveAttribute('data-state', 'expanded');
      await user.click(trigger);
      expect(root).toHaveAttribute('data-state', 'collapsed');
    });

    it('should point aria-controls at the sidebar root', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      const root = container.firstChild as HTMLElement;
      const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
      expect(root).not.toHaveAttribute('aria-expanded');
      expect(root.id).not.toBe('');
      expect(trigger).toHaveAttribute('aria-controls', root.id);
    });

    it('should keep a caller id on the root and reference it', () => {
      const { container } = render(
        <Sidebar id="app-sidebar">
          <Sidebar.Trigger />
        </Sidebar>,
      );
      expect(container.firstChild).toHaveAttribute('id', 'app-sidebar');
      expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute(
        'aria-controls',
        'app-sidebar',
      );
    });

    it('should call custom onClick handler', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Sidebar>
          <Sidebar.Trigger onClick={handleClick} />
        </Sidebar>,
      );
      const trigger = screen.getByRole('button');
      await user.click(trigger);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should work with asChild prop', () => {
      render(
        <Sidebar>
          <Sidebar.Trigger asChild>
            <button>Custom Button</button>
          </Sidebar.Trigger>
        </Sidebar>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Custom Button');
      expect(button).toHaveAttribute('aria-label', 'Collapse sidebar');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Sidebar.SectionHeader', () => {
    it('should render its text when expanded', () => {
      render(
        <Sidebar>
          <Sidebar.SectionHeader>Products</Sidebar.SectionHeader>
        </Sidebar>,
      );
      expect(screen.getByText('Products')).not.toHaveClass('sr-only');
    });

    it('should keep its text for screen readers when collapsed', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.SectionHeader>Products</Sidebar.SectionHeader>
        </Sidebar>,
      );
      expect(screen.getByText('Products')).toHaveClass('sr-only');
    });

    it('should name a group through aria-labelledby in both modes', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.SectionHeader id="products">Products</Sidebar.SectionHeader>
          <nav aria-labelledby="products" />
        </Sidebar>,
      );
      expect(screen.getByRole('navigation', { name: 'Products' })).toBeInTheDocument();
    });

    it('should forward ref, className and rest props to the root', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Sidebar>
          <Sidebar.SectionHeader ref={ref} className="custom-class" data-testid="section-header">
            Products
          </Sidebar.SectionHeader>
        </Sidebar>,
      );
      const header = screen.getByTestId('section-header');
      expect(header).toHaveClass('custom-class');
      expect(header).toHaveAttribute('data-slot', 'sidebar-section-header');
      expect(ref.current).toBe(header);
    });
  });

  describe('Focus', () => {
    it('should keep focus on the trigger when toggled from the keyboard', async () => {
      const user = userEvent.setup();
      render(
        <Sidebar>
          <Sidebar.Header>
            <Sidebar.Expanded>
              <span>Northwind</span>
            </Sidebar.Expanded>
            <Sidebar.Trigger />
          </Sidebar.Header>
        </Sidebar>,
      );
      const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
      trigger.focus();

      await user.keyboard('{Enter}');

      expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBe(trigger);
      expect(trigger).toHaveFocus();
    });
  });

  describe('Sidebar compound component', () => {
    it('should update all sections when toggled', async () => {
      const user = userEvent.setup();
      render(
        <Sidebar defaultCollapsed={false}>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Expanded 1</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Collapsed 1</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Expanded 2</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Collapsed 2</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
          <Sidebar.Trigger />
        </Sidebar>,
      );

      expect(screen.getByText('Expanded 1')).toBeInTheDocument();
      expect(screen.getByText('Expanded 2')).toBeInTheDocument();

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(screen.getByText('Collapsed 1')).toBeInTheDocument();
      expect(screen.getByText('Collapsed 2')).toBeInTheDocument();
      expect(screen.queryByText('Expanded 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Expanded 2')).not.toBeInTheDocument();
    });
  });

  // Snapshot Tests
  describe('Sidebar Snapshots', () => {
    it('matches snapshot for a navigation item', () => {
      const { container } = render(
        <Sidebar collapsed={false}>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <Sidebar.Item href="/dashboard" label="Dashboard" active />
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for expanded sidebar', () => {
      const { container } = render(
        <Sidebar collapsed={false}>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Section 1</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for collapsed sidebar', () => {
      const { container } = render(
        <Sidebar collapsed>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Expanded</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Collapsed</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for sidebar with multiple sections', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Section 1</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Section 2</div>
            </Sidebar.Expanded>
            <Sidebar.Collapsed>
              <div>Section 2 Collapsed</div>
            </Sidebar.Collapsed>
          </Sidebar.Section>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <div>Section 3</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
          <Sidebar.Trigger />
        </Sidebar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for sidebar with className', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Section className="custom-wrapper">
            <Sidebar.Expanded>
              <div>Content</div>
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Sidebar.Item', () => {
    it('should render an anchor with icon and label when expanded', () => {
      render(
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <Sidebar.Item
                href="/dashboard"
                icon={() => <svg data-testid="icon" />}
                label="Dashboard"
                active
              />
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      const link = screen.getByRole('link', { name: 'Dashboard' });
      expect(link).toHaveAttribute('href', '/dashboard');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should inject the icon and label into the asChild element', () => {
      // Mimics a router Link: forwards className/props onto the anchor.
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
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Expanded>
              <Sidebar.Item asChild icon={() => <svg data-testid="icon" />} label="Balances">
                <RouterLink to="/balances" />
              </Sidebar.Item>
            </Sidebar.Expanded>
          </Sidebar.Section>
        </Sidebar>,
      );
      const link = screen.getByRole('link', { name: 'Balances' });
      expect(link).toHaveAttribute('data-router-link');
      expect(link).toHaveAttribute('href', '/balances');
      expect(link).toHaveClass('rounded-ws-control-lg');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <Sidebar data-testid="sidebar">
        <Sidebar.Header data-testid="header">
          <Sidebar.Trigger />
        </Sidebar.Header>
        <Sidebar.Section data-testid="section">
          <Sidebar.Expanded>
            <Sidebar.Item href="#" label="Dashboard" />
          </Sidebar.Expanded>
        </Sidebar.Section>
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-slot', 'sidebar');
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'sidebar-header');
    expect(screen.getByTestId('section')).toHaveAttribute('data-slot', 'sidebar-section');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'data-slot',
      'sidebar-item',
    );
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute(
      'data-slot',
      'sidebar-trigger',
    );
  });
});
