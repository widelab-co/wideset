import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { Popup } from '../popup/Popup';
import GutterExample from './examples/scroll-area/gutter';
import gutterSource from './examples/scroll-area/gutter?raw';
import OrientationsExample from './examples/scroll-area/orientations';
import orientationsSource from './examples/scroll-area/orientations?raw';
import VisibilityExample from './examples/scroll-area/visibility';
import visibilitySource from './examples/scroll-area/visibility?raw';
import { ScrollArea } from './ScrollArea';

const ACTIVITY = [
  ['Anna Kowalska', 'approved invoice INV-2041', '09:12'],
  ['Tomasz Nowak', 'commented on Q3 budget', '08:57'],
  ['Priya Raman', 'moved Onboarding flow to Done', '08:40'],
  ['Lucas Martin', 'uploaded signed-contract.pdf', '08:21'],
  ['Sofia Rossi', 'invited Mia Chen to Growth', 'Yesterday'],
  ['Omar Haddad', 'changed the due date of Launch plan', 'Yesterday'],
  ['Mia Chen', 'joined the Growth workspace', 'Yesterday'],
  ['Jan Wiśniewski', 'archived Roadmap 2024', 'Mon'],
  ['Anna Kowalska', 'renamed Marketing to Growth', 'Mon'],
  ['Priya Raman', 'closed 12 support tickets', 'Mon'],
];

const activityFeed = (
  <ul className="gap-ws-9 p-ws-9 flex flex-col">
    {ACTIVITY.map(([name, action, time]) => (
      <li key={`${name}-${action}`} className="gap-ws-2 flex flex-col">
        <p className="typography-body-md text-ws-static-base">
          <span className="text-ws-static-strong">{name}</span> {action}
        </p>
        <span className="typography-caption-md text-ws-static-subtle">{time}</span>
      </li>
    ))}
  </ul>
);

const meta = {
  title: 'Components/ScrollArea',
  tags: ['autodocs'],
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A region that keeps its size and scrolls its content behind Wideset's own thin scrollbar, which floats over the content and shows while you hover or scroll.

Use it for anything that scrolls inside a page: a panel or list that fills the remaining height, a list in a popover with a max height, a wide table, a row of cards. Modal, Sidepanel, Popup, Card, Sidebar and the list popups (ComboBox, FilterButton, MultiSelect) already scroll this way.

Don't use it for the page itself or a \`textarea\`: they cannot be wrapped, so give them the \`wds-scrollbar\` class for the same look on the native bar. Don't wrap a region that does not need its own scroll; let the page scroll instead.

\`ref\` points at the viewport, the element that scrolls; every other prop goes to the root, so size the root (\`h-*\`, \`max-h-*\`, \`flex-1 min-h-0\`).`,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'both'],
      table: {
        category: 'Behavior',
        type: { summary: "'vertical' | 'horizontal' | 'both'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    scrollbarVisibility: {
      control: 'radio',
      options: ['hover', 'scroll', 'auto', 'always', 'never'],
      table: {
        category: 'Appearance',
        type: { summary: "'hover' | 'scroll' | 'auto' | 'always' | 'never'" },
        defaultValue: { summary: "'hover'" },
      },
    },
    scrollbarGutter: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    scrollHideDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description:
        'Milliseconds the bar stays after the pointer leaves or scrolling stops, for `hover` and `scroll`.',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '600' },
      },
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description:
        "Reading direction. `rtl` puts the vertical bar on the left; pass it (or Radix's `DirectionProvider`) in a right-to-left page.",
      table: { category: 'Behavior', type: { summary: "'ltr' | 'rtl'" } },
    },
    tabIndex: {
      control: false,
      table: { category: 'Behavior', type: { summary: 'number' } },
    },
    defaultMotion: {
      control: 'boolean',
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Classes for the root. Size it here: `h-*`, `max-h-*` or `flex-1 min-h-0`.',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
    asChild: { table: { disable: true } },
  },
  args: { children: activityFeed },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const TERMS = [
  'Wideset is provided under the Apache License 2.0. You may use, reproduce and distribute it in source or object form, with or without modifications, provided that you meet the conditions of the licence.',
  'You must give any other recipients a copy of the licence, keep the attribution notices from the source form, and state that you changed any file you modified.',
  'Unless required by law or agreed to in writing, Wideset is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied.',
  'In no event shall any contributor be liable for damages, including any direct, indirect, special, incidental or consequential damages arising out of the use of the work.',
];

const termsText = (
  <div className="gap-ws-7 p-ws-9 flex flex-col">
    {TERMS.map((paragraph) => (
      <p key={paragraph} className="typography-body-md text-ws-static-base">
        {paragraph}
      </p>
    ))}
  </div>
);

const box = 'rounded-ws-container-md border-ws-static-base border';

export const Default: Story = {
  render: (args) => <ScrollArea {...args} className={`${box} h-[16rem] w-[20rem]`} />,
  args: {
    orientation: 'vertical',
    scrollbarVisibility: 'hover',
    scrollbarGutter: false,
  },
};

export const Orientations: Story = exampleStory(OrientationsExample, orientationsSource);

export const Visibility: Story = exampleStory(VisibilityExample, visibilitySource);

export const Gutter: Story = exampleStory(GutterExample, gutterSource);

export const FillsRemainingHeight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In a panel of fixed height, `min-h-0 flex-1` makes the area take what the header and footer leave and scroll the rest. Without `min-h-0` a flex child never shrinks below its content, and the panel grows instead.',
      },
    },
  },
  render: () => (
    <div className={`${box} flex h-[22rem] w-[20rem] flex-col`}>
      <header className="border-ws-static-base p-ws-9 typography-label-md text-ws-static-strong border-b">
        Recent activity
      </header>
      <ScrollArea className="min-h-0 flex-1">{activityFeed}</ScrollArea>
      <footer className="border-ws-static-base p-ws-9 flex justify-end border-t">
        <Button variant="secondary" preset="border" size="sm">
          View all
        </Button>
      </footer>
    </div>
  ),
};

export const Truncation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A vertical area keeps its content as wide as itself, so `truncate` cuts a long line with an ellipsis instead of pushing it out of view.',
      },
    },
  },
  render: () => (
    <ScrollArea className={`${box} h-[10rem] w-[16rem]`}>
      <ul className="p-ws-5 flex flex-col">
        {[
          'Q3 board deck — final version for review.pdf',
          'Customer interviews, September, all regions.docx',
          'Onboarding flow — copy review with legal.docx',
          'Security questionnaire, Acme Corp, 2025 edition.pdf',
          'Pricing experiment results.xlsx',
          'Roadmap 2025.pdf',
        ].map((file) => (
          <li
            key={file}
            className="typography-body-md text-ws-static-base px-ws-5 py-ws-4 truncate"
          >
            {file}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const InPopup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In a popover or menu, a `max-h-*` on the area caps the list and scrolls the rest. Pressing the bar keeps focus where it was, like a native scrollbar, so a field that owns the list stays focused.',
      },
    },
  },
  render: () => (
    <div className="min-h-[24rem]">
      <Popup>
        <Popup.Trigger asChild>
          <Button variant="secondary" preset="border">
            Show members
          </Button>
        </Popup.Trigger>
        <Popup.Container aria-label="Members" className="w-[16rem]">
          <ScrollArea className="max-h-[14rem]">
            <ul className="p-ws-3 flex flex-col">
              {ACTIVITY.map(([name], index) => (
                <li key={`${name}-${index}`}>
                  <a
                    href={`#member-${index}`}
                    className="rounded-ws-control-lg px-ws-7 py-ws-4 typography-body-md text-ws-static-base hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default flex focus-visible:-outline-offset-2"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Popup.Container>
      </Popup>
    </div>
  ),
};

export const NestedInScrollingPage: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'A region inside a page that scrolls on its own: the wheel scrolls the region until it reaches an end, then the page. Only the region shows the custom bar; style the page bar with `wds-scrollbar` on `<html>`.',
      },
    },
  },
  render: () => (
    <div className="gap-ws-12 flex w-[28rem] flex-col">
      {TERMS.map((paragraph) => (
        <p key={paragraph} className="typography-body-md text-ws-static-base">
          {paragraph}
        </p>
      ))}
      <ScrollArea className={`${box} h-[12rem]`}>{activityFeed}</ScrollArea>
      {[...TERMS].reverse().map((paragraph) => (
        <p key={paragraph} className="typography-body-md text-ws-static-base">
          {paragraph}
        </p>
      ))}
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the content overflows and has nothing to tab to, the area itself becomes a tab stop with a focus ring, so the arrow, Page and Space keys can scroll it. Content with links or fields adds no extra stop: tabbing to them scrolls them into view.',
      },
    },
  },
  render: () => (
    <div className="gap-ws-9 flex w-[20rem] flex-col">
      <ScrollArea className={`${box} h-[10rem]`}>{termsText}</ScrollArea>
      <Button>Accept</Button>
    </div>
  ),
};

export const RightToLeft: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `dir="rtl"` the vertical bar moves to the left edge, and `scrollbarGutter` reserves the left side.',
      },
    },
  },
  render: () => (
    <div dir="rtl" className="gap-ws-11 grid w-[24rem] grid-cols-2">
      {[false, true].map((gutter) => (
        <ScrollArea
          key={String(gutter)}
          dir="rtl"
          scrollbarVisibility="always"
          scrollbarGutter={gutter}
          className={`${box} h-[10rem]`}
        >
          <ul className="p-ws-5 flex flex-col">
            {[
              'يناير',
              'فبراير',
              'مارس',
              'أبريل',
              'مايو',
              'يونيو',
              'يوليو',
              'أغسطس',
              'سبتمبر',
              'أكتوبر',
              'نوفمبر',
              'ديسمبر',
            ].map((month) => (
              <li key={month} className="typography-body-md text-ws-static-base px-ws-5 py-ws-3">
                {month}
              </li>
            ))}
          </ul>
        </ScrollArea>
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The thumb is an alpha fill, so it reads on any surface in both themes: black at low opacity in light, white in dark.',
      },
    },
  },
  render: () => (
    <div className="dark bg-ws-static-container p-ws-12 rounded-ws-container-lg">
      <ScrollArea scrollbarVisibility="always" className={`${box} h-[14rem] w-[20rem]`}>
        {activityFeed}
      </ScrollArea>
    </div>
  ),
};
