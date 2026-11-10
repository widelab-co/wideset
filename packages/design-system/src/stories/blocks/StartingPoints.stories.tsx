import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';

import { BLOCKS, DIRECTION_TITLE, NAVIGATION_TITLE, PANELS } from '../../blocks';

/*
  The starting points: whole screens in src/blocks/<id>/, one story each, full screen. The docs
  site shows the same blocks under Starting points, with their code.
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
          'Whole screens to start a new app from, rebuilt 1:1 from the Wideset Core Figma file, in each visual direction (Flat, Frame, Inset, Canvas), with the sign-in and sign-up screens before the app, plus the panels that open over them. Copy the closest one, keep its surround, replace its content.',
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
export const CustomerDetail = story('customer-detail');
export const Billing = story('billing');
export const Settings = story('settings');
export const Team = story('team');
export const Onboarding = story('onboarding');
export const EmptyList = story('empty-list');
export const NoAccess = story('no-access');
export const NotFound = story('not-found');
export const ForgotPassword = story('forgot-password');
export const CheckEmail = story('check-email');
export const TwoFactor = story('two-factor');
export const SsoSignIn = story('sso-sign-in');
export const AcceptInvite = story('accept-invite');
export const Integrations = story('integrations');
export const Plans = story('plans');
export const Notifications = story('notifications');
export const Report = story('report');
export const TaskSidepanel = panelStory('task-sidepanel');
