import * as React from 'react';

import type { NavigationBarItemContextValue } from './NavigationBar.types';

export const NavigationBarItemContext = React.createContext<NavigationBarItemContextValue | null>(
  null,
);

export const useNavigationBarItemContext = (): NavigationBarItemContextValue => {
  const context = React.useContext(NavigationBarItemContext);
  if (!context) {
    throw new Error('useNavigationBarItemContext must be used within a <NavigationBar.Item>');
  }
  return context;
};
