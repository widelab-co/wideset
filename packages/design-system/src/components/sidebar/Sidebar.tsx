import type * as React from 'react';

import type { SidebarProps } from './Sidebar.types';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded } from './SidebarExpanded';
import { SidebarFooter } from './SidebarFooter';
import { SidebarGroup } from './SidebarGroup';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { SidebarRoot } from './SidebarRoot';
import { SidebarSection } from './SidebarSection';
import { SidebarTrigger } from './SidebarTrigger';

type SidebarWithSubComponents = React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof SidebarHeader;
  Footer: typeof SidebarFooter;
  Section: typeof SidebarSection;
  Item: typeof SidebarItem;
  Group: typeof SidebarGroup;
  Expanded: typeof SidebarExpanded;
  Collapsed: typeof SidebarCollapsed;
  Trigger: typeof SidebarTrigger;
};

const Sidebar = SidebarRoot as SidebarWithSubComponents;

Sidebar.displayName = 'Sidebar';
Sidebar.Header = SidebarHeader;
Sidebar.Footer = SidebarFooter;
Sidebar.Section = SidebarSection;
Sidebar.Item = SidebarItem;
Sidebar.Group = SidebarGroup;
Sidebar.Expanded = SidebarExpanded;
Sidebar.Collapsed = SidebarCollapsed;
Sidebar.Trigger = SidebarTrigger;

export { Sidebar };
