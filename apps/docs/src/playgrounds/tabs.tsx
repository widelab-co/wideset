import { RiChat3Line, RiFileList3Line, RiTeamLine } from '@remixicon/react';
import { Tabs } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const TABS = [
  {
    value: 'overview',
    label: 'Overview',
    icon: RiFileList3Line,
    iconName: 'RiFileList3Line',
    count: '',
    text: 'Project summary, milestones and recent activity.',
  },
  {
    value: 'members',
    label: 'Members',
    icon: RiTeamLine,
    iconName: 'RiTeamLine',
    count: '8',
    text: 'Everyone with access to this project.',
  },
  {
    value: 'comments',
    label: 'Comments',
    icon: RiChat3Line,
    iconName: 'RiChat3Line',
    count: '12',
    text: 'Feedback left on designs and documents.',
  },
];

/** Type, size, divider and disabled come from `TabsProps`; icons and counts are content. */
export default playground({
  from: 'TabsProps',
  content: [
    { key: 'icons', label: 'Icons', type: 'switch', default: false },
    { key: 'counts', label: 'Counts', type: 'switch', default: true },
  ],
  render: (v, { props }) => (
    <Tabs {...props()} defaultValue="overview" className="w-[22rem] max-w-full">
      <Tabs.List>
        {TABS.map((tab) => (
          <Tabs.Item key={tab.value} value={tab.value}>
            {v.icons && <Tabs.Icon icon={tab.icon} />}
            <Tabs.Label>{tab.label}</Tabs.Label>
            {v.counts && tab.count && <Tabs.Count>{tab.count}</Tabs.Count>}
          </Tabs.Item>
        ))}
      </Tabs.List>
      {TABS.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="py-ws-8 typography-body-md text-ws-static-subtle"
        >
          {tab.text}
        </Tabs.Content>
      ))}
    </Tabs>
  ),
  code: (v, { attrs }) => {
    const items = TABS.map((tab) => {
      const parts = [
        v.icons ? `      <Tabs.Icon icon={${tab.iconName}} />` : '',
        `      <Tabs.Label>${tab.label}</Tabs.Label>`,
        v.counts && tab.count ? `      <Tabs.Count>${tab.count}</Tabs.Count>` : '',
      ].filter(Boolean);
      return `    <Tabs.Item value="${tab.value}">\n${parts.join('\n')}\n    </Tabs.Item>`;
    }).join('\n');
    const panels = TABS.map(
      (tab) => `  <Tabs.Content value="${tab.value}">${tab.text}</Tabs.Content>`,
    ).join('\n');
    return `<Tabs${attrs()} defaultValue="overview">\n  <Tabs.List>\n${items}\n  </Tabs.List>\n${panels}\n</Tabs>`;
  },
  // The first item carries every part, the count included; the second shows the row.
  anatomy: () => (
    <Tabs defaultValue="comments" className="w-[20rem] max-w-full">
      <Tabs.List>
        <Tabs.Item value="comments">
          <Tabs.Icon icon={RiChat3Line} />
          <Tabs.Label>Comments</Tabs.Label>
          <Tabs.Count>12</Tabs.Count>
        </Tabs.Item>
        <Tabs.Item value="overview">
          <Tabs.Icon icon={RiFileList3Line} />
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Content value="comments" className="py-ws-8 typography-body-md text-ws-static-subtle">
        Three new replies on the launch plan.
      </Tabs.Content>
    </Tabs>
  ),
});
