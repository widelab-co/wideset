import {
  RiFileChartLine,
  RiFileTextLine,
  RiFolderOpenLine,
  RiImageFill,
  RiPlayFill,
} from '@remixicon/react';

import type { SearchResult } from './search-result';

export const workspace = 'Lumen Studio';

/** What the search field holds when the modal opens: 8 results, 6 files and 2 people. */
export const QUERY = 'Mar';

/** Everything search looks through, most relevant first. */
export const index: SearchResult[] = [
  {
    id: 'marcus',
    kind: 'person',
    title: 'Marcus Bell',
    detail: 'Active now',
    initials: 'MB',
    online: true,
  },
  {
    id: 'marketing-invoices',
    kind: 'file',
    title: 'Marketing invoices',
    detail: 'in Finance • Edited 3d ago',
    icon: RiFolderOpenLine,
  },
  {
    id: 'logo-mark',
    kind: 'file',
    title: 'logo_mark_final.jpg',
    detail: 'in Brand • Edited 7d ago',
    icon: RiImageFill,
  },
  {
    id: 'sofia',
    kind: 'person',
    title: 'Sofia Marino',
    detail: 'Active 2d ago',
    initials: 'SM',
    online: false,
  },
  {
    id: 'kickoff',
    kind: 'file',
    title: 'kickoff_march.mp4',
    detail: 'in Videos • Added 2d ago',
    icon: RiPlayFill,
  },
  {
    id: 'forecast',
    kind: 'file',
    title: 'March forecast',
    detail: 'in Reports • Edited 5d ago',
    icon: RiFileChartLine,
  },
  {
    id: 'market-research',
    kind: 'file',
    title: 'Market research 2026',
    detail: 'in Strategy • Edited 2w ago',
    icon: RiFolderOpenLine,
  },
  {
    id: 'remarks',
    kind: 'file',
    title: 'board_remarks.pdf',
    detail: 'in Leadership • Added 3w ago',
    icon: RiFileTextLine,
  },
  {
    id: 'hana',
    kind: 'person',
    title: 'Hana Kobayashi',
    detail: 'Active now',
    initials: 'HK',
    online: true,
  },
  {
    id: 'pricing',
    kind: 'file',
    title: 'Pricing page copy',
    detail: 'in Website • Edited 1d ago',
    icon: RiFileTextLine,
  },
  {
    id: 'priya',
    kind: 'person',
    title: 'Priya Raman',
    detail: 'Active 1h ago',
    initials: 'PR',
    online: true,
  },
  {
    id: 'roadmap',
    kind: 'file',
    title: 'Q4 roadmap',
    detail: 'in Strategy • Edited 4d ago',
    icon: RiFolderOpenLine,
  },
  {
    id: 'onboarding',
    kind: 'file',
    title: 'onboarding_tour.mp4',
    detail: 'in Videos • Added 1w ago',
    icon: RiPlayFill,
  },
  {
    id: 'jonas',
    kind: 'person',
    title: 'Jonas Lindqvist',
    detail: 'Active 5d ago',
    initials: 'JL',
    online: false,
  },
];
