import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sidebar } from '../sidebar/Sidebar';
import { AppShell } from './AppShell';
import type { AppShellDirection } from './AppShell.types';

const directions: AppShellDirection[] = ['inset', 'flat', 'frame', 'canvas'];

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
});
