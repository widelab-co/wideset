import type * as React from 'react';

import type { SidebarProps } from './Sidebar.types';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded } from './SidebarExpanded';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { SidebarRoot } from './SidebarRoot';
import { SidebarSection } from './SidebarSection';
import { SidebarSectionHeader } from './SidebarSectionHeader';
import { SidebarTrigger } from './SidebarTrigger';

type SidebarWithSubComponents = React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof SidebarHeader;
  Section: typeof SidebarSection;
  SectionHeader: typeof SidebarSectionHeader;
  Item: typeof SidebarItem;
  Expanded: typeof SidebarExpanded;
  Collapsed: typeof SidebarCollapsed;
  Trigger: typeof SidebarTrigger;
};

const Sidebar = SidebarRoot as SidebarWithSubComponents;

Sidebar.displayName = 'Sidebar';
Sidebar.Header = SidebarHeader;
Sidebar.Section = SidebarSection;
Sidebar.SectionHeader = SidebarSectionHeader;
Sidebar.Item = SidebarItem;
Sidebar.Expanded = SidebarExpanded;
Sidebar.Collapsed = SidebarCollapsed;
Sidebar.Trigger = SidebarTrigger;

export { Sidebar };
