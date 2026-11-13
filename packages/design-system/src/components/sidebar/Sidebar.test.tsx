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

      // Figma's Sidebar: the page's white with a subtle line on its right edge.
      it("is Figma's default: white, with a subtle line on its right edge", () => {
        const { container } = render(
          <Sidebar>
            <div>Test content</div>
          </Sidebar>,
        );
        const root = container.querySelector('[data-slot="sidebar"]');
        expect(root).toHaveClass('bg-ws-static-foreground', 'border-r', 'border-ws-static-subtle');
      });
    });

    describe('Sidebar.Item suffix and Sidebar.Footer', () => {
      const renderNav = (collapsed = false) =>
        render(
          <Sidebar collapsed={collapsed}>
            <Sidebar.Section>
              <Sidebar.Item href="#" label="Inbox" suffix="3" />
            </Sidebar.Section>
            <Sidebar.Footer data-testid="footer">Account</Sidebar.Footer>
          </Sidebar>,
        );

      it('puts the suffix on the row edge, after a label that takes the rest', () => {
        renderNav();
        const suffix = screen.getByText('3');
        expect(suffix).toHaveAttribute('data-slot', 'sidebar-item-suffix');
        expect(suffix).toHaveClass('shrink-0', 'text-ws-static-subtle');
        expect(screen.getByText('Inbox')).toHaveClass('flex-1', 'truncate');
      });

      it('shows a shortcut only on hover or keyboard focus with suffixOnHover', () => {
        render(
          <Sidebar>
            <Sidebar.Section>
              <Sidebar.Item href="#" label="Inbox" suffix="⌘1" suffixOnHover />
              <Sidebar.Item href="#" label="Drafts" suffix="3" />
            </Sidebar.Section>
          </Sidebar>,
        );
        expect(screen.getByText('⌘1')).toHaveClass(
          'opacity-0',
          'group-hover/sidebar-item:opacity-100',
          'group-focus-visible/sidebar-item:opacity-100',
        );
        expect(screen.getByText('3')).not.toHaveClass('opacity-0');
      });

      it('hides the suffix when collapsed', () => {
        renderNav(true);
        expect(screen.queryByText('3')).not.toBeInTheDocument();
      });

      it('pins the footer to the bottom with the section inset', () => {
        renderNav();
        const footer = screen.getByTestId('footer');
        expect(footer).toHaveAttribute('data-slot', 'sidebar-footer');
        expect(footer).toHaveClass('mt-auto', 'w-full', 'shrink-0');
      });

      // A tree once came out with a hand-drawn guide line; Figma's Level 1 is indent only.
      const renderNested = (collapsed = false) =>
        render(
          <Sidebar collapsed={collapsed}>
            <Sidebar.Section>
              <Sidebar.Item href="#" label="Important" nested />
            </Sidebar.Section>
          </Sidebar>,
        );

      it('indents a nested item so its icon starts under the parent label', () => {
        renderNested();
        expect(screen.getByRole('link', { name: 'Important' })).toHaveClass(
          'pl-[calc(var(--spacing-ws-5)*2+var(--spacing-ws-10))]',
        );
      });

      it('lines a nested item up with the rest when collapsed', () => {
        renderNested(true);
        expect(screen.getByRole('link', { name: 'Important' }).className).not.toMatch(/pl-\[/);
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
    // A collapsed rail once centred its items 5px left of the trigger: the scroll gutter stayed.
    it('keeps a collapsed scrollable section on the rail centre line, with no bar gutter', () => {
      const nav = (collapsed: boolean) => (
        <Sidebar collapsed={collapsed}>
          <Sidebar.Section scrollable>
            <Sidebar.Item href="#" label="Inbox" />
          </Sidebar.Section>
        </Sidebar>
      );
      const { container, rerender } = render(nav(true));
      const viewport = () => container.querySelector('[data-slot="scroll-area-viewport"]');
      expect(viewport()).not.toHaveClass('pr-ws-6');
      rerender(nav(false));
      expect(viewport()).toHaveClass('pr-ws-6');
    });

    it('centres a collapsed header and footer on the same line', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Header data-testid="header">Mark</Sidebar.Header>
          <Sidebar.Footer data-testid="footer">Account</Sidebar.Footer>
        </Sidebar>,
      );
      expect(screen.getByTestId('header')).toHaveClass('flex', 'flex-col', 'items-center');
      expect(screen.getByTestId('footer')).toHaveClass('flex', 'flex-col', 'items-center');
    });

    it('leaves an expanded header and footer as plain blocks', () => {
      render(
        <Sidebar collapsed={false}>
          <Sidebar.Header data-testid="header">Mark</Sidebar.Header>
          <Sidebar.Footer data-testid="footer">Account</Sidebar.Footer>
        </Sidebar>,
      );
      expect(screen.getByTestId('header')).not.toHaveClass('items-center');
      expect(screen.getByTestId('footer')).not.toHaveClass('items-center');
    });

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

    // Figma's collapsed rail shows the heading cut short ("P…"), not an empty gap.
    it('should keep its text visible and cut short when collapsed', () => {
      render(
        <Sidebar collapsed>
          <Sidebar.SectionHeader>Products</Sidebar.SectionHeader>
        </Sidebar>,
      );
      const text = screen.getByText('Products');
      expect(text).not.toHaveClass('sr-only');
      expect(text).toHaveClass('truncate');
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

describe('Sidebar.Group', () => {
  const renderFamily = ({
    collapsed = false,
    groupProps = {},
    triggerProps = {},
  }: {
    collapsed?: boolean;
    groupProps?: React.ComponentProps<typeof Sidebar.Group>;
    triggerProps?: React.ComponentProps<typeof Sidebar.GroupTrigger>;
  } = {}) =>
    render(
      <Sidebar collapsed={collapsed}>
        <Sidebar.Section>
          <Sidebar.Group data-testid="group" {...groupProps}>
            <Sidebar.Item href="/button" label="Button" />
            <Sidebar.GroupTrigger
              expandLabel="Show Button components"
              collapseLabel="Hide Button components"
              {...triggerProps}
            />
            <Sidebar.GroupContent data-testid="content">
              <Sidebar.Item href="/icon-button" label="Icon Button" nested />
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Section>
      </Sidebar>,
    );

  const renderSection = ({
    collapsed = false,
    groupProps = {},
  }: {
    collapsed?: boolean;
    groupProps?: React.ComponentProps<typeof Sidebar.Group>;
  } = {}) =>
    render(
      <Sidebar collapsed={collapsed}>
        <Sidebar.Section>
          <Sidebar.Group {...groupProps}>
            <Sidebar.SectionHeader collapsible>Spaces</Sidebar.SectionHeader>
            <Sidebar.GroupContent data-testid="content">
              <Sidebar.Item href="/design" label="Design" />
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Section>
      </Sidebar>,
    );

  describe('Rendering', () => {
    it('starts closed, its rows hidden', () => {
      renderFamily();
      expect(screen.getByTestId('content')).not.toBeVisible();
      expect(screen.getByTestId('content')).toHaveClass('hidden');
    });

    it('starts open with defaultOpen', () => {
      renderFamily({ groupProps: { defaultOpen: true } });
      expect(screen.getByRole('link', { name: 'Icon Button' })).toBeVisible();
    });

    it('keeps the head a link, with the chevron a button beside it, not inside it', () => {
      renderFamily();
      const link = screen.getByRole('link', { name: 'Button' });
      const toggle = screen.getByRole('button', { name: 'Show Button components' });
      expect(link).not.toContainElement(toggle);
      expect(toggle.parentElement).toBe(link.parentElement);
    });

    it('leaves the chevron its room on the head row', () => {
      renderFamily();
      expect(screen.getByTestId('group')).toHaveClass('[&>[data-slot=sidebar-item]]:pr-ws-14');
    });

    it('turns the chevron down when open', () => {
      renderFamily({ groupProps: { defaultOpen: true } });
      const icon = screen.getByRole('button', { name: 'Hide Button components' }).firstChild;
      expect(icon).toHaveClass('rotate-90', 'transition-transform');
    });

    it('drops the chevron transition with defaultMotion={false}', () => {
      renderFamily({ groupProps: { defaultMotion: false } });
      const icon = screen.getByRole('button', { name: 'Show Button components' }).firstChild;
      expect(icon).not.toHaveClass('transition-transform');
    });

    it('marks every part with data-slot and data-state', () => {
      renderFamily();
      expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'sidebar-group');
      expect(screen.getByTestId('group')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'sidebar-group-content');
      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'sidebar-group-trigger');
    });

    it('passes rest props and className to the DOM', () => {
      renderFamily({
        groupProps: { className: 'custom-group', 'aria-label': 'Button family' },
        triggerProps: { className: 'custom-trigger', title: 'Button components' },
      });
      expect(screen.getByTestId('group')).toHaveClass('custom-group');
      expect(screen.getByTestId('group')).toHaveAttribute('aria-label', 'Button family');
      expect(screen.getByRole('button')).toHaveClass('custom-trigger');
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Button components');
    });

    it('matches snapshot', () => {
      const { container } = renderFamily({ groupProps: { defaultOpen: true } });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for a collapsible section', () => {
      const { container } = renderSection({ groupProps: { defaultOpen: true } });
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Accessibility', () => {
    it('ties the chevron to the rows with aria-expanded and aria-controls', () => {
      renderFamily();
      const toggle = screen.getByRole('button', { name: 'Show Button components' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveAttribute('aria-controls', screen.getByTestId('content').id);
    });

    it('takes aria-label over the state labels', () => {
      renderFamily({ triggerProps: { 'aria-label': 'Button components' } });
      expect(screen.getByRole('button', { name: 'Button components' })).toBeInTheDocument();
    });

    it('defaults the chevron names', async () => {
      render(
        <Sidebar>
          <Sidebar.Group>
            <Sidebar.Item href="#" label="Reports" />
            <Sidebar.GroupTrigger />
            <Sidebar.GroupContent />
          </Sidebar.Group>
        </Sidebar>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Expand group' }));
      expect(screen.getByRole('button', { name: 'Collapse group' })).toBeInTheDocument();
    });

    it('toggles from the keyboard', async () => {
      renderFamily();
      await userEvent.tab();
      expect(screen.getByRole('link', { name: 'Button' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Show Button components' })).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('link', { name: 'Icon Button' })).toBeVisible();
      await userEvent.keyboard(' ');
      expect(screen.getByTestId('content')).not.toBeVisible();
    });

    it('throws outside a Sidebar.Group', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(
          <Sidebar>
            <Sidebar.GroupTrigger />
          </Sidebar>,
        ),
      ).toThrow('useSidebarGroupContext must be used within a <Sidebar.Group>');
      vi.restoreAllMocks();
    });
  });

  describe('Uncontrolled mode', () => {
    it('opens and closes on click, firing onOpenChange', async () => {
      const onOpenChange = vi.fn();
      renderFamily({ groupProps: { onOpenChange } });
      await userEvent.click(screen.getByRole('button', { name: 'Show Button components' }));
      expect(screen.getByRole('link', { name: 'Icon Button' })).toBeVisible();
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      await userEvent.click(screen.getByRole('button', { name: 'Hide Button components' }));
      expect(screen.getByTestId('content')).not.toBeVisible();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('does not toggle when the click handler prevents default', async () => {
      renderFamily({ triggerProps: { onClick: (e) => e.preventDefault() } });
      await userEvent.click(screen.getByRole('button', { name: 'Show Button components' }));
      expect(screen.getByTestId('content')).not.toBeVisible();
    });
  });

  describe('Controlled mode', () => {
    it('follows open and only asks to change it', async () => {
      const onOpenChange = vi.fn();
      renderFamily({ groupProps: { open: false, onOpenChange } });
      await userEvent.click(screen.getByRole('button', { name: 'Show Button components' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('content')).not.toBeVisible();
    });

    it('opens when open is true', () => {
      renderFamily({ groupProps: { open: true } });
      expect(screen.getByRole('link', { name: 'Icon Button' })).toBeVisible();
    });
  });

  describe('Collapsed sidebar', () => {
    it('hides the chevron and the members of an item group, open or not', () => {
      renderFamily({ collapsed: true, groupProps: { defaultOpen: true } });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByTestId('content')).not.toBeVisible();
      expect(screen.getByRole('link', { name: 'Button' })).toBeVisible();
    });

    it('does not pad the head for a chevron it does not show', () => {
      renderFamily({ collapsed: true });
      expect(screen.getByTestId('group')).not.toHaveClass('[&>[data-slot=sidebar-item]]:pr-ws-14');
    });

    it('keeps a collapsible section working: the chevron alone, named by its title', async () => {
      renderSection({ collapsed: true, groupProps: { defaultOpen: true } });
      expect(screen.getByText('Spaces')).toHaveClass('sr-only');
      expect(screen.getByRole('link', { name: 'Design' })).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Spaces' }));
      expect(screen.getByTestId('content')).not.toBeVisible();
    });
  });
});

describe('Sidebar.SectionHeader collapsible', () => {
  const renderHeader = (defaultOpen = false) =>
    render(
      <Sidebar>
        <Sidebar.Group defaultOpen={defaultOpen}>
          <Sidebar.SectionHeader collapsible data-testid="header">
            Spaces
          </Sidebar.SectionHeader>
          <Sidebar.GroupContent data-testid="content">
            <Sidebar.Item href="#" label="Design" />
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar>,
    );

  it('is a button named by its title, with the chevron before it', () => {
    renderHeader();
    const toggle = screen.getByRole('button', { name: 'Spaces' });
    expect(toggle.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', screen.getByTestId('content').id);
  });

  it('folds the group on click', async () => {
    renderHeader(true);
    await userEvent.click(screen.getByRole('button', { name: 'Spaces' }));
    expect(screen.getByRole('button', { name: 'Spaces' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByTestId('content')).not.toBeVisible();
  });

  it("is Figma's Folder row: 48px, the row's padding on its button", () => {
    renderHeader();
    expect(screen.getByTestId('header')).toHaveClass('h-ws-18');
    expect(screen.getByRole('button', { name: 'Spaces' })).toHaveClass('p-ws-5', 'gap-ws-3');
  });

  it('stays a plain heading without collapsible', () => {
    render(
      <Sidebar>
        <Sidebar.SectionHeader>Products</Sidebar.SectionHeader>
      </Sidebar>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('throws when collapsible outside a Sidebar.Group', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Sidebar>
          <Sidebar.SectionHeader collapsible>Spaces</Sidebar.SectionHeader>
        </Sidebar>,
      ),
    ).toThrow('useSidebarGroupContext must be used within a <Sidebar.Group>');
    vi.restoreAllMocks();
  });
});
