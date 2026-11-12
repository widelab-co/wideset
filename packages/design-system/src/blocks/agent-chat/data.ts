import { chatGroups as chats, withThread } from './canon';
import type { Prose, Turn } from './model';

/*
  The open chat of this block: "Launch announcement" in the Hub 2 launch project. Ines asked for
  the Lumen Hub 2 announcement, Tandem read two files (one outside the project, after she allowed
  it), wrote the document, and made a second version after her next message. Every figure agrees
  with the files Tandem read: $349, out on November 17, 2026, $100 trade-in until January 31.
  Everything else (the account, the models, the other chats and sessions) is the canon's.
*/

/* The document Tandem wrote in the open chat, as its two versions. */

const versionOne: Prose[] = [
  { kind: 'title', text: 'Introducing Lumen Hub 2' },
  {
    kind: 'paragraph',
    text: 'For three years the first Lumen Hub has been the quiet box behind thousands of meeting rooms. Today we are introducing its successor. Lumen Hub 2 connects the display, the camera and the door panel through a single cable, and it sets a room up in less time than it takes to book one.',
  },
  { kind: 'heading', text: 'What is new' },
  {
    kind: 'paragraph',
    text: 'Setting up a room used to mean three cables and an afternoon. Hub 2 needs one USB-C cable to the display and finds the camera and the microphones on its own. In the October pilot the median room was ready in nine minutes.',
  },
  {
    kind: 'paragraph',
    text: 'The room now knows its own calendar. Hub 2 shows the next booking on the door panel, starts the call when the first person walks in, and frees the room when nobody has shown up after ten minutes.',
  },
  {
    kind: 'paragraph',
    text: 'It is also less to look after. Updates install overnight, and IT sees every room on one page in the Lumen app instead of walking the floor.',
  },
  { kind: 'heading', text: 'Price and availability' },
  {
    kind: 'paragraph',
    text: 'Lumen Hub 2 costs $349 and is out on November 17, 2026. Teams with a first-generation Hub can trade it in for $100 off until January 31, 2027. Order at lumenstudio.example/hub-2.',
  },
];

const versionTwo: Prose[] = [
  { kind: 'title', text: 'Lumen Hub 2: every room on one cable, from $349' },
  {
    kind: 'paragraph',
    text: 'Lumen Hub 2 is out on November 17, 2026 for $349, $50 less than the first Hub. It connects the display, the camera and the door panel through a single cable, and the median room in our pilot was ready in nine minutes.',
  },
  { kind: 'heading', text: 'What is new' },
  {
    kind: 'list',
    items: [
      '**One cable.** USB-C to the display; Hub 2 finds the camera and the microphones on its own.',
      '**A room that knows its calendar.** It shows the next booking on the door panel, starts the call when people walk in, and frees the room after ten minutes of nobody.',
      '**Less to look after.** Updates install overnight, and IT sees every room on one page in the Lumen app.',
    ],
  },
  { kind: 'heading', text: 'Trade-in' },
  {
    kind: 'paragraph',
    text: 'Teams with a first-generation Hub get $100 off until January 31, 2027. Order at lumenstudio.example/hub-2.',
  },
];

/**
 * The document and its versions. A version is there once the step that wrote it has run; the
 * first came with the first answer. `card` is the name its card block in the transcript carries.
 */
export const launchDocument = {
  title: 'Lumen Hub 2 launch announcement',
  versions: [
    { card: 'version-1', step: undefined, prose: versionOne },
    { card: 'version-2', step: 'edit-document', prose: versionTwo },
  ],
};

/* The open chat. */

const launchAnnouncement: Turn[] = [
  {
    id: 'launch-1',
    role: 'user',
    text: 'Draft the launch announcement for Lumen Hub 2. Use the positioning doc, and take the prices from Finance’s price list.',
  },
  {
    id: 'launch-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'launch-2-thought',
        seconds: 12,
        text: 'An announcement needs a promise, the proof and the price. The positioning doc should have the first two. The price list has the third, but it lives with Finance, outside this project, so I have to ask before I read it. I will open with the story of the first Hub, cover the three changes, and close with price and availability.',
      },
      {
        kind: 'steps',
        id: 'launch-2-files',
        label: 'Read 2 files',
        steps: [
          {
            id: 'read-positioning',
            label: 'Read `hub-2-positioning.md`',
            active: 'Reading `hub-2-positioning.md`',
            result: '31 lines',
            status: 'done',
            detail: {
              kind: 'output',
              lines: [
                '# Lumen Hub 2 positioning',
                'Audience: IT and workplace leads, 20 to 500 rooms',
                'Promise: every room ready in minutes, on one cable',
                'Proof: 9 min median setup in the October pilot, 41 rooms',
              ],
            },
          },
          {
            id: 'read-prices',
            label: 'Read `Finance/price-list-2026.csv`',
            active: 'Reading `Finance/price-list-2026.csv`',
            result: '3 rows',
            status: 'done',
            approval: {
              title: 'Read a file outside this project',
              command: 'Finance/price-list-2026.csv',
              reason:
                'The price list has the launch price and the trade-in credit. Tandem reads it and changes nothing.',
              scope: 'this project',
              answer: 'once',
            },
            detail: {
              kind: 'output',
              lines: [
                'sku,name,price_usd,available',
                'LH2-STD,Lumen Hub 2,349,2026-11-17',
                'LH1-STD,Lumen Hub,399,2023-09-12',
                'LH2-TRADE,Hub 2 trade-in credit,-100,2026-11-17',
              ],
            },
          },
        ],
      },
      {
        kind: 'text',
        id: 'launch-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'Here is a first draft, built on `hub-2-positioning.md` and the price list.',
          },
        ],
      },
      { kind: 'card', id: 'launch-2-document', card: 'version-1' },
    ],
  },
  {
    id: 'launch-3',
    role: 'user',
    text: 'Shorter, and lead with the price. Then give me the launch block for the site config.',
  },
  {
    id: 'launch-4',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'launch-4-thought',
        seconds: 4,
        text: 'She wants it tighter, with the price first. $349 against $399 for the first Hub is the strongest line, so that opens it. The three feature paragraphs can become one list, and the story of the first Hub can go. The site banner reads its dates from the launch block in the site config.',
      },
      {
        kind: 'step',
        id: 'edit-document',
        label: 'Edited the document',
        active: 'Editing the document',
        result: 'Version 2',
        status: 'done',
        ms: 2600,
        detail: {
          kind: 'diff',
          lines: [
            '-Introducing Lumen Hub 2',
            '+Lumen Hub 2: every room on one cable, from $349',
            ' ',
            '-For three years the first Lumen Hub has been the quiet box behind thousands of meeting rooms. Today we are introducing its successor.',
            '+Lumen Hub 2 is out on November 17, 2026 for $349, $50 less than the first Hub.',
          ],
        },
      },
      {
        kind: 'text',
        id: 'launch-4-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'Version 2 is a third shorter and opens with the price.',
          },
          {
            kind: 'list',
            items: [
              'The first line is the price and the date: **$349**, out on November 17.',
              'The feature paragraphs are one list; the first Hub’s story is gone.',
            ],
          },
          { kind: 'paragraph', text: 'For the banner, add this block to `site.config.json`:' },
          {
            kind: 'code',
            language: 'JSON',
            lines: [
              '"launch": {',
              '  "startsAt": "2026-11-17T09:00:00-08:00",',
              '  "banner": "Lumen Hub 2 is here, from $349"',
              '}',
            ],
          },
        ],
      },
      { kind: 'card', id: 'launch-4-document', card: 'version-2' },
    ],
  },
];

/** The chat that opens with the block, and whose document the pane shows. */
export const OPEN_CHAT = 'launch-announcement';

/** The canon's chats, with this block's chat in full in its place. */
export const chatGroups = withThread(chats, OPEN_CHAT, (thread) => ({
  ...thread,
  turns: launchAnnouncement,
}));
