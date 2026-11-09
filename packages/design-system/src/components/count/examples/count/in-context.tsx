/**
 * A count sits right after its label and is read with it ("Members 8"), so the label gives it
 * meaning and the count stays a plain grey number. Cap long numbers ("99+"). A count says how
 * many, never what state: a state is a `StatusBadge`, a category a `Tag`.
 */
import { Count, Tabs } from '@wideset/react';

export default function CountInContext() {
  return (
    <div className="gap-ws-12 flex w-[24rem] max-w-full flex-col">
      <Tabs defaultValue="members">
        <Tabs.List>
          <Tabs.Item value="overview">
            <Tabs.Label>Overview</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="members">
            <Tabs.Label>Members</Tabs.Label>
            <Tabs.Count>8</Tabs.Count>
          </Tabs.Item>
          <Tabs.Item value="comments">
            <Tabs.Label>Comments</Tabs.Label>
            <Tabs.Count>120</Tabs.Count>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>
      <div className="gap-ws-4 flex flex-col">
        <h3 className="gap-ws-4 typography-label-strong-md text-ws-static-strong flex items-center">
          Active
          <Count>3</Count>
        </h3>
        <h3 className="gap-ws-4 typography-label-strong-md text-ws-static-strong flex items-center">
          Archived
          <Count>99+</Count>
        </h3>
      </div>
    </div>
  );
}
