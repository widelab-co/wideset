import { createContext, useContext } from 'react';

type DropdownMenuContextValue = {
  motion?: boolean;
};

export const DropdownMenuContext = createContext<DropdownMenuContextValue>({});

export const useDropdownMenuContext = () => useContext(DropdownMenuContext);

/** Tells the panel to use its enclosing DropdownMenu.Portal. */
export const DropdownMenuPortalContext = createContext(false);
