import { createContext, useContext } from 'react';

import type { ProgressBarContextValue } from './ProgressBar.types';

export const ProgressBarContext = createContext<ProgressBarContextValue | undefined>(undefined);

export const useProgressBarContext = () => {
  const context = useContext(ProgressBarContext);

  if (!context) {
    throw new Error('useProgressBarContext must be used within a <ProgressBar>');
  }

  return context;
};
