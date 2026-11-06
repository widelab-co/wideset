import { createContext, useContext } from 'react';

import type { ThumbnailContextType } from './Thumbnail.types';

export const ThumbnailContext = createContext<ThumbnailContextType | undefined>(undefined);

export const useThumbnailContext = () => {
  const context = useContext(ThumbnailContext);

  if (context === undefined) {
    throw new Error('useThumbnailContext must be used within a <Thumbnail>');
  }

  return context;
};
