import { createContext, useContext } from 'react';

import type { ProgressBarContextType } from './ProgressBar.types';

export const ProgressBarContext = createContext<ProgressBarContextType | null>(null);

export const useProgressBarContext = () => {
  const context = useContext(ProgressBarContext);

  if (context === null) {
    throw new Error('useProgressBarContext must be used within a <ProgressBar>');
  }

  return context;
};
