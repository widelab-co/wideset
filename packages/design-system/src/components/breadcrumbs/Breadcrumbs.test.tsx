import { RiAlertFill, RiCalendarLine, RiInformationFill } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  describe('Rendering', () => {
    it('should render breadcrumbs with items', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    });

    it('should render with aria-label on nav', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('should render icons inside items', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>
            <RiAlertFill data-testid="warning-icon" />
            <span>Page 1</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <RiInformationFill data-testid="info-icon" />
            <span>Page 2</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <RiCalendarLine data-testid="calendar-icon" />
            <span>Page 3</span>
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });

    it('should render a link when asChild is used', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item asChild>
            <a href="/">
              <RiAlertFill data-testid="warning-icon" /> <span>Page 1</span>
            </a>
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByRole('link', { name: /Page 1/ })).toHaveAttribute('href', '/');
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    });

    it('should render custom divider content when children are provided', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Divider data-testid="custom-divider">-</Breadcrumbs.Divider>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByTestId('custom-divider')).toBeInTheDocument();
      expect(screen.getByTestId('custom-divider')).toHaveTextContent('-');
    });

    it('should not render BreadcrumbsDivider when neither separator nor children are provided', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Divider data-testid="empty-divider" />
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.queryByTestId('empty-divider')).not.toBeInTheDocument();
    });

    it('should render children instead of separator icon in BreadcrumbsDivider', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Divider separator="arrow" data-testid="divider">
            |
          </Breadcrumbs.Divider>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const divider = screen.getByTestId('divider');
      expect(divider).toHaveTextContent('|');
      expect(divider.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Separators', () => {
    it('should render one arrow divider between items when separator is arrow', () => {
      const { container } = render(
        <Breadcrumbs separator="arrow">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const dividers = container.querySelectorAll('div');
      expect(dividers.length).toEqual(1);
      expect(dividers[0].querySelector('svg')).toBeInTheDocument();
    });

    it('should render slash dividers between items when separator is slash', () => {
      const { container } = render(
        <Breadcrumbs separator="slash">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const dividers = container.querySelectorAll('div');
      expect(dividers.length).toEqual(2);
      Array.from(dividers).forEach((div) => expect(div).toHaveTextContent('/'));
    });

    it('should not render auto separators when separator is not set', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(container.querySelectorAll('div').length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should render items inside an ordered list', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const list = container.querySelector('nav > ol');
      expect(list).toBeInTheDocument();
      expect(screen.getByRole('list')).toBe(list);
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should hide separators from the list semantics', () => {
      render(
        <Breadcrumbs separator="arrow">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should set aria-disabled on the last item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const buttons = screen.getAllByRole('button');
      const lastButton = buttons[buttons.length - 1];
      expect(lastButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should set aria-current="page" on the last item only', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[buttons.length - 1]).toHaveAttribute('aria-current', 'page');
      buttons.slice(0, -1).forEach((btn) => expect(btn).not.toHaveAttribute('aria-current'));
    });

    it('should set tabIndex=-1 on the last disabled item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('tabindex', '0');
      expect(buttons[buttons.length - 1]).toHaveAttribute('tabindex', '-1');
    });

    it('should handle single item as current and disabled', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Only page</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      const button = screen.getByRole('button', { name: 'Only page' });
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-current', 'page');
      expect(button).toHaveAttribute('tabindex', '-1');
      expect(container.querySelectorAll('div').length).toBe(0);
    });

    it('treats crumbs in nested fragments as individual list items', () => {
      render(
        <Breadcrumbs separator="slash">
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
          <>
            <Breadcrumbs.Item>Account</Breadcrumbs.Item>
            <>
              <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
              <Breadcrumbs.Item>Billing</Breadcrumbs.Item>
            </>
          </>
        </Breadcrumbs>,
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(screen.getAllByText('/')).toHaveLength(3);
      expect(screen.getByRole('button', { current: 'page' })).toHaveAccessibleName('Billing');
    });
  });

  describe('Props forwarding', () => {
    it('should forward className to the nav element', () => {
      render(
        <Breadcrumbs className="custom-class">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass('custom-class');
    });

    it('should forward data attributes to the nav element', () => {
      render(
        <Breadcrumbs data-testid="breadcrumbs-root">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByTestId('breadcrumbs-root')).toBeInTheDocument();
    });

    it('should render BreadcrumbsItem with type="button"', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      screen.getAllByRole('button').forEach((btn) => expect(btn).toHaveAttribute('type', 'button'));
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for breadcrumbs with slash separator', () => {
      const { container } = render(
        <Breadcrumbs separator="slash">
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for composable breadcrumbs', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Divider>/</Breadcrumbs.Divider>
          <Breadcrumbs.Item>Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Divider>/</Breadcrumbs.Divider>
          <Breadcrumbs.Item>Page 3</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      const { container } = render(
        <Breadcrumbs separator="arrow">
          <Breadcrumbs.Item>Projects</Breadcrumbs.Item>
          <Breadcrumbs.Item>Wideset</Breadcrumbs.Item>
        </Breadcrumbs>,
      );

      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveAttribute(
        'data-slot',
        'breadcrumbs',
      );
      const slots = [...container.querySelectorAll('[data-slot]')].map((el) =>
        el.getAttribute('data-slot'),
      );
      expect(slots).toEqual([
        'breadcrumbs',
        'breadcrumbs-item',
        'breadcrumbs-divider',
        'breadcrumbs-item',
      ]);
    });
  });
});
