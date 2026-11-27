import { createContext, useContext } from 'react';

import type { DropdownMenuPortalProps } from './DropdownMenu.types';

type DropdownMenuContextValue = {
  motion?: boolean;
};

export const DropdownMenuContext = createContext<DropdownMenuContextValue>({});

export const useDropdownMenuContext = () => useContext(DropdownMenuContext);

type DropdownMenuPortalContextValue = {
  container?: DropdownMenuPortalProps['container'];
  hasExplicitPortal: boolean;
};

export const DropdownMenuPortalContext = createContext<DropdownMenuPortalContextValue>({
  hasExplicitPortal: false,
});
