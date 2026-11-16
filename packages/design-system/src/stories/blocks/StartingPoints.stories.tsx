import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';

import {
  type BlockDirection,
  BLOCKS,
  DIRECTION_TITLE,
  NAVIGATION_TITLE,
  PANELS,
} from '../../blocks';
import CustomersBlock from '../../blocks/customers';
import IntegrationsBlock from '../../blocks/integrations';
import ProductFormBlock from '../../blocks/product-form';

/*
  The starting points: whole screens in src/blocks/<id>/, one story each, full screen. The docs
  site shows the same blocks under Starting points, with their code. A gallery of screens, not a
  component: no autodocs page and no Controls, and `component` is only the lookup that renders a
  block by id.
*/
const modules = import.meta.glob<{ default: ComponentType }>('../../blocks/*/index.tsx', {
  eager: true,
});

const BlockById = ({ id }: { id: string }) => {
  const Block = modules[`../../blocks/${id}/index.tsx`]?.default;
  return Block ? <Block /> : <p>No block “{id}”.</p>;
};

const meta = {
  title: 'Starting points',
  component: BlockById,
  parameters: {
    layout: 'fullscreen',
    bleed: true,
    docs: {
      description: {
        component:
          'Whole screens to start a new app from, the first ones rebuilt 1:1 from the Wideset Core Figma file and the rest composed from Wideset by the same rules, in each visual direction (Flat, Frame, Inset, Canvas), with the sign-in and sign-up screens before the app, plus the panels that open over them. Copy the closest one, keep its surround, replace its content.',
      },
    },
  },
} satisfies Meta<typeof BlockById>;

export default meta;
type Story = StoryObj<typeof meta>;

const story = (id: string): Story => {
  const block = BLOCKS.find((entry) => entry.id === id)!;
  return {
    name: `${block.title} (${DIRECTION_TITLE[block.direction]}, ${NAVIGATION_TITLE[block.navigation].toLowerCase()})`,
    args: { id },
    parameters: { docs: { description: { story: block.description } } },
  };
};

const panelStory = (id: string): Story => {
  const panel = PANELS.find((entry) => entry.id === id)!;
  return {
    name: `${panel.title} (panel)`,
    args: { id },
    parameters: { docs: { description: { story: panel.description } } },
  };
};

export const Kanban = story('kanban');
export const Process = story('process');
export const FinanceDashboard = story('finance-dashboard');
export const Spreadsheet = story('spreadsheet');
export const Gantt = story('gantt');
export const AiChat = story('ai-chat');
export const Communication = story('communication');
export const Calendar = story('calendar');
export const SignIn = story('sign-in');
export const SignInCard = story('sign-in-card');
export const SignUp = story('sign-up');
export const Crypto = story('crypto');
export const Analytics = story('analytics');
export const SalesOverview = story('sales-overview');
export const Customers = story('customers');

/** A screen in another direction: the page stays the same, only the surround changes. */
const inDirection = <D extends BlockDirection>(
  id: string,
  Block: ComponentType<{ direction?: D }>,
  direction: D,
): Story => {
  const block = BLOCKS.find((entry) => entry.id === id)!;
  return {
    name: `${block.title} (${DIRECTION_TITLE[direction]}, ${NAVIGATION_TITLE[block.navigation].toLowerCase()})`,
    args: { id },
    render: () => <Block direction={direction} />,
    parameters: {
      docs: {
        description: {
          story: `The ${block.title} screen in the ${DIRECTION_TITLE[direction]} direction: the same page, another surround. An app keeps one direction on every screen.`,
        },
      },
    },
  };
};
export const CustomersFrame = inDirection('customers', CustomersBlock, 'frame');
export const CustomersInset = inDirection('customers', CustomersBlock, 'inset');
export const CustomersCanvas = inDirection('customers', CustomersBlock, 'canvas');
export const CustomerDetail = story('customer-detail');
export const Billing = story('billing');
export const Invoice = story('invoice');
export const Settings = story('settings');
export const Team = story('team');
export const Integrations = story('integrations');
export const IntegrationsFrame = inDirection('integrations', IntegrationsBlock, 'frame');
export const IntegrationsInset = inDirection('integrations', IntegrationsBlock, 'inset');
export const Plans = story('plans');
export const Notifications = story('notifications');
export const Report = story('report');
export const Home = story('home');
export const Dashboard = story('dashboard');
export const OrderConfirmation = story('order-confirmation');
export const Checkout = story('checkout');
export const SendPayment = story('send-payment');
export const Orders = story('orders');
export const OrderDetail = story('order-detail');
export const Referrals = story('referrals');
export const CancelSubscription = story('cancel-subscription');
export const ActivityFeed = story('activity-feed');
export const Reviews = story('reviews');
export const Goals = story('goals');
export const Profile = story('profile');
export const AccessRequests = story('access-requests');
export const AccountSettings = story('account-settings');
export const Files = story('files');
export const Gallery = story('gallery');
export const ProductForm = story('product-form');
export const ProductFormCentered: Story = {
  name: 'Product form, centred (Inset, sidebar)',
  args: { id: 'product-form' },
  render: () => <ProductFormBlock layout="centered" />,
  parameters: {
    docs: {
      description: {
        story:
          'The product form as one centred column: every section in reading order, the actions in a bar at the bottom. Compare it with the two-column layout.',
      },
    },
  },
};
export const Import = story('import');
export const Pipeline = story('pipeline');
export const TaskSidepanel = panelStory('task-sidepanel');
