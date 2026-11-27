import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { DropdownMenuPortalContext } from './DropdownMenu.context';
import type { DropdownMenuPortalProps } from './DropdownMenu.types';

// Use this wrapper to set a custom container or forceMount for a menu panel.
export const DropdownMenuPortal = (props: DropdownMenuPortalProps) => (
  <DropdownMenuPortalContext.Provider
    value={{ container: props.container, hasExplicitPortal: true }}
  >
    <DropdownMenuPrimitive.Portal {...props} />
  </DropdownMenuPortalContext.Provider>
);

DropdownMenuPortal.displayName = 'DropdownMenu.Portal';
