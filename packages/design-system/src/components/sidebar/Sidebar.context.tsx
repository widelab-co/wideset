import * as React from 'react';

import type { SidebarContextValue, SidebarGroupContextValue } from './Sidebar.types';

export const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);

  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a <Sidebar>');
  }

  return context;
};

export const SidebarGroupContext = React.createContext<SidebarGroupContextValue | undefined>(
  undefined,
);

export const useSidebarGroupContext = () => {
  const context = React.useContext(SidebarGroupContext);

  if (context === undefined) {
    throw new Error('useSidebarGroupContext must be used within a <Sidebar.Group>');
  }

  return context;
};
