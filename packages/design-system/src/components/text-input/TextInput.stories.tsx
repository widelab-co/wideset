import {
  RiArrowDownSLine,
  RiCalendarLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiSearchLine,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import AffixesExample from './examples/text-input/affixes';
import affixesSource from './examples/text-input/affixes?raw';
import PresetsExample from './examples/text-input/presets';
import presetsSource from './examples/text-input/presets?raw';
import SearchExample from './examples/text-input/search';
import searchSource from './examples/text-input/search?raw';
import SizesExample from './examples/text-input/sizes';
import sizesSource from './examples/text-input/sizes?raw';
import StatesExample from './examples/text-input/states';
import statesSource from './examples/text-input/states?raw';
import VariantsExample from './examples/text-input/variants';
import variantsSource from './examples/text-input/variants?raw';
import { TextInput } from './TextInput';

const meta = {
  title: 'Form/TextInput',
  tags: ['autodocs'],
  component: TextInput,
  subcomponents: {
    'TextInput.Icon': TextInput.Icon,
  },
  parameters: {
    docs: {
      description: {
        component: `TextInput accepts one line of free-form text, such as a search query, email address, amount, or URL. Use the \`border\` preset for standalone fields and \`ghost\` when nested in another surface, and \`variant="danger"\` to flag validation errors. For a clear affordance, compose \`TextInput.ClearButton\` into a suffix (the Search example shows the full search field).

Use Textarea for multiline content.

**Optional Composition:** works standalone as \`<TextInput />\`, or compose affixes around the input:
\`\`\`
<TextInput>                  — root, owns size/variant/preset/disabled and focus
  <TextInput.Prefix>         — leading affix (text or, with \`inner\`, inside the field)
    <TextInput.Icon>         — decorative icon, sized from context
    <TextInput.Button>       — actionable text button
  </TextInput.Prefix>
  <TextInput.Input>          — the <input> element (required when composing)
  <TextInput.Suffix>         — trailing affix (mirror of Prefix)
    <TextInput.IconButton>   — actionable icon-only button
    <TextInput.ClearButton>  — clears the value; visible only while the field holds one
  </TextInput.Suffix>
</TextInput>
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    className: { table: { category: 'Appearance', type: { summary: 'string' } } },
    children: { control: false, table: { category: 'Content', type: { summary: 'ReactNode' } } },
    variant: {
      control: 'radio',
      options: ['primary', 'danger'],
      description:
        'Visual variant. Use `danger` to signal a validation error; it also sets `aria-invalid` on the input, and an explicit `aria-invalid` prop wins.',
      table: {
        category: 'Appearance',
        type: { summary: "'primary' | 'danger'" },
        defaultValue: { summary: "'primary'" },
      },
    },
    preset: {
      description:
        'Surface preset. `border` for standalone fields, `ghost` when nested in another surface.',
      control: 'radio',
      options: ['border', 'ghost'],
      table: {
        category: 'Appearance',
        type: { summary: "'border' | 'ghost'" },
        defaultValue: { summary: "'border'" },
      },
    },
    size: {
      description: 'Control size. Sets height, typography and inner spacing.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    disabled: {
      description: 'When true, the input is non-interactive and removed from the tab order.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      description: 'Placeholder text shown when the input is empty.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    value: {
      description: 'Controlled value of the input.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The minimal field. Use the Controls to explore `variant`, `preset`, `size` and `disabled`.',
      },
    },
  },
  render: (args) => (
    <div className="max-w-xs">
      <TextInput {...args} />
    </div>
  ),
  args: {
    variant: 'primary',
    preset: 'border',
    size: 'md',
    placeholder: 'Input...',
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Presets: Story = exampleStory(PresetsExample, presetsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Affixes: Story = exampleStory(AffixesExample, affixesSource);

export const Search: Story = exampleStory(SearchExample, searchSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Composed usage with prefixes and suffixes. Affixes default to sitting outside the field; add `inner` to place them inside it. Use `TextInput.Icon` for decoration and `TextInput.Button` / `TextInput.IconButton` for actions.',
      },
    },
  },
  render: () => (
    <div className="gap-ws-8 flex max-w-4xl">
      <div className="gap-ws-4 flex flex-1 flex-col">
        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Prefix" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Suffix" />
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Inner Prefix" />
        </TextInput>

        <TextInput>
          <TextInput.Prefix inner>
            <TextInput.Button>
              Action
              <Button.Icon icon={RiArrowDownSLine} />
            </TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Input placeholder="Inner Prefix with Button" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Inner Suffix" />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiCalendarLine} />
          </TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiFileCopyLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Two Inner Prefixes" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Two Inner Suffixes" />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiFileCopyLine} />
          </TextInput.Suffix>
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiDownloadLine} />
          </TextInput.Suffix>
        </TextInput>
      </div>

      <div className="gap-ws-4 flex flex-1 flex-col">
        <TextInput>
          <TextInput.Prefix>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Prefix with Icon" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Suffix with IconButton" />
          <TextInput.Suffix>
            <TextInput.IconButton
              icon={RiFileCopyLine}
              aria-label="Copy"
              onClick={() => {
                console.log('copy clicked');
              }}
            />
          </TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix>
            <TextInput.Button>
              Categories
              <Button.Icon icon={RiArrowDownSLine} />
            </TextInput.Button>
          </TextInput.Prefix>
          <TextInput.Input placeholder="Prefix with Button" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Suffix with Button" />
          <TextInput.Suffix>
            <TextInput.Button>
              Action
              <Button.Icon icon={RiArrowDownSLine} />
            </TextInput.Button>
          </TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input placeholder="Prefix and Suffix" />
          <TextInput.Suffix>USD</TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Inner Prefix and Suffix" />
          <TextInput.Suffix inner>
            <TextInput.IconButton
              icon={RiFileCopyLine}
              aria-label="Copy"
              onClick={() => {
                console.log('copy clicked');
              }}
            />
          </TextInput.Suffix>
        </TextInput>

        <TextInput>
          <TextInput.Prefix>https://</TextInput.Prefix>
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input placeholder="Prefix + Inner Prefix" />
        </TextInput>

        <TextInput>
          <TextInput.Input placeholder="Suffix + Inner Suffix" />
          <TextInput.Suffix inner>
            <TextInput.Icon icon={RiFileCopyLine} />
          </TextInput.Suffix>
          <TextInput.Suffix>.com</TextInput.Suffix>
        </TextInput>
      </div>
    </div>
  ),
};
