/**
 * A selected file, a disabled file and folder, and a long name. A disabled item stays in the
 * keyboard order, so screen reader users still learn it exists, but it neither selects nor folds.
 * A long name ends in an ellipsis on one line; keep the full name in a tooltip or the page title.
 */
import {
  RiBracesLine,
  RiFileTextLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiMarkdownLine,
} from '@remixicon/react';
import { TreeView } from '@wideset/react';

export default function TreeViewStates() {
  return (
    <TreeView
      aria-label="Documents"
      defaultExpanded={['docs']}
      defaultValue="docs/onboarding.md"
      className="w-[18rem] max-w-full"
    >
      <TreeView.Item value="docs">
        <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
        <TreeView.Label>docs</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="docs/onboarding.md">
            <TreeView.Icon icon={RiMarkdownLine} />
            <TreeView.Label>onboarding.md</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item value="docs/archive.md" disabled>
            <TreeView.Icon icon={RiMarkdownLine} />
            <TreeView.Label>archive.md</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item value="docs/quarterly-revenue-reconciliation.md">
            <TreeView.Icon icon={RiFileTextLine} />
            <TreeView.Label>
              quarterly-revenue-reconciliation-for-the-finance-team.md
            </TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item value="private" disabled>
        <TreeView.Icon icon={RiFolderLine} />
        <TreeView.Label>private</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="private/keys.json">
            <TreeView.Icon icon={RiBracesLine} />
            <TreeView.Label>keys.json</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
    </TreeView>
  );
}
