'use client';

import { createContext, useContext } from 'react';

import type { ChipContextValue } from './Chip.types';

export const ChipContext = createContext<ChipContextValue | undefined>(undefined);

export const useChipContext = () => {
  const context = useContext(ChipContext);

  if (context === undefined) {
    throw new Error('useChipContext must be used within a Chip');
  }

  return context;
};
