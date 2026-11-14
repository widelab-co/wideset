import {
  RiBarChartBoxLine,
  RiBuilding2Line,
  RiFileList3Line,
  RiHandCoinLine,
  RiHome5Line,
} from '@remixicon/react';

/*
  Orbit, a customer and revenue platform, in the Lumen Studio workspace, before anyone has added a
  customer: the list has its frame and its search, and nothing in it yet.
*/

export const workspace = { name: 'Lumen Studio', seats: 3 };

/** The signed-in person. */
export const account = { name: 'Maya Chen', initials: 'MC', email: 'maya@lumenstudio.co' };

export const navigation = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'invoices', label: 'Invoices', icon: RiFileList3Line },
  { id: 'reports', label: 'Reports', icon: RiBarChartBoxLine },
];
