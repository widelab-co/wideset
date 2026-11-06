import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ListItem } from '../list-item/ListItem';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  describe('Basic rendering', () => {
    it('renders dropdown trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });
      expect(trigger).toBeInTheDocument();
    });

    it('renders dropdown content when opened', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <ListItem.Label>Item 2</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Item 1')).toBeInTheDocument();
          expect(screen.getByText('Item 2')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('applies custom className to trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild className="custom-trigger">
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('applies custom className to content', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="custom-content">
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(
        () => {
          const content = screen.getByText('Item 1').closest('[role="menu"]');
          expect(content).toHaveClass('custom-content');
        },
        { timeout: 3000 },
      );
    });
  });

  describe('DropdownMenu Snapshots', () => {
    async function openDropdownAndGetMenu(ui: ReactElement) {
      const user = userEvent.setup();
      render(ui);
      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);
      await waitFor(
        () => {
          expect(screen.getByRole('menu')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
      return screen.getByRole('menu');
    }

    it('matches snapshot for basic dropdown', async () => {
      const menu = await openDropdownAndGetMenu(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <ListItem.Label>Item 2</ListItem.Label>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <ListItem.Label>Item 3</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(menu).toMatchSnapshot();
    });

    it('matches snapshot for dropdown with separator', async () => {
      const menu = await openDropdownAndGetMenu(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <ListItem.Label>Item 2</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(menu).toMatchSnapshot();
    });

    it('matches snapshot for dropdown with label', async () => {
      const menu = await openDropdownAndGetMenu(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>Group 1</DropdownMenu.Label>
            <DropdownMenu.Item>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(menu).toMatchSnapshot();
    });

    it('matches snapshot for dropdown with danger variant item', async () => {
      const menu = await openDropdownAndGetMenu(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item variant="danger">
              <ListItem.Label>Danger Item</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(menu).toMatchSnapshot();
    });

    it('matches snapshot for dropdown with disabled item', async () => {
      const menu = await openDropdownAndGetMenu(
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button>Open</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item disabled>
              <ListItem.Label>Disabled Item</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(menu).toMatchSnapshot();
    });
  });

  describe('Rest props', () => {
    it('forwards data-* and aria-* attributes to trigger, content, and item', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
          <DropdownMenu.Content data-testid="content" aria-label="Account actions">
            <DropdownMenu.Item data-testid="item">
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(
        () => {
          const content = screen.getByTestId('content');
          expect(content).toHaveAttribute('aria-label', 'Account actions');
          expect(screen.getByTestId('item')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Compound object', () => {
    it('does not attach sub-components to the shared Radix Root', () => {
      expect('Content' in DropdownMenuPrimitive.Root).toBe(false);
    });
  });

  describe('Portal', () => {
    it('renders the content in document.body by default, outside the trigger subtree', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content data-testid="content">
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      const content = await screen.findByTestId('content');
      expect(container).not.toContainElement(content);
      expect(document.body).toContainElement(content);
    });

    it('renders the content in portalContainer when provided', async () => {
      const user = userEvent.setup();
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content portalContainer={portalContainer}>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(portalContainer).toContainElement(await screen.findByRole('menu'));
      portalContainer.remove();
    });

    it('keeps forceMount content mounted while the menu is closed', () => {
      render(
        <DropdownMenu open={false}>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content data-testid="content" forceMount>
            <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'closed');
    });

    it('renders into the container of an enclosing DropdownMenu.Portal', () => {
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
      render(
        <DropdownMenu open>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Portal container={portalContainer}>
            <DropdownMenu.Content data-testid="content">
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>,
      );
      expect(portalContainer).toContainElement(screen.getByTestId('content'));
      portalContainer.remove();
    });

    it('keeps content mounted while closed when DropdownMenu.Portal has forceMount', () => {
      render(
        <DropdownMenu open={false}>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content data-testid="content">
              <DropdownMenu.Item>Item 1</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>,
      );
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'closed');
    });

    it('still portals a menu nested inside content placed in a DropdownMenu.Portal', () => {
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);
      render(
        <DropdownMenu open modal={false}>
          <DropdownMenu.Trigger>Outer</DropdownMenu.Trigger>
          <DropdownMenu.Portal container={portalContainer}>
            <DropdownMenu.Content data-testid="outer">
              <DropdownMenu open modal={false}>
                <DropdownMenu.Trigger>Inner</DropdownMenu.Trigger>
                <DropdownMenu.Content data-testid="inner">
                  <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>,
      );
      expect(portalContainer).toContainElement(screen.getByTestId('outer'));
      expect(portalContainer).not.toContainElement(screen.getByTestId('inner'));
      expect(document.body).toContainElement(screen.getByTestId('inner'));
      portalContainer.remove();
    });
  });

  describe('Keyboard interaction', () => {
    it('opens with Enter, navigates with ArrowDown, and closes with Escape', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item data-testid="item-1">
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
            <DropdownMenu.Item data-testid="item-2">
              <ListItem.Label>Item 2</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(
        () => {
          expect(screen.getByRole('menu')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-highlighted');

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-highlighted');

      await user.keyboard('{Escape}');
      await waitFor(
        () => {
          expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Selection', () => {
    it('fires onSelect when an item is activated', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={handleSelect}>
              <ListItem.Label>Item 1</ListItem.Label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(
        () => {
          expect(screen.getByRole('menu')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await user.click(screen.getByText('Item 1'));
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });
  });

  // Figma's Dropdown Menu draws these parts as Menu Item rows (Single Select, Divider) on the
  // menu surface; they used to render as bare Radix parts.
  describe('Figma parts', () => {
    const renderMenu = () =>
      render(
        <DropdownMenu open modal={false}>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="name">
              <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="date">Date</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Separator />
            <DropdownMenu.Sub open>
              <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent data-testid="sub-content">
                <DropdownMenu.Item>Copy link</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

    it('draws radio items as menu rows', () => {
      renderMenu();

      expect(screen.getByRole('menuitemradio', { name: 'Date' })).toHaveClass(
        'min-h-ws-14',
        'px-ws-5',
        'py-ws-3',
        'rounded-ws-control-md',
      );
    });

    it('checks only the selected radio item', () => {
      renderMenu();

      const selected = screen.getByRole('menuitemradio', { name: 'Name' });
      expect(selected).toHaveAttribute('data-state', 'checked');
      expect(selected.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByRole('menuitemradio', { name: 'Date' }).querySelector('svg')).toBeNull();
    });

    it('draws the sub trigger as a menu row with a chevron', () => {
      renderMenu();

      const trigger = screen.getByRole('menuitem', { name: 'Share' });
      expect(trigger).toHaveClass('min-h-ws-14', 'px-ws-5', 'py-ws-3', 'rounded-ws-control-md');
      expect(trigger.querySelector('[data-slot="list-item-suffix"] svg')).toBeInTheDocument();
    });

    it('keeps the sub trigger filled while its submenu is open', () => {
      renderMenu();

      const trigger = screen.getByRole('menuitem', { name: 'Share' });
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(trigger).toHaveClass('data-[state=open]:bg-ws-dynamic-secondary-alpha-hover');
    });

    it('gives the submenu the menu surface', () => {
      renderMenu();

      expect(screen.getByTestId('sub-content')).toHaveClass(
        'min-w-ws-28',
        'rounded-ws-container-sm',
        'p-ws-3',
        'bg-ws-static-overlay',
        'shadow-ws-medium',
        'z-ws-popout',
      );
    });

    it('keeps the separator row at 12px, as Figma draws it', () => {
      renderMenu();

      // 5.5px + the 1px border + 5.5px; `my-ws-4` made it 13px.
      expect(screen.getByRole('separator')).toHaveClass('my-[5.5px]', 'border-t');
    });
  });

  // A 23-item menu in a 360px-tall window opened with its top ~500px above the window: the surface
  // had no height cap and no scroll region.
  describe('Window height', () => {
    it('caps the menu and its submenu at the room left in the window and scrolls the rest', () => {
      render(
        <DropdownMenu open modal={false}>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Sub open>
              <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu>,
      );

      const menus = screen.getAllByRole('menu');
      expect(menus).toHaveLength(2);
      for (const menu of menus) {
        expect(menu).toHaveClass(
          'max-h-[var(--radix-dropdown-menu-content-available-height)]',
          'overflow-y-auto',
        );
      }
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Label</DropdownMenu.Label>
          <DropdownMenu.Group>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
            <DropdownMenu.CheckboxItem checked>
              Checkbox
              <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup value="a">
            <DropdownMenu.RadioItem value="a">Radio</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
    expect(screen.getByRole('menu')).toHaveAttribute('data-slot', 'dropdown-menu-content');
    expect(screen.getByText('Label')).toHaveAttribute('data-slot', 'dropdown-menu-label');
    expect(slot('dropdown-menu-group')).toHaveAttribute('role', 'group');
    expect(screen.getByRole('menuitem', { name: 'Item' })).toHaveAttribute(
      'data-slot',
      'dropdown-menu-item',
    );
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-checkbox-item',
    );
    expect(screen.getByText('✓')).toHaveAttribute('data-slot', 'dropdown-menu-item-indicator');
    expect(slot('dropdown-menu-separator')).toHaveAttribute('role', 'separator');
    expect(slot('dropdown-menu-radio-group')).toContainElement(screen.getByRole('menuitemradio'));
    expect(screen.getByRole('menuitemradio')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-radio-item',
    );
    expect(screen.getByRole('menuitem', { name: 'More' })).toHaveAttribute(
      'data-slot',
      'dropdown-menu-sub-trigger',
    );
  });
});
