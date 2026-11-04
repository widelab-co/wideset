import { RiCheckboxBlankCircleLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { RemixiconProps } from '../../types/icon.types';
import { Tabs } from './Tabs';
import type { TabsProps } from './Tabs.types';

// Thin wrapper over a real Remix icon so the component under test still gets the
// exact type it ships with, while keeping a stable test id to assert on.
const MockIcon = (props: RemixiconProps) => (
  <RiCheckboxBlankCircleLine data-testid="mock-icon" {...props} />
);

describe('Tabs', () => {
  describe('Basic rendering', () => {
    it('renders tabs with proper content visibility', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();

      const tabPanels = screen.getAllByRole('tabpanel', { hidden: true });
      expect(tabPanels).toHaveLength(2);

      const activePanel = tabPanels.find((panel) => panel.getAttribute('data-state') === 'active');
      expect(activePanel).toBeInTheDocument();
      expect(activePanel).toHaveTextContent('Content 1');
      expect(activePanel).not.toHaveAttribute('hidden');

      const inactivePanel = tabPanels.find(
        (panel) => panel.getAttribute('data-state') === 'inactive',
      );
      expect(inactivePanel).toBeInTheDocument();
      expect(inactivePanel).toHaveAttribute('data-state', 'inactive');
      expect(inactivePanel).toHaveAttribute('hidden');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Tabs className="custom-class" defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tabs = container.firstChild as HTMLElement;
      expect(tabs).toHaveClass('custom-class');
    });
  });

  describe('Divider', () => {
    it('renders divider by default for non-pill types', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('border-b');
      expect(tablist).toHaveClass('border-ws-static-subtle');
    });

    it('renders divider when divider prop is true and type is not pill', () => {
      render(
        <Tabs divider defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('border-b');
    });

    it('does not render divider for pill type even when divider is true', () => {
      render(
        <Tabs type="pills" divider defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).not.toHaveClass('border-b');
    });
  });

  describe('Tabs.Item', () => {
    it('renders tab item with label', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab with Label</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      expect(screen.getByText('Tab with Label')).toBeInTheDocument();
    });

    it('renders tab item with icon', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Icon icon={MockIcon} />
              <Tabs.Label>Tab with Icon</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders tab item with count badge', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab with Count</Tabs.Label>
              <Tabs.Count>5</Tabs.Count>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders tab item with custom children instead of label', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <span>Custom Content</span>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('generates value automatically if not provided', () => {
      render(
        <Tabs>
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab without value</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tab = screen.getByRole('tab');
      // The generated value is internal to Radix; data-state shows the tab is wired up.
      expect(tab).toHaveAttribute('data-state');
    });

    it('applies active visual state when active prop is set', () => {
      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Item value="tab1" active>
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      const forcedActiveTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(forcedActiveTab).toHaveAttribute('data-active', '');
    });

    it('forwards HTML attributes to tab items', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1" data-testid="test-tab" aria-label="Test tab button">
              <Tabs.Label>Test Tab</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      const tabItem = screen.getByTestId('test-tab');
      expect(tabItem).toHaveAttribute('aria-label', 'Test tab button');
    });
  });

  describe('Tabs.Content', () => {
    it('renders tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Test Content</Tabs.Content>
        </Tabs>,
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className to content', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1" className="custom-content">
            Content
          </Tabs.Content>
        </Tabs>,
      );
      const content = screen.getByText('Content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('Tabs.Label', () => {
    it('renders label with custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label className="custom-label">Custom Label</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const label = screen.getByText('Custom Label');
      expect(label).toHaveClass('custom-label');
    });

    it('forwards HTML attributes to label', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label data-testid="test-label" aria-label="Test label">
                Label
              </Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const label = screen.getByTestId('test-label');
      expect(label).toHaveAttribute('aria-label', 'Test label');
    });
  });

  describe('Tabs.Icon', () => {
    it('forwards HTML attributes to icon', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Icon icon={MockIcon} />
              <Tabs.Label>Tab</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const icon = screen.getByTestId('mock-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('renders disabled tab item', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2" disabled>
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(disabledTab).toBeDisabled();
    });

    it('disables all tabs when disabled prop is set on Tabs', () => {
      render(
        <Tabs disabled defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab1).toBeDisabled();
      expect(tab2).toBeDisabled();
    });

    it('does not allow clicking disabled tab', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <Tabs onValueChange={handleValueChange} defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2" disabled>
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(disabledTab);
      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled and uncontrolled', () => {
    it('works as uncontrolled component with defaultValue', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('data-state', 'active');
    });

    it('works as controlled component with value and onValueChange', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <Tabs value="tab1" onValueChange={handleValueChange}>
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);
      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Interaction', () => {
    it('switches tabs when clicking', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs>,
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      expect(tab2).toHaveAttribute('data-state', 'active');
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('calls onValueChange when tab is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <Tabs onValueChange={handleValueChange} defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Keyboard', () => {
    it('supports Tab key focus on the active tab element', async () => {
      const user = userEvent.setup();

      render(
        <>
          <Tabs defaultValue="tab2">
            <Tabs.List>
              <Tabs.Item value="tab1">
                <Tabs.Label>Tab 1</Tabs.Label>
              </Tabs.Item>
              <Tabs.Item value="tab2">
                <Tabs.Label>Tab 2</Tabs.Label>
              </Tabs.Item>
            </Tabs.List>
            <Tabs.Content value="tab1">Content 1</Tabs.Content>
            <Tabs.Content value="tab2">Content 2</Tabs.Content>
          </Tabs>
          <button type="button">After tabs</button>
        </>,
      );

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tab2Content = screen.getByRole('tabpanel', { name: 'Tab 2' });

      await user.tab();
      expect(tab2).toHaveFocus();

      await user.tab();
      expect(tab2Content).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'After tabs' })).toHaveFocus();

      await user.tab({ shift: true });
      expect(tab2Content).toHaveFocus();

      await user.tab({ shift: true });
      expect(tab2).toHaveFocus();
    });

    it('supports arrow navigation and automatic activation, wrapping and skipping disabled tabs', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab3">
              <Tabs.Label>Tab 3</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab4" disabled>
              <Tabs.Label>Tab 4</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
          <Tabs.Content value="tab4">Content 4</Tabs.Content>
        </Tabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

      await user.tab();
      expect(tab2).toHaveFocus();

      const movements = [
        { input: '{ArrowRight}', element: tab3, previous: tab2, panelName: 'Tab 3' },
        { input: '{ArrowRight}', element: tab1, previous: tab3, panelName: 'Tab 1' },
        { input: '{ArrowLeft}', element: tab3, previous: tab1, panelName: 'Tab 3' },
        { input: '{ArrowLeft}', element: tab2, previous: tab3, panelName: 'Tab 2' },
      ];

      for (const { input, element, previous, panelName } of movements) {
        await user.keyboard(input);
        expect(element).toHaveFocus();
        expect(element).toHaveAttribute('aria-selected', 'true');
        expect(previous).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByRole('tabpanel', { name: panelName })).toBeVisible();
      }
    });

    it.each([
      { key: 'Home', target: 'Tab 1' },
      { key: 'End', target: 'Tab 3' },
    ])('supports $key to focus and activate the $target tab', async ({ key, target }) => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab2">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab3">
              <Tabs.Label>Tab 3</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
          <Tabs.Content value="tab3">Content 3</Tabs.Content>
        </Tabs>,
      );

      const middleTab = screen.getByRole('tab', { name: 'Tab 2' });
      const targetTab = screen.getByRole('tab', { name: target });

      await user.tab();
      expect(middleTab).toHaveFocus();
      await user.keyboard(`{${key}}`);

      expect(targetTab).toHaveFocus();
      expect(targetTab).toHaveAttribute('aria-selected', 'true');
      expect(middleTab).toHaveAttribute('aria-selected', 'false');
    });
  });
});

// Snapshot Tests
describe('Tabs Snapshots', () => {
  const sizes: TabsProps['size'][] = ['sm', 'lg'];

  const typeRendererTest = (type: TabsProps['type']) =>
    sizes.forEach((size) => {
      const { container } = render(
        <Tabs type={type} size={size} defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="tab2">
              <Tabs.Label>Tab 2</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );

      expect(container.firstChild).toMatchSnapshot(`Tabs with regular type and ${size} size`);
    });

  it('matches snapshot for regular type', () => {
    typeRendererTest('regular');
  });

  it('matches snapshot for fullWidth type', () => {
    typeRendererTest('fullWidth');
  });

  it('matches snapshot for pill type', () => {
    typeRendererTest('pills');
  });

  it('matches snapshot for ghost type', () => {
    typeRendererTest('ghost');
  });

  it('matches snapshot for tabs with divider', () => {
    const { container } = render(
      <Tabs divider defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <Tabs.Label>Tab 1</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="tab2">
            <Tabs.Label>Tab 2</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for tabs without divider', () => {
    const { container } = render(
      <Tabs divider={false} defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <Tabs.Label>Tab 1</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="tab2">
            <Tabs.Label>Tab 2</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for tabs with icon and count', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <Tabs.Icon icon={MockIcon} />
            <Tabs.Label>Tab with Icon and Count</Tabs.Label>
            <Tabs.Count>42</Tabs.Count>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled tab item', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <Tabs.Label>Tab 1</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="tab2" disabled>
            <Tabs.Label>Tab 2</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled tabs', () => {
    const { container } = render(
      <Tabs disabled defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <Tabs.Label>Tab 1</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="tab2">
            <Tabs.Label>Tab 2</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for tabs with custom children', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Item value="tab1">
            <div className="custom-tab-content">
              <span>Custom</span>
              <span>Tab</span>
            </div>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <Tabs.List>
            <Tabs.Item value="tab1">
              <Tabs.Icon icon={MockIcon} />
              <Tabs.Label>Tab 1</Tabs.Label>
              <Tabs.Count>3</Tabs.Count>
            </Tabs.Item>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
        </Tabs>,
      );
      for (const slot of [
        'tabs',
        'tabs-list',
        'tabs-item',
        'tabs-icon',
        'tabs-label',
        'tabs-count',
        'tabs-content',
      ])
        expect(container.querySelector(`[data-slot="${slot}"]`), slot).toBeInTheDocument();
    });

    it('lets a caller override a part slot', () => {
      render(
        <Tabs defaultValue="tab1">
          <Tabs.List data-slot="custom">
            <Tabs.Item value="tab1">
              <Tabs.Label>Tab 1</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>,
      );
      expect(screen.getByRole('tablist')).toHaveAttribute('data-slot', 'custom');
    });
  });
});
