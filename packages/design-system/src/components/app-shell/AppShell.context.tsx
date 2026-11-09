import * as React from 'react';

import type { AppShellContextValue } from './AppShell.types';

/** Read without the hook by parts that also work outside a shell (`Sidebar`). */
export const AppShellContext = React.createContext<AppShellContextValue | undefined>(undefined);

export const useAppShellContext = () => {
  const context = React.useContext(AppShellContext);

  if (context === undefined) {
    throw new Error('useAppShellContext must be used within a <AppShell>');
  }

  return context;
};
