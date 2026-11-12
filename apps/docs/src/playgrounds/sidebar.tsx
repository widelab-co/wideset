import {
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiBox3Line,
  RiDashboardLine,
  RiFolder3Line,
  RiUser3Line,
  RiWallet3Line,
} from '@remixicon/react';
import { Avatar, IconButton, ProgressBar, Sidebar } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const NAV = [
  { label: 'Dashboard', Icon: RiDashboardLine, icon: 'RiDashboardLine' },
  { label: 'Projects', Icon: RiFolder3Line, icon: 'RiFolder3Line' },
  { label: 'Customers', Icon: RiUser3Line, icon: 'RiUser3Line' },
];

const nav = (v: Values) => (
  <nav className="flex flex-col gap-ws-2">
    {NAV.map(({ label, Icon }) => (
      <Sidebar.Item key={label} href="#" icon={Icon} label={label} active={v.active === label} />
    ))}
  </nav>
);

const navCode = (v: Values, indent: string) =>
  [
    `${indent}<nav className="flex flex-col gap-ws-2">`,
    ...NAV.map(
      ({ label, icon }) =>
        `${indent}  <Sidebar.Item href="#" icon={${icon}} label="${label}"${v.active === label ? ' active' : ''} />`,
    ),
    `${indent}</nav>`,
  ].join('\n');

const FULL_NAV = [
  { label: 'Dashboard', Icon: RiDashboardLine },
  { label: 'Balances', Icon: RiWallet3Line },
  { label: 'Transactions', Icon: RiArrowLeftRightLine },
  { label: 'Customers', Icon: RiUser3Line },
  { label: 'Products', Icon: RiBox3Line },
];

/**
 * Collapsed comes from `SidebarProps`. The stage maps it to `defaultCollapsed`, which is read
 * once, so the stage remounts when the switch flips and the trigger keeps working; a
 * controlled `collapsed` would freeze the trigger without an `onCollapsedChange`.
 */
export default playground({
  from: 'SidebarProps',
  content: [
    {
      key: 'active',
      label: 'Current page',
      type: 'select',
      options: NAV.map(({ label }) => ({ label, value: label })),
      default: 'Dashboard',
    },
    { key: 'header', label: 'Header', type: 'switch', default: true },
  ],
  render: (v) => (
    <div className="flex h-[16rem] w-[22rem] max-w-full overflow-hidden rounded-ws-control-lg border border-ws-static-base bg-ws-static-background">
      <Sidebar key={String(v.collapsed)} defaultCollapsed={Boolean(v.collapsed)}>
        {v.header && (
          <Sidebar.Header>
            <div className="flex items-center gap-ws-7 py-ws-3">
              <Sidebar.Expanded>
                <span className="pl-ws-5 typography-label-strong-sm text-ws-static-strong">
                  Northwind
                </span>
              </Sidebar.Expanded>
              <Sidebar.Trigger />
            </div>
          </Sidebar.Header>
        )}
        <Sidebar.Section>{nav(v)}</Sidebar.Section>
      </Sidebar>
      <div className="min-w-0 flex-1 p-ws-9 typography-label-strong-sm text-ws-static-strong">
        {String(v.active)}
      </div>
    </div>
  ),
  code: (v) => {
    const header = v.header
      ? `  <Sidebar.Header>
    <div className="flex items-center gap-ws-7 py-ws-3">
      <Sidebar.Expanded>
        <span className="pl-ws-5 typography-label-strong-sm text-ws-static-strong">Northwind</span>
      </Sidebar.Expanded>
      <Sidebar.Trigger />
    </div>
  </Sidebar.Header>
`
      : '';
    return `<Sidebar${v.collapsed ? ' defaultCollapsed' : ''}>
${header}  <Sidebar.Section>
${navCode(v, '    ')}
  </Sidebar.Section>
</Sidebar>`;
  },
  // Parts the picture cannot draw. Each renders its children only in its own state, with no element of its own.
  absent: {
    SidebarExpanded: 'Only when expanded',
    SidebarCollapsed: 'Only when collapsed',
  },
  // Expanded and Collapsed render no element of their own, so the picture cannot point at them.
  anatomy: () => (
    <div className="flex h-[16rem] overflow-hidden rounded-ws-control-lg border border-ws-static-base bg-ws-static-background">
      <Sidebar>
        <Sidebar.Header>
          <div className="flex items-center gap-ws-7 py-ws-3">
            <span className="pl-ws-5 typography-label-strong-sm text-ws-static-strong">
              Northwind
            </span>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Header>
        <Sidebar.Section>
          <nav className="flex flex-col gap-ws-2">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
            <Sidebar.Item href="#" icon={RiFolder3Line} label="Projects" />
            <Sidebar.SectionHeader>People</Sidebar.SectionHeader>
            <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
          </nav>
        </Sidebar.Section>
      </Sidebar>
    </div>
  ),
  // The gallery card shows a whole app sidebar, built like the Storybook "Full" story.
  preview: () => (
    <div className="flex h-[27rem] overflow-hidden rounded-ws-container-lg border border-ws-static-base bg-ws-static-background shadow-ws-high">
      <div className="flex">
        <Sidebar>
          <Sidebar.Section>
            <div className="flex items-center rounded-ws-control-lg border border-ws-dynamic-secondary-default bg-ws-static-highlight-base px-ws-7 py-ws-5 shadow-ws-forms-base">
              <div className="flex flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-dynamic-secondary-default">
                  Widelab
                </span>
                <span className="typography-label-sm text-ws-static-subtle">31 seats</span>
              </div>
              <IconButton
                icon={RiArrowDownSLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                aria-label="Switch workspace"
              />
            </div>
          </Sidebar.Section>
          <Sidebar.Section scrollable>
            <nav className="flex flex-col gap-ws-2">
              {FULL_NAV.map(({ label, Icon }) => (
                <Sidebar.Item
                  key={label}
                  href="#"
                  icon={Icon}
                  label={label}
                  active={label === 'Dashboard'}
                />
              ))}
            </nav>
          </Sidebar.Section>
          <Sidebar.Section>
            <div className="flex flex-col gap-ws-5 rounded-ws-container-md border border-ws-static-base bg-ws-static-container p-ws-9">
              <div className="flex items-center justify-between typography-label-strong-sm text-ws-dynamic-secondary-default">
                <span>Onboarding</span>
                <span>3/5</span>
              </div>
              <ProgressBar value={60} />
              <span className="typography-label-sm text-ws-static-subtle">
                Fulfill personal information
              </span>
            </div>
          </Sidebar.Section>
          <Sidebar.Section>
            <div className="flex items-center gap-ws-5 px-ws-5 py-ws-3">
              <Avatar initials="AS" status="online" />
              <div className="flex flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-base">Adam Smith</span>
                <span className="typography-label-sm text-ws-static-subtle">hello@wideset.co</span>
              </div>
            </div>
          </Sidebar.Section>
        </Sidebar>
      </div>
    </div>
  ),
});
