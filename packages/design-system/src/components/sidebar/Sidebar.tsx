import type * as React from 'react';

import type { SidebarProps } from './Sidebar.types';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded } from './SidebarExpanded';
import { SidebarFooter } from './SidebarFooter';
import { SidebarGroup } from './SidebarGroup';
import { SidebarGroupContent } from './SidebarGroupContent';
import { SidebarGroupTrigger } from './SidebarGroupTrigger';
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
  Footer: typeof SidebarFooter;
  Section: typeof SidebarSection;
  SectionHeader: typeof SidebarSectionHeader;
  Item: typeof SidebarItem;
  Group: typeof SidebarGroup;
  GroupTrigger: typeof SidebarGroupTrigger;
  GroupContent: typeof SidebarGroupContent;
  Expanded: typeof SidebarExpanded;
  Collapsed: typeof SidebarCollapsed;
  Trigger: typeof SidebarTrigger;
};

const Sidebar = SidebarRoot as SidebarWithSubComponents;

Sidebar.displayName = 'Sidebar';
Sidebar.Header = SidebarHeader;
Sidebar.Footer = SidebarFooter;
Sidebar.Section = SidebarSection;
Sidebar.SectionHeader = SidebarSectionHeader;
Sidebar.Item = SidebarItem;
Sidebar.Group = SidebarGroup;
Sidebar.GroupTrigger = SidebarGroupTrigger;
Sidebar.GroupContent = SidebarGroupContent;
Sidebar.Expanded = SidebarExpanded;
Sidebar.Collapsed = SidebarCollapsed;
Sidebar.Trigger = SidebarTrigger;

export { Sidebar };
