import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from './ScrollArea';

const meta = {
  title: 'Helper Components/ScrollArea',
  tags: ['autodocs'],
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { defaultValue: { summary: '' } },
    },
    orientation: {
      control: 'select',
      description: 'Orientation of the scrollbar',
      options: ['horizontal', 'vertical', 'both'],
      table: {
        type: { summary: "'horizontal' | 'vertical' | 'both'" },
        defaultValue: { summary: 'vertical' },
      },
    },
    indicatorHidden: {
      control: 'boolean',
      description: 'Whether to hide the scroll indicator',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Content to be scrolled',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const longContent = (
  <>
    <p className="typography-body-md mb-ws-2">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, tempora. Possimus eius
      explicabo voluptate. At, inventore optio repellendus corrupti quam suscipit unde explicabo
      minima consequuntur quis, error ullam voluptatum, officia sed voluptate. Quo tenetur sunt
      provident id optio eos perspiciatis natus ea mollitia? Tempore blanditiis neque ullam eveniet
      error itaque similique est quaerat quidem perferendis recusandae dolore nisi, eligendi iusto
      aliquam nobis quam at, quod repudiandae. Adipisci, omnis! Numquam repudiandae consequatur
      praesentium ducimus magni nemo, corrupti rerum fugiat in ex, libero suscipit quisquam. Nihil
      totam possimus amet dolorem eos dolore accusamus magni veniam, repellat explicabo tempore
      consectetur nesciunt aut est, quam dignissimos repudiandae sed harum a debitis voluptatibus
      aperiam dolor consequatur ex. Consequuntur nesciunt modi fuga labore, ullam odio nemo officiis
      ex architecto unde saepe, omnis nihil, sit repellat. Voluptate, quidem dignissimos atque
      quisquam odit explicabo sed distinctio culpa iusto corporis, ducimus fugit quibusdam, quia
      doloribus vero consequatur vitae possimus minima totam consequuntur nostrum fuga eum. Officia
      eaque, saepe, aliquid mollitia exercitationem quaerat totam minima, expedita dicta dolore
      adipisci quos consequatur non modi ducimus reprehenderit quo iure cumque commodi enim. Error,
      aliquam similique inventore eligendi eos eveniet cum nihil cupiditate tenetur quo facere
      explicabo dolores! Eos cumque necessitatibus est! Assumenda!
    </p>
    <p className="typography-body-md mb-ws-2">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, tempora. Possimus eius
      explicabo voluptate. At, inventore optio repellendus corrupti quam suscipit unde explicabo
      minima consequuntur quis, error ullam voluptatum, officia sed voluptate. Quo tenetur sunt
      provident id optio eos perspiciatis natus ea mollitia? Tempore blanditiis neque ullam eveniet
      error itaque similique est quaerat quidem perferendis recusandae dolore nisi, eligendi iusto
      aliquam nobis quam at, quod repudiandae. Adipisci, omnis! Numquam repudiandae consequatur
      praesentium ducimus magni nemo, corrupti rerum fugiat in ex, libero suscipit quisquam. Nihil
      totam possimus amet dolorem eos dolore accusamus magni veniam, repellat explicabo tempore
      consectetur nesciunt aut est, quam dignissimos repudiandae sed harum a debitis voluptatibus
      aperiam dolor consequatur ex. Consequuntur nesciunt modi fuga labore, ullam odio nemo officiis
      ex architecto unde saepe, omnis nihil, sit repellat. Voluptate, quidem dignissimos atque
      quisquam odit explicabo sed distinctio culpa iusto corporis, ducimus fugit quibusdam, quia
      doloribus vero consequatur vitae possimus minima totam consequuntur nostrum fuga eum. Officia
      eaque, saepe, aliquid mollitia exercitationem quaerat totam minima, expedita dicta dolore
      adipisci quos consequatur non modi ducimus reprehenderit quo iure cumque commodi enim. Error,
      aliquam similique inventore eligendi eos eveniet cum nihil cupiditate tenetur quo facere
      explicabo dolores! Eos cumque necessitatibus est! Assumenda!
    </p>
  </>
);

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <ScrollArea className="h-96" {...args} />
    </div>
  ),
  args: {
    orientation: 'vertical',
    indicatorHidden: false,
    children: longContent,
  },
};

export const Vertical = () => (
  <div className="w-96">
    <ScrollArea className="h-96" orientation="vertical">
      {longContent}
    </ScrollArea>
  </div>
);

export const Horizontal = () => (
  <ScrollArea orientation="horizontal" className="h-ws-14 w-96">
    <p className="typography-body-md whitespace-nowrap">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, tempora. Possimus eius
      explicabo voluptate. At, inventore optio repellendus corrupti quam suscipit unde explicabo
      minima consequuntur quis, error ullam voluptatum, officia sed voluptate. Quo tenetur sunt
      provident id optio eos perspiciatis natus ea mollitia? Tempore blanditiis neque ullam eveniet
      error itaque similique est quaerat quidem perferendis recusandae dolore nisi, eligendi iusto
      aliquam nobis quam at, quod repudiandae. Adipisci, omnis! Numquam repudiandae consequatur
      praesentium ducimus magni nemo, corrupti rerum fugiat in ex, libero suscipit quisquam. Nihil
      totam possimus amet dolorem eos dolore accusamus magni veniam, repellat explicabo tempore
      consectetur nesciunt aut est, quam dignissimos repudiandae sed harum a debitis voluptatibus
      aperiam dolor consequatur ex. Consequuntur nesciunt modi fuga labore, ullam odio nemo officiis
      ex architecto unde saepe, omnis nihil, sit repellat. Voluptate, quidem dignissimos atque
      quisquam odit explicabo sed distinctio culpa iusto corporis, ducimus fugit quibusdam, quia
      doloribus vero consequatur vitae possimus minima totam consequuntur nostrum fuga eum. Officia
      eaque, saepe, aliquid mollitia exercitationem quaerat totam minima, expedita dicta dolore
      adipisci quos consequatur non modi ducimus reprehenderit quo iure cumque commodi enim. Error,
      aliquam similique inventore eligendi eos eveniet cum nihil cupiditate tenetur quo facere
      explicabo dolores! Eos cumque necessitatibus est! Assumenda!
    </p>
  </ScrollArea>
);

export const HiddenIndicator = () => (
  <div className="w-96">
    <ScrollArea className="h-96" indicatorHidden>
      {longContent}
    </ScrollArea>
  </div>
);
