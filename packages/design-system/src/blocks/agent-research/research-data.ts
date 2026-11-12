import type { Prose, Step, Turn } from './model';
import { formatList, formatPrice } from './research-format';

/*
  The research run of the open chat. Ines asked how Roomline, Meetwise and Deskhaven price their
  meeting-room hardware, for the Hub 2 tiers. Tandem planned four steps, searched three times,
  read nine sources (all on `*.example`), compared the cost of one room and wrote the report.
  Every figure in the report follows from what a source says: Roomline $429 + 12 × $12 = $573,
  Meetwise $299 + 12 × $19 = $527, Deskhaven $379; over three years $861, $983 and $577.
*/

export const vendors = ['Roomline', 'Meetwise', 'Deskhaven'] as const;
export type Vendor = (typeof vendors)[number];

/** The plan Tandem follows; Ines can change it, which runs the research again. */
export const researchPlan = [
  'Find each vendor’s current prices and plan terms, on its own site.',
  'Work out what one room costs in the first year: the hub and twelve months of software.',
  'Check what comes bundled with the hardware and how long the contract runs.',
  'Set the three against Hub 2 at $349.',
];

/** A page Tandem read. Its `id` is its number: the order it was read in, and how it is cited. */
export type Source = {
  id: number;
  vendors: Vendor[];
  site: string;
  path: string;
  title: string;
  /** ISO date. */
  published: string;
  /** What the report took from it. */
  taken: string;
};

export const sources: Source[] = [
  {
    id: 1,
    vendors: ['Roomline'],
    site: 'roomline.example',
    path: '/pricing',
    title: 'Roomline pricing: hubs, panels and plans',
    published: '2026-10-14',
    taken: 'The hub is $429. The Rooms plan is $12 a room a month billed yearly, $15 monthly.',
  },
  {
    id: 2,
    vendors: ['Roomline'],
    site: 'help.roomline.example',
    path: '/rooms-plan-terms',
    title: 'Rooms plan: term, renewal and cancelling',
    published: '2026-08-02',
    taken: 'A 12-month term that renews each year. Hardware is bought separately and kept.',
  },
  {
    id: 3,
    vendors: ['Roomline'],
    site: 'partners.roomline.example',
    path: '/volume',
    title: 'Volume pricing for 50 rooms and more',
    published: '2026-06-18',
    taken: 'From 50 rooms the plan is 10% cheaper. The hub price does not change.',
  },
  {
    id: 4,
    vendors: ['Meetwise'],
    site: 'meetwise.example',
    path: '/room-kit',
    title: 'Meetwise Room Kit: plans and pricing',
    published: '2026-09-30',
    taken: 'The Room Kit is $299, sold only with Meetwise Rooms at $19 a room a month.',
  },
  {
    id: 5,
    vendors: ['Meetwise'],
    site: 'meetwise.example',
    path: '/legal/subscription-terms',
    title: 'Subscription terms',
    published: '2026-07-01',
    taken: 'A minimum of 24 months. Leaving early means returning the kit or paying $150.',
  },
  {
    id: 6,
    vendors: ['Meetwise'],
    site: 'community.meetwise.example',
    path: '/t/room-kit-without-a-plan',
    title: 'Can I buy a Room Kit without a plan?',
    published: '2026-03-09',
    taken: 'A staff answer: the kit is not sold on its own, and there are no plans to.',
  },
  {
    id: 7,
    vendors: ['Deskhaven'],
    site: 'deskhaven.example',
    path: '/store/hub',
    title: 'Deskhaven hardware store: Hub',
    published: '2026-10-21',
    taken: 'The hub is $379 with the first year of software. No subscription at checkout.',
  },
  {
    id: 8,
    vendors: ['Deskhaven'],
    site: 'deskhaven.example',
    path: '/blog/one-price-for-year-one',
    title: 'One price for year one',
    published: '2026-05-12',
    taken: 'From the second year software is $99 a hub a year. No contract; cancel any time.',
  },
  {
    id: 9,
    vendors: ['Roomline', 'Meetwise', 'Deskhaven'],
    site: 'workplaceweekly.example',
    path: '/meeting-room-hardware-2026',
    title: 'Meeting room hardware compared, 2026',
    published: '2026-09-04',
    taken: 'An independent roundup with the same list prices for all three hubs.',
  },
];

/** The step that read a source: the source is in the pane once this step has begun. */
export const readStep = (source: Source) => `read-source-${source.id}`;

/** One vendor in the comparison: how it charges, and what one room costs in the first year. */
export type ComparisonRow = {
  vendor: Vendor;
  /** What the software price is counted by. */
  billing: 'Per room' | 'Per seat' | 'Flat';
  hardware: string;
  contract: string;
  /** Dollars for one room in the first year: the hub and twelve months of software. */
  yearOne: number;
  /** The sources the row rests on, by number. */
  sources: number[];
};

export const comparison: ComparisonRow[] = [
  {
    vendor: 'Roomline',
    billing: 'Per room',
    hardware: 'Sold separately',
    contract: '1 year',
    yearOne: 573,
    sources: [1, 2],
  },
  {
    vendor: 'Meetwise',
    billing: 'Per room',
    hardware: 'Bundled with the plan',
    contract: '2 years',
    yearOne: 527,
    sources: [4, 5],
  },
  {
    vendor: 'Deskhaven',
    billing: 'Flat',
    hardware: 'Bundled with year one',
    contract: 'None',
    yearOne: 379,
    sources: [7, 8],
  },
];

const cite = (numbers: number[]) => numbers.map((number) => `[${number}]`).join('');

/**
 * The report as the kit's prose, which is what streams in and what Copy takes. A source is cited
 * by its number in square brackets. The transcript draws two of its lists its own way: the one at
 * `COMPARISON` as the table of `comparison`, row for row, and the one at `FINDINGS` numbered.
 */
export const reportProse: Prose[] = [
  {
    kind: 'paragraph',
    text: 'All three charge for software on top of the hub. In year one Hub 2, at **$349**, is under all three.',
  },
  {
    kind: 'list',
    items: comparison.map(
      (row) =>
        `**${row.vendor}:** ${row.billing.toLowerCase()}, hardware ${row.hardware.toLowerCase()}, contract ${row.contract.toLowerCase()}, ${formatPrice(row.yearOne)} a room in year one ${cite(row.sources)}`,
    ),
  },
  { kind: 'heading', text: 'Findings' },
  {
    kind: 'list',
    items: [
      '**Roomline keeps hardware and software apart.** The hub is $429 and the Rooms plan $12 a room a month on a yearly term, or $15 month to month. [1][2] From 50 rooms the plan is 10% cheaper. [3]',
      '**Meetwise sells the hub only with its plan.** The Room Kit is $299 with Meetwise Rooms at $19 a room a month, for at least 24 months. [4][5] It cannot be bought on its own. [6]',
      '**Deskhaven charges once.** $379 covers the hub and a year of software, then $99 a hub a year. [7][8]',
      '**Over three years the order flips.** A room comes to $983 with Meetwise, $861 with Roomline and $577 with Deskhaven. [2][5][8] An independent roundup lists the same prices. [9]',
    ],
  },
  { kind: 'heading', text: 'What I could not find out' },
  {
    kind: 'list',
    items: [
      'What Meetwise charges above 100 rooms: its page says to contact sales.',
      'Whether Roomline’s $12 holds at renewal, and what large customers really pay.',
    ],
  },
];

export const COMPARISON = 1;
export const FINDINGS = 3;

/**
 * Where the report, as far as it is written, cites a source: "the comparison and finding 2".
 * Empty while nothing cites it yet.
 */
export function citedIn(source: number, written: Prose[]) {
  const mark = `[${source}]`;
  const places = written.flatMap((block, at) => {
    if (block.kind !== 'list') return [];
    if (at !== FINDINGS) {
      return block.items.some((item) => item.includes(mark)) ? ['the comparison'] : [];
    }
    return block.items.flatMap((item, index) =>
      item.includes(mark) ? [`finding ${index + 1}`] : [],
    );
  });
  return formatList(places);
}

/** The cards the screen draws: the plan, and the report. */
export const PLAN = 'pricing-plan';
export const REPORT = 'pricing-report';

const searches: { query: string; results: { title: string; source: string }[] }[] = [
  {
    query: 'Roomline room hub pricing',
    results: [
      { title: 'Roomline pricing: hubs, panels and plans', source: 'roomline.example' },
      { title: 'Rooms plan: term, renewal and cancelling', source: 'help.roomline.example' },
      { title: 'Volume pricing for 50 rooms and more', source: 'partners.roomline.example' },
    ],
  },
  {
    query: 'Meetwise Room Kit plan terms',
    results: [
      { title: 'Meetwise Room Kit: plans and pricing', source: 'meetwise.example' },
      { title: 'Subscription terms', source: 'meetwise.example' },
      { title: 'Can I buy a Room Kit without a plan?', source: 'community.meetwise.example' },
    ],
  },
  {
    query: 'Deskhaven hub price contract',
    results: [
      { title: 'Deskhaven hardware store: Hub', source: 'deskhaven.example' },
      { title: 'One price for year one', source: 'deskhaven.example' },
      { title: 'Meeting room hardware compared, 2026', source: 'workplaceweekly.example' },
    ],
  },
];

const searchSteps: Step[] = searches.map(({ query, results }, index) => ({
  id: `search-${index + 1}`,
  label: `Searched for \`${query}\``,
  active: `Searching for \`${query}\``,
  result: `${results.length} results`,
  status: 'done',
  ms: 900,
  detail: { kind: 'results', items: results },
}));

const readSteps: Step[] = sources.map((source) => ({
  id: readStep(source),
  label: `Read \`${source.site}${source.path}\``,
  active: `Reading \`${source.site}${source.path}\``,
  status: 'done',
  ms: 800,
}));

export const researchTurns: Turn[] = [
  {
    id: 'pricing-1',
    role: 'user',
    text: 'How do Roomline, Meetwise and Deskhaven price their meeting-room hardware?',
    sentWith: ['Research'],
  },
  {
    id: 'pricing-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'pricing-thought',
        seconds: 6,
        text: 'Three vendors, and what matters is the model: hardware sold once, a subscription, or both. Their own pricing pages and terms will say; a comparison site is only good as a cross-check. To make them comparable I will reduce each to what one room costs in the first year, then look at three years, since a contract changes the picture.',
      },
      { kind: 'card', id: PLAN, card: PLAN },
      {
        kind: 'steps',
        id: 'pricing-searches',
        label: 'Searched the web 3 times',
        steps: searchSteps,
      },
      {
        kind: 'steps',
        id: 'pricing-sources',
        label: `Read ${sources.length} sources`,
        steps: readSteps,
      },
      {
        kind: 'step',
        id: 'compare',
        label: 'Compared the cost of one room',
        active: 'Comparing the cost of one room',
        result: 'Over 1 and 3 years',
        status: 'done',
        ms: 1200,
        detail: {
          kind: 'output',
          lines: [
            'vendor      hub    software            year 1   3 years',
            'Roomline    $429   $12 a month         $573     $861',
            'Meetwise    $299   $19 a month         $527     $983',
            'Deskhaven   $379   $99 a year, later   $379     $577',
            'Hub 2       $349   none                $349     $349',
          ],
        },
      },
      // A card that is written like an answer: it streams, stops and is copied as one.
      { kind: 'card', id: REPORT, card: REPORT, prose: reportProse },
    ],
  },
];
