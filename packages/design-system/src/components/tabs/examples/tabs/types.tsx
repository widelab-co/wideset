/**
 * Regular underlines the active tab and fits the tabs to their labels, with the divider running
 * the full width; it is the default for sections of a page. Full width shares the width evenly,
 * for two to four tabs in a narrow panel. Pills have no outline and fill the active tab with the
 * neutral selected tint, for a compact switcher. Ghost has no border: a soft background slides
 * to the active tab, for cards and toolbars. Pills and ghost ignore `divider`.
 */
import { Tabs } from '@wideset/react';

export default function TabsTypes() {
  return (
    <div className="gap-ws-16 flex w-[24rem] max-w-full flex-col">
      {(['regular', 'fullWidth', 'pills', 'ghost'] as const).map((type) => (
        <Tabs key={type} type={type} defaultValue="overview">
          <Tabs.List>
            <Tabs.Item value="overview">
              <Tabs.Label>Overview</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="members">
              <Tabs.Label>Members</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="comments">
              <Tabs.Label>Comments</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>
      ))}
    </div>
  );
}
