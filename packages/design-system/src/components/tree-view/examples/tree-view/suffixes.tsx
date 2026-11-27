/**
 * `TreeView.Suffix` holds a short trailing fact: how many items a folder holds, or a file's git
 * status. Screen readers hear it after the name ("Campaigns, 2"). A letter or a dot says nothing
 * by itself, so pair it with visually hidden text that names the state.
 */
import { RiCodeSSlashLine, RiFileTextLine, RiFolderLine, RiFolderOpenLine } from '@remixicon/react';
import { TreeView } from '@wideset/react';

export default function TreeViewSuffixes() {
  return (
    <div className="gap-ws-12 flex flex-wrap">
      <TreeView
        aria-label="Workspace"
        defaultExpanded={['marketing']}
        className="w-[16rem] max-w-full"
      >
        <TreeView.Item value="marketing">
          <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
          <TreeView.Label>Marketing</TreeView.Label>
          <TreeView.Suffix>3</TreeView.Suffix>
          <TreeView.Group>
            <TreeView.Item value="marketing/campaigns">
              <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
              <TreeView.Label>Campaigns</TreeView.Label>
              <TreeView.Suffix>2</TreeView.Suffix>
              <TreeView.Group>
                <TreeView.Item value="marketing/campaigns/spring">
                  <TreeView.Icon icon={RiFileTextLine} />
                  <TreeView.Label>Spring launch</TreeView.Label>
                </TreeView.Item>
                <TreeView.Item value="marketing/campaigns/black-friday">
                  <TreeView.Icon icon={RiFileTextLine} />
                  <TreeView.Label>Black Friday</TreeView.Label>
                </TreeView.Item>
              </TreeView.Group>
            </TreeView.Item>
            <TreeView.Item value="marketing/brand-guide">
              <TreeView.Icon icon={RiFileTextLine} />
              <TreeView.Label>Brand guide</TreeView.Label>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView>
      <TreeView
        aria-label="Changed files"
        defaultExpanded={['bookings']}
        className="w-[16rem] max-w-full"
      >
        <TreeView.Item value="bookings">
          <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
          <TreeView.Label>bookings</TreeView.Label>
          <TreeView.Suffix>
            <span className="bg-ws-semantic-inverse-info size-ws-4 rounded-ws-control-full" />
            <span className="sr-only">has changes</span>
          </TreeView.Suffix>
          <TreeView.Group>
            <TreeView.Item value="bookings/export-csv.ts">
              <TreeView.Icon icon={RiCodeSSlashLine} />
              <TreeView.Label>export-csv.ts</TreeView.Label>
              <TreeView.Suffix className="text-ws-semantic-positive typography-caption-strong-md">
                <span aria-hidden="true">A</span>
                <span className="sr-only">added</span>
              </TreeView.Suffix>
            </TreeView.Item>
            <TreeView.Item value="bookings/bookings-table.tsx">
              <TreeView.Icon icon={RiCodeSSlashLine} />
              <TreeView.Label>bookings-table.tsx</TreeView.Label>
              <TreeView.Suffix className="text-ws-semantic-info typography-caption-strong-md">
                <span aria-hidden="true">M</span>
                <span className="sr-only">modified</span>
              </TreeView.Suffix>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView>
    </div>
  );
}
