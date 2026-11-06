import { createContext, useContext } from 'react';

import type { ActiveCellStore } from './Spreadsheet.hooks';
import type { SpreadsheetSize } from './Spreadsheet.types';

export type SpreadsheetContextValue = {
  size: SpreadsheetSize;
  store: ActiveCellStore;
};

export const SpreadsheetContext = createContext<SpreadsheetContextValue | undefined>(undefined);

export const useSpreadsheetContext = () => {
  const context = useContext(SpreadsheetContext);

  if (context === undefined) {
    throw new Error('useSpreadsheetContext must be used within a <Spreadsheet>');
  }

  return context;
};
