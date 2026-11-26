import { RiArrowLeftSLine } from '@remixicon/react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconButton } from 'src/components/button/IconButton';
import { cn } from 'src/lib/utils';

import { routes } from '../routes';

const navLinks = [
  {
    label: 'Home',
    to: routes.home,
  },
];

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div className={cn('block shrink-0 transition-all', isCollapsed ? 'w-ws-20' : 'w-96')} />

      <div
        className={cn(
          'pt-ws-10 border-r border-r-gray-300 bg-white',
          'fixed top-0 bottom-0 left-0',
          'flex flex-col',
          'transition-all',
          isCollapsed ? 'w-ws-20' : 'w-96',
        )}
      >
        <div className="mx-ws-4 mb-ws-10 flex items-center justify-between">
          {!isCollapsed && 'LOGO'}
          <IconButton
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            preset="border"
            variant="secondary"
            icon={RiArrowLeftSLine}
            onClick={() => {
              setIsCollapsed((prev) => !prev);
            }}
            className={cn('transition-transform', isCollapsed ? 'rotate-180' : '')}
          />
        </div>

        <nav className="flex flex-col">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              className="text-gray-1000 mx-ws-4 my-ws-1 p-ws-2 px-ws-4 overflow-hidden rounded-md bg-gray-400 whitespace-nowrap hover:bg-gray-600"
              to={item.to}
            >
              {isCollapsed ? item.label.slice(0, 1) : item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
