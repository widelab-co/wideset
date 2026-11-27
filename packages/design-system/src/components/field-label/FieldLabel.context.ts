import { createContext, useContext } from 'react';

import type { FieldLabelContextValue } from './FieldLabel.types';

export const FieldLabelContext = createContext<FieldLabelContextValue | undefined>(undefined);

export const useFieldLabelContext = () => {
  const context = useContext(FieldLabelContext);
  if (!context) throw new Error('useFieldLabelContext must be used within a <FieldLabel>');
  return context;
};
