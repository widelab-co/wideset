import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { Sidebar } from '../sidebar/Sidebar';
import { AppShell } from './AppShell';
import type { AppShellDirection } from './AppShell.types';

const directions: AppShellDirection[] = ['inset', 'flat', 'frame', 'canvas'];

type SidebarProps = React.ComponentProps<typeof Sidebar>;
type TriggerProps = React.ComponentProps<typeof AppShell.SidebarTrigger>;

const renderWithPageBar = ({
  direction,
  sidebar,
  trigger,
}: { direction?: AppShellDirection; sidebar?: SidebarProps; trigger?: TriggerProps } = {}) =>
  render(
    <AppShell direction={direction}>
      <Sidebar id="sidebar" data-testid="sidebar" {...sidebar}>
        <Sidebar.Header>
          <Sidebar.Trigger collapseLabel="Fold navigation" expandLabel="Unfold navigation" />
        </Sidebar.Header>
      </Sidebar>
      <AppShell.Main>
        <AppShell.PageBar>
          <AppShell.SidebarTrigger {...trigger} />
          <span>Projects</span>
          <AppShell.PageBarActions>
            <button type="button">Share</button>
          </AppShell.PageBarActions>
        </AppShell.PageBar>
        <h1>Projects</h1>
      </AppShell.Main>
    </AppShell>,
  );

const barTrigger = (name: string | RegExp = /sidebar/) => screen.getByRole('button', { name });

const renderShell = (direction?: AppShellDirection) =>
  render(
    <AppShell direction={direction} data-testid="shell">
      <Sidebar data-testid="sidebar">
        <Sidebar.Section>
          <Sidebar.Expanded>
            <nav aria-label="Main">
              <Sidebar.Item href="#" label="Projects" active />
            </nav>
          </Sidebar.Expanded>
        </Sidebar.Section>
      </Sidebar>
      <AppShell.Main>
        <h1>Projects</h1>
      </AppShell.Main>
    </AppShell>,
  );

describe('AppShell', () => {
  describe('Rendering', () => {
    it.each(directions)('should match snapshot for direction="%s"', (direction) => {
      const { container } = renderShell(direction);
      expect(container).toMatchSnapshot();
    });

    it('renders the page as the main landmark', () => {
      renderShell();
      expect(screen.getByRole('main')).toContainElement(
        screen.getByRole('heading', { name: 'Projects' }),
      );
    });

    it('marks each part with data-slot', () => {
      renderShell();
      expect(screen.getByTestId('shell')).toHaveAttribute('data-slot', 'app-shell');
      expect(screen.getByRole('main')).toHaveAttribute('data-slot', 'app-shell-main');
    });
  });

  describe('Directions', () => {
    it('defaults to inset', () => {
      renderShell();
      expect(screen.getByTestId('shell')).toHaveAttribute('data-direction', 'inset');
      expect(screen.getByTestId('sidebar')).toHaveClass('bg-transparent');
    });

    it.each(['flat', 'frame'] as const)('lays %s on the white page', (direction) => {
      renderShell(direction);
      expect(screen.getByTestId('shell')).toHaveClass('bg-ws-static-foreground');
    });

    it('shows the grey app frame around a raised page in inset', () => {
      renderShell('inset');
      expect(screen.getByTestId('shell')).toHaveClass('bg-ws-static-background');
      expect(screen.getByRole('main')).toHaveClass(
        'bg-ws-static-foreground',
        'rounded-ws-container-lg',
        'shadow-ws-low',
        'my-ws-7',
        'mr-ws-7',
        'ml-ws-5',
      );
    });

    it('makes the grey the page in canvas, with no card around it', () => {
      renderShell('canvas');
      expect(screen.getByTestId('shell')).toHaveClass('bg-ws-static-background');
      const main = screen.getByRole('main');
      expect(main).not.toHaveClass('bg-ws-static-foreground');
      expect(main).not.toHaveClass('rounded-ws-container-lg');
      expect(main).not.toHaveClass('shadow-ws-low');
    });

    it.each([
      ['flat', 'border-r'],
      ['frame', 'bg-ws-static-alpha-subtle'],
      ['inset', 'bg-transparent'],
      ['canvas', 'bg-transparent'],
    ] as const)('gives the Sidebar the %s surface', (direction, surfaceClass) => {
      renderShell(direction);
      expect(screen.getByTestId('sidebar')).toHaveClass(surfaceClass);
    });

    it('keeps the default page surface for a Sidebar outside a shell', () => {
      render(<Sidebar data-testid="sidebar" />);
      expect(screen.getByTestId('sidebar')).toHaveClass('bg-ws-static-foreground', 'border-r');
    });

    it("lets the Sidebar's surface prop override the direction", () => {
      render(
        <AppShell direction="inset">
          <Sidebar data-testid="sidebar" surface="tinted" />
        </AppShell>,
      );
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('bg-ws-static-alpha-subtle');
      expect(sidebar).not.toHaveClass('bg-transparent');
    });

    it('applies the surface prop to a Sidebar outside a shell', () => {
      render(<Sidebar data-testid="sidebar" surface="frame" />);
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('bg-transparent');
      expect(sidebar).not.toHaveClass('border-r');
    });
  });

  describe('Props', () => {
    it('spreads rest props and merges className on both parts', () => {
      render(
        <AppShell className="h-[20rem]" aria-label="App" data-test="root">
          <AppShell.Main className="p-ws-12" data-test="page" />
        </AppShell>,
      );
      const main = screen.getByRole('main');
      const root = main.parentElement as HTMLElement;
      expect(root).toHaveClass('h-[20rem]', 'flex');
      expect(root).not.toHaveClass('h-dvh');
      expect(root).toHaveAttribute('data-test', 'root');
      expect(main).toHaveClass('p-ws-12', 'flex-1');
      expect(main).toHaveAttribute('data-test', 'page');
    });

    it('throws when AppShell.Main is used outside AppShell', () => {
      expect(() => render(<AppShell.Main />)).toThrow(
        'useAppShellContext must be used within a <AppShell>',
      );
    });
  });

  describe('Page bar', () => {
    describe('Rendering', () => {
      it('should match snapshot with a page bar', () => {
        const { container } = renderWithPageBar();
        expect(container).toMatchSnapshot();
      });

      it('renders the bar as a header inside the main landmark', () => {
        renderWithPageBar();
        const bar = screen.getByRole('main').querySelector('header');
        expect(bar).toHaveAttribute('data-slot', 'app-shell-page-bar');
        expect(bar).toContainElement(barTrigger());
      });

      it('marks the actions and the trigger with data-slot', () => {
        renderWithPageBar();
        expect(barTrigger()).toHaveAttribute('data-slot', 'app-shell-sidebar-trigger');
        expect(screen.getByRole('button', { name: 'Share' }).parentElement).toHaveAttribute(
          'data-slot',
          'app-shell-page-bar-actions',
        );
      });

      it('keeps the bar at the top of the scrolling page, at the text size of the crumbs', () => {
        renderWithPageBar();
        expect(screen.getByRole('main').querySelector('header')).toHaveClass(
          'sticky',
          'top-0',
          'h-ws-18',
          'typography-caption-md',
        );
      });

      it.each([
        ['inset', 'border-ws-static-base'],
        ['flat', 'border-ws-static-subtle'],
        ['frame', 'border-ws-static-subtle'],
      ] as const)('draws the %s line under the bar on the white page', (direction, line) => {
        renderWithPageBar({ direction });
        expect(screen.getByRole('main').querySelector('header')).toHaveClass(
          'bg-ws-static-foreground',
          'border-b',
          line,
        );
      });

      it('leaves the bar on the grey with no line in canvas', () => {
        renderWithPageBar({ direction: 'canvas' });
        const bar = screen.getByRole('main').querySelector('header');
        expect(bar).toHaveClass('bg-ws-static-background');
        expect(bar).not.toHaveClass('border-b');
      });
    });

    describe('Sidebar trigger', () => {
      it('collapses and expands the sidebar', async () => {
        const user = userEvent.setup();
        renderWithPageBar();
        const sidebar = screen.getByTestId('sidebar');
        expect(sidebar).toHaveAttribute('data-state', 'expanded');

        await user.click(barTrigger());
        expect(sidebar).toHaveAttribute('data-state', 'collapsed');

        await user.click(barTrigger());
        expect(sidebar).toHaveAttribute('data-state', 'expanded');
      });

      it('names itself by what it will do and points at the sidebar', async () => {
        const user = userEvent.setup();
        renderWithPageBar();
        const trigger = barTrigger('Collapse sidebar');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-controls', 'sidebar');

        await user.click(trigger);
        expect(trigger).toHaveAccessibleName('Expand sidebar');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });

      it('works from the keyboard', async () => {
        const user = userEvent.setup();
        renderWithPageBar();
        barTrigger().focus();
        await user.keyboard('{Enter}');
        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-state', 'collapsed');
      });

      it('starts from the defaultCollapsed of the sidebar', () => {
        renderWithPageBar({ sidebar: { defaultCollapsed: true } });
        expect(barTrigger('Expand sidebar')).toHaveAttribute('aria-expanded', 'false');
      });

      it('follows the trigger inside the sidebar', async () => {
        const user = userEvent.setup();
        renderWithPageBar();
        await user.click(screen.getByRole('button', { name: 'Fold navigation' }));
        expect(barTrigger('Expand sidebar')).toHaveAttribute('aria-expanded', 'false');
      });

      it('asks a controlled sidebar to change and leaves the state to it', async () => {
        const user = userEvent.setup();
        const onCollapsedChange = vi.fn();
        renderWithPageBar({ sidebar: { collapsed: false, onCollapsedChange } });

        await user.click(barTrigger());
        expect(onCollapsedChange).toHaveBeenCalledExactlyOnceWith(true);
        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-state', 'expanded');
        expect(barTrigger()).toHaveAttribute('aria-expanded', 'true');
      });

      it('toggles a controlled sidebar through its owner', async () => {
        const user = userEvent.setup();
        const Controlled = () => {
          const [collapsed, setCollapsed] = React.useState(true);
          return (
            <AppShell>
              <Sidebar
                data-testid="sidebar"
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
              />
              <AppShell.Main>
                <AppShell.PageBar>
                  <AppShell.SidebarTrigger />
                </AppShell.PageBar>
              </AppShell.Main>
            </AppShell>
          );
        };
        render(<Controlled />);

        await user.click(barTrigger('Expand sidebar'));
        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-state', 'expanded');
        expect(barTrigger('Collapse sidebar')).toHaveAttribute('aria-expanded', 'true');
      });

      it('fires onCollapsedChange in uncontrolled mode too', async () => {
        const user = userEvent.setup();
        const onCollapsedChange = vi.fn();
        renderWithPageBar({ sidebar: { onCollapsedChange } });
        await user.click(barTrigger());
        expect(onCollapsedChange).toHaveBeenCalledExactlyOnceWith(true);
      });

      it('takes its own labels', () => {
        renderWithPageBar({ trigger: { collapseLabel: 'Hide navigation' } });
        expect(barTrigger('Hide navigation')).toBeInTheDocument();
      });

      it('prefers an explicit aria-label', () => {
        renderWithPageBar({ trigger: { 'aria-label': 'Navigation' } });
        expect(barTrigger('Navigation')).toHaveAttribute('aria-expanded', 'true');
      });

      it('does not toggle when onClick prevents the default', async () => {
        const user = userEvent.setup();
        renderWithPageBar({ trigger: { onClick: (event) => event.preventDefault() } });
        await user.click(barTrigger());
        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-state', 'expanded');
      });

      it('is not in the server HTML, where the Sidebar never registers', () => {
        const html = renderToString(
          <AppShell>
            <Sidebar id="sidebar" defaultCollapsed />
            <AppShell.Main>
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>,
        );
        expect(html).toContain('data-slot="sidebar"');
        expect(html).not.toContain('data-slot="app-shell-sidebar-trigger"');
      });

      it('is not in the server HTML of a shell with no Sidebar', () => {
        const html = renderToString(
          <AppShell>
            <AppShell.Main>
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>,
        );
        expect(html).not.toContain('data-slot="app-shell-sidebar-trigger"');
      });

      it('appears after hydration with the state of the Sidebar', async () => {
        const app = (
          <AppShell>
            <Sidebar id="sidebar" defaultCollapsed />
            <AppShell.Main>
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>
        );
        const container = document.createElement('div');
        container.innerHTML = renderToString(app);
        document.body.appendChild(container);
        const onRecoverableError = vi.fn();

        await act(async () => {
          hydrateRoot(container, app, { onRecoverableError });
        });

        const trigger = screen.getByRole('button', { name: 'Expand sidebar' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-controls', 'sidebar');
        expect(onRecoverableError).not.toHaveBeenCalled();
        container.remove();
      });

      it('renders nothing in a shell with no Sidebar', () => {
        render(
          <AppShell>
            <AppShell.Main>
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>,
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });

      it('forgets a sidebar that unmounts', () => {
        const Shell = ({ withSidebar }: { withSidebar: boolean }) => (
          <AppShell>
            {withSidebar && <Sidebar id="sidebar" defaultCollapsed />}
            <AppShell.Main>
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>
        );
        const { rerender } = render(<Shell withSidebar />);
        expect(barTrigger()).toHaveAttribute('aria-controls', 'sidebar');

        rerender(<Shell withSidebar={false} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });

      it('keeps the sidebar when a second one unmounts', () => {
        const Shell = ({ withSubNav }: { withSubNav: boolean }) => (
          <AppShell>
            <Sidebar id="sidebar" />
            <AppShell.Main>
              {withSubNav && <Sidebar id="sub-nav" />}
              <AppShell.SidebarTrigger />
            </AppShell.Main>
          </AppShell>
        );
        const { rerender } = render(<Shell withSubNav />);
        expect(barTrigger()).toHaveAttribute('aria-controls', 'sidebar');

        rerender(<Shell withSubNav={false} />);
        expect(barTrigger()).toHaveAttribute('aria-controls', 'sidebar');
      });

      it('presses without motion when the sidebar turns motion off', () => {
        renderWithPageBar({ sidebar: { defaultMotion: false } });
        expect(barTrigger().className).not.toMatch(/scale-/);
      });

      it('lets its own defaultMotion win over the sidebar', () => {
        renderWithPageBar({ sidebar: { defaultMotion: false }, trigger: { defaultMotion: true } });
        expect(barTrigger(/Collapse sidebar/).className).toMatch(/scale-/);
      });
    });

    describe('Props', () => {
      it('spreads rest props and merges className on the bar and its actions', () => {
        render(
          <AppShell>
            <AppShell.Main>
              <AppShell.PageBar className="px-ws-12" aria-label="Page" data-test="bar">
                <AppShell.PageBarActions className="gap-ws-3" data-test="actions" />
              </AppShell.PageBar>
            </AppShell.Main>
          </AppShell>,
        );
        const bar = screen.getByLabelText('Page');
        expect(bar).toHaveClass('px-ws-12', 'sticky');
        expect(bar).not.toHaveClass('px-ws-11');
        expect(bar).toHaveAttribute('data-test', 'bar');
        const actions = bar.firstElementChild as HTMLElement;
        expect(actions).toHaveClass('gap-ws-3', 'ml-auto');
        expect(actions).toHaveAttribute('data-test', 'actions');
      });

      it('spreads rest props and merges className on the trigger', () => {
        renderWithPageBar({
          trigger: { className: 'ml-ws-0', disabled: true, 'data-test': 'toggle' } as TriggerProps,
        });
        const trigger = barTrigger();
        expect(trigger).toHaveClass('ml-ws-0', 'shrink-0');
        expect(trigger).not.toHaveClass('-ml-ws-5');
        expect(trigger).toBeDisabled();
        expect(trigger).toHaveAttribute('data-test', 'toggle');
      });

      it.each([
        ['AppShell.PageBar', <AppShell.PageBar key="bar" />],
        ['AppShell.SidebarTrigger', <AppShell.SidebarTrigger key="trigger" />],
      ])('throws when %s is used outside AppShell', (_, part) => {
        expect(() => render(part)).toThrow('useAppShellContext must be used within a <AppShell>');
      });
    });
  });
});
