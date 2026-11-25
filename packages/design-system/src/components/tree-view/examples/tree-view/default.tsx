/** The playground's stage: a repository's folders and files, its props set from the rail. */
import {
  RiBracesLine,
  RiCodeSSlashLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiMarkdownLine,
} from '@remixicon/react';
import { TreeView, type TreeViewProps } from '@wideset/react';

export default function TreeViewDefault(props: Partial<TreeViewProps>) {
  return (
    <TreeView
      aria-label="Files"
      defaultExpanded={['src', 'src/features']}
      defaultValue="src/features/bookings-table.tsx"
      className="w-[18rem] max-w-full"
      {...props}
    >
      <TreeView.Item value="src">
        <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
        <TreeView.Label>src</TreeView.Label>
        <TreeView.Suffix>3</TreeView.Suffix>
        <TreeView.Group>
          <TreeView.Item value="src/features">
            <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
            <TreeView.Label>features</TreeView.Label>
            <TreeView.Group>
              <TreeView.Item value="src/features/bookings-table.tsx">
                <TreeView.Icon icon={RiCodeSSlashLine} />
                <TreeView.Label>bookings-table.tsx</TreeView.Label>
              </TreeView.Item>
              <TreeView.Item value="src/features/bookings-toolbar.tsx">
                <TreeView.Icon icon={RiCodeSSlashLine} />
                <TreeView.Label>bookings-toolbar.tsx</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item value="src/main.tsx">
            <TreeView.Icon icon={RiCodeSSlashLine} />
            <TreeView.Label>main.tsx</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item value="package.json">
        <TreeView.Icon icon={RiBracesLine} />
        <TreeView.Label>package.json</TreeView.Label>
      </TreeView.Item>
      <TreeView.Item value="README.md">
        <TreeView.Icon icon={RiMarkdownLine} />
        <TreeView.Label>README.md</TreeView.Label>
      </TreeView.Item>
    </TreeView>
  );
}
