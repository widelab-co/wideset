import { RiFolderLine, RiFolderOpenLine } from '@remixicon/react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TreeView } from './TreeView';
import type { TreeViewProps } from './TreeView.types';

const Files = (props: Partial<TreeViewProps>) => (
  <TreeView aria-label="Files" {...props}>
    <TreeView.Item value="src">
      <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} data-testid="src-icon" />
      <TreeView.Label>src</TreeView.Label>
      <TreeView.Suffix>2</TreeView.Suffix>
      <TreeView.Group>
        <TreeView.Item value="src/app.tsx">
          <TreeView.Label>app.tsx</TreeView.Label>
        </TreeView.Item>
        <TreeView.Item value="src/main.tsx">
          <TreeView.Label>main.tsx</TreeView.Label>
        </TreeView.Item>
      </TreeView.Group>
    </TreeView.Item>
    <TreeView.Item value="package.json">
      <TreeView.Label>package.json</TreeView.Label>
    </TreeView.Item>
    <TreeView.Item value="private" disabled>
      <TreeView.Label>private</TreeView.Label>
      <TreeView.Group>
        <TreeView.Item value="private/keys.json">
          <TreeView.Label>keys.json</TreeView.Label>
        </TreeView.Item>
      </TreeView.Group>
    </TreeView.Item>
    <TreeView.Item value="README.md">
      <TreeView.Label>README.md</TreeView.Label>
    </TreeView.Item>
  </TreeView>
);

const item = (name: string) => screen.getByRole('treeitem', { name });

describe('TreeView', () => {
  describe('Rendering', () => {
    // First in the file, so the ids React generates in it do not depend on the tests above it.
    it('matches the snapshot', () => {
      const { container } = render(<Files defaultExpanded={['src']} defaultValue="src/app.tsx" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders a named tree', () => {
      render(<Files />);
      expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    });

    it('names each item by its label alone, not the items in its group', () => {
      render(<Files defaultExpanded={['src']} />);
      expect(item('src')).toBeInTheDocument();
    });

    it("points the description at the suffix's own id when it has one", () => {
      render(
        <TreeView aria-label="Files">
          <TreeView.Item value="src">
            <TreeView.Label>src</TreeView.Label>
            <TreeView.Suffix id="src-count">2</TreeView.Suffix>
          </TreeView.Item>
        </TreeView>,
      );
      expect(item('src')).toHaveAttribute('aria-describedby', 'src-count');
      expect(item('src')).toHaveAccessibleDescription('2');
    });

    it('reads the suffix as the description, after the name', () => {
      render(<Files />);
      expect(item('src')).toHaveAccessibleDescription('2');
      expect(item('package.json')).not.toHaveAttribute('aria-describedby');
    });

    it('marks a branch with aria-expanded and a leaf with aria-selected', () => {
      render(<Files />);
      expect(item('src')).toHaveAttribute('aria-expanded', 'false');
      expect(item('src')).not.toHaveAttribute('aria-selected');
      expect(item('package.json')).toHaveAttribute('aria-selected', 'false');
    });

    it('sets aria-level by depth', () => {
      render(<Files defaultExpanded={['src']} />);
      expect(item('src')).toHaveAttribute('aria-level', '1');
      expect(item('app.tsx')).toHaveAttribute('aria-level', '2');
    });

    it('renders no group while its item is shut', () => {
      render(<Files />);
      expect(screen.queryByRole('treeitem', { name: 'app.tsx' })).not.toBeInTheDocument();
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
    });

    it('sets data-slot on every part', () => {
      const { container } = render(<Files defaultExpanded={['src']} />);
      for (const slot of [
        'tree-view',
        'tree-view-item',
        'tree-view-item-row',
        'tree-view-item-chevron',
        'tree-view-icon',
        'tree-view-label',
        'tree-view-suffix',
        'tree-view-group',
      ])
        expect(container.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument();
    });

    it('swaps to expandedIcon while the group is open', async () => {
      render(<Files />);
      const shut = screen.getByTestId('src-icon').innerHTML;
      await userEvent.click(screen.getByText('src'));
      expect(screen.getByTestId('src-icon').innerHTML).not.toBe(shut);
    });

    it('truncates a long label on one line', () => {
      const name = 'quarterly-revenue-reconciliation-for-the-finance-team.md';
      render(
        <TreeView aria-label="Files">
          <TreeView.Item value="long">
            <TreeView.Label>{name}</TreeView.Label>
          </TreeView.Item>
        </TreeView>,
      );
      expect(screen.getByText(name)).toHaveClass('truncate', 'min-w-0');
    });
  });

  describe('Props', () => {
    it('merges className and passes rest props to the root', () => {
      render(<Files className="custom" data-testid="tree" aria-describedby="hint" />);
      const tree = screen.getByTestId('tree');
      expect(tree).toHaveClass('flex', 'custom');
      expect(tree).toHaveAttribute('aria-describedby', 'hint');
    });

    it('passes rest props to an item', () => {
      render(
        <TreeView aria-label="Files">
          <TreeView.Item value="a" className="custom" data-testid="a">
            <TreeView.Label>a</TreeView.Label>
          </TreeView.Item>
        </TreeView>,
      );
      expect(screen.getByTestId('a')).toHaveClass('custom');
    });

    it('throws when an item is used outside a TreeView', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        expect(() => render(<TreeView.Item value="a" />)).toThrow(
          'useTreeViewContext must be used within a <TreeView>',
        );
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('Interaction', () => {
    it('folds a branch open and shut on click', async () => {
      const onExpandedChange = vi.fn();
      render(<Files onExpandedChange={onExpandedChange} />);
      await userEvent.click(screen.getByText('src'));
      expect(item('src')).toHaveAttribute('aria-expanded', 'true');
      expect(onExpandedChange).toHaveBeenLastCalledWith(['src']);
      await userEvent.click(screen.getByText('src'));
      expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    });

    it('selects a leaf on click', async () => {
      const onValueChange = vi.fn();
      render(<Files onValueChange={onValueChange} />);
      await userEvent.click(screen.getByText('package.json'));
      expect(item('package.json')).toHaveAttribute('aria-selected', 'true');
      expect(onValueChange).toHaveBeenCalledWith('package.json');
    });

    it('keeps the controlled value and still fires onValueChange', async () => {
      const onValueChange = vi.fn();
      render(<Files value="README.md" onValueChange={onValueChange} />);
      await userEvent.click(screen.getByText('package.json'));
      expect(onValueChange).toHaveBeenCalledWith('package.json');
      expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
      expect(item('package.json')).toHaveAttribute('aria-selected', 'false');
    });

    it('keeps the controlled expanded and still fires onExpandedChange', async () => {
      const onExpandedChange = vi.fn();
      render(<Files expanded={[]} onExpandedChange={onExpandedChange} />);
      await userEvent.click(screen.getByText('src'));
      expect(onExpandedChange).toHaveBeenCalledWith(['src']);
      expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not fold a disabled branch', async () => {
      const onExpandedChange = vi.fn();
      render(<Files onExpandedChange={onExpandedChange} />);
      await userEvent.click(screen.getByText('private'));
      expect(item('private')).toHaveAttribute('aria-expanded', 'false');
      expect(item('private')).toHaveAttribute('aria-disabled', 'true');
      expect(onExpandedChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard', () => {
    it('has one tab stop, on the first item when nothing is selected', async () => {
      render(<Files />);
      await userEvent.tab();
      expect(item('src')).toHaveFocus();
      expect(screen.getAllByRole('treeitem').filter((el) => el.tabIndex === 0)).toHaveLength(1);
    });

    it('puts the tab stop on the selected item', async () => {
      render(<Files defaultValue="README.md" />);
      await userEvent.tab();
      expect(item('README.md')).toHaveFocus();
    });

    it('gives the tab stop back to the selected item when its folder opens again', async () => {
      const { rerender } = render(<Files expanded={['src']} value="src/app.tsx" />);
      rerender(<Files expanded={[]} value="src/app.tsx" />);
      expect(item('src')).toHaveAttribute('tabindex', '0');
      rerender(<Files expanded={['src']} value="src/app.tsx" />);
      expect(item('app.tsx')).toHaveAttribute('tabindex', '0');
      expect(item('src')).toHaveAttribute('tabindex', '-1');
    });

    it('drops the focused item when the selection changes, even back to an old one', async () => {
      const { rerender } = render(<Files value="README.md" />);
      await userEvent.tab();
      await userEvent.keyboard('{Home}');
      expect(item('src')).toHaveFocus();
      rerender(<Files value="package.json" />);
      rerender(<Files value="README.md" />);
      expect(item('README.md')).toHaveAttribute('tabindex', '0');
    });

    it('gives the tab stop back to the selected item when the focused one goes', async () => {
      const { rerender } = render(<Files expanded={['src']} value="README.md" />);
      await userEvent.tab();
      await userEvent.keyboard('{Home}{ArrowDown}');
      expect(item('app.tsx')).toHaveFocus();
      rerender(<Files expanded={[]} value="README.md" />);
      expect(item('README.md')).toHaveAttribute('tabindex', '0');
    });

    it('moves the tab stop on when a stateful child removes the focused item', async () => {
      let removeChangelog = () => {};
      const Rest = () => {
        const [shown, setShown] = useState(true);
        removeChangelog = () => setShown(false);
        return shown ? (
          <TreeView.Item value="CHANGELOG.md">
            <TreeView.Label>CHANGELOG.md</TreeView.Label>
          </TreeView.Item>
        ) : null;
      };
      render(
        <TreeView aria-label="Files">
          <TreeView.Item value="README.md">
            <TreeView.Label>README.md</TreeView.Label>
          </TreeView.Item>
          <Rest />
        </TreeView>,
      );
      await userEvent.tab();
      await userEvent.keyboard('{End}');
      expect(item('CHANGELOG.md')).toHaveFocus();
      act(() => removeChangelog());
      expect(item('README.md')).toHaveAttribute('tabindex', '0');
    });

    it('types ahead with a letter typed through Option or AltGr', async () => {
      render(
        <TreeView aria-label="Cities">
          <TreeView.Item value="gdansk">
            <TreeView.Label>Gdańsk</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item value="lodz">
            <TreeView.Label>Łódź</TreeView.Label>
          </TreeView.Item>
        </TreeView>,
      );
      await userEvent.tab();
      await userEvent.keyboard('{Alt>}ł{/Alt}');
      expect(item('Łódź')).toHaveFocus();
    });

    it('gives the tab stop to an item selected from outside', async () => {
      const { rerender } = render(<Files value="" />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('package.json')).toHaveFocus();
      rerender(<Files value="README.md" />);
      expect(item('README.md')).toHaveAttribute('tabindex', '0');
      expect(item('package.json')).toHaveAttribute('tabindex', '-1');
    });

    it('moves with ArrowDown and ArrowUp', async () => {
      render(<Files />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('package.json')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(item('src')).toHaveFocus();
    });

    it('opens with ArrowRight, then moves into the group', async () => {
      render(<Files />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');
      expect(item('src')).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{ArrowRight}');
      expect(item('app.tsx')).toHaveFocus();
    });

    it('moves to the parent with ArrowLeft, then shuts it', async () => {
      render(<Files defaultExpanded={['src']} defaultValue="src/main.tsx" />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('src')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps the focus on an open branch whose group is empty', async () => {
      render(
        <TreeView aria-label="Files" defaultExpanded={['empty']}>
          <TreeView.Item value="empty">
            <TreeView.Label>empty</TreeView.Label>
            <TreeView.Group />
          </TreeView.Item>
          <TreeView.Item value="next">
            <TreeView.Label>next</TreeView.Label>
          </TreeView.Item>
        </TreeView>,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');
      expect(item('empty')).toHaveFocus();
    });

    it('leaves Alt, Ctrl and Cmd chords to the browser', async () => {
      render(<Files defaultExpanded={['src']} defaultValue="src/app.tsx" />);
      await userEvent.tab();
      await userEvent.keyboard('{Alt>}{ArrowLeft}{/Alt}');
      expect(item('app.tsx')).toHaveFocus();
    });

    it('jumps with Home and End', async () => {
      render(<Files />);
      await userEvent.tab();
      await userEvent.keyboard('{End}');
      expect(item('README.md')).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(item('src')).toHaveFocus();
    });

    it('selects a leaf with Enter and folds a branch with Space', async () => {
      const onValueChange = vi.fn();
      render(<Files onValueChange={onValueChange} />);
      await userEvent.tab();
      await userEvent.keyboard(' ');
      expect(item('src')).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard('{End}{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('README.md');
    });

    it('types ahead to the next item starting with the letter', async () => {
      render(<Files />);
      await userEvent.tab();
      await userEvent.keyboard('r');
      expect(item('README.md')).toHaveFocus();
    });

    it('moves the tab stop to the first item when its own item is folded away', async () => {
      const { rerender } = render(<Files expanded={['src']} defaultValue="src/app.tsx" />);
      rerender(<Files expanded={[]} defaultValue="src/app.tsx" />);
      await userEvent.tab();
      expect(item('src')).toHaveFocus();
    });

    it('moves from an item in a disabled open branch to the branch, which stays open', async () => {
      render(<Files defaultExpanded={['private']} />);
      await userEvent.tab();
      await userEvent.keyboard('{End}{ArrowUp}');
      expect(item('keys.json')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('private')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}{Enter}');
      expect(item('private')).toHaveFocus();
      expect(item('private')).toHaveAttribute('aria-expanded', 'true');
    });

    it('moves from a nested disabled open branch to its parent', async () => {
      render(
        <TreeView aria-label="Files" defaultExpanded={['src', 'src/vendor']}>
          <TreeView.Item value="src">
            <TreeView.Label>src</TreeView.Label>
            <TreeView.Group>
              <TreeView.Item value="src/vendor" disabled>
                <TreeView.Label>vendor</TreeView.Label>
                <TreeView.Group>
                  <TreeView.Item value="src/vendor/lib.js">
                    <TreeView.Label>lib.js</TreeView.Label>
                  </TreeView.Item>
                </TreeView.Group>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
        </TreeView>,
      );
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('vendor')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('src')).toHaveFocus();
      expect(item('vendor')).toHaveAttribute('aria-expanded', 'true');
    });

    it('does not select a disabled leaf by Enter, Space or click', async () => {
      const onValueChange = vi.fn();
      render(
        <TreeView aria-label="Files" onValueChange={onValueChange}>
          <TreeView.Item value="archive.md" disabled>
            <TreeView.Label>archive.md</TreeView.Label>
          </TreeView.Item>
        </TreeView>,
      );
      await userEvent.tab();
      await userEvent.keyboard('{Enter} ');
      await userEvent.click(screen.getByText('archive.md'));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(item('archive.md')).toHaveAttribute('aria-selected', 'false');
    });
  });
});
