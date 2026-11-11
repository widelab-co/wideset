/**
 * The blocks, in reading order: whole screens to start a new app from (`BLOCKS`) and the panels
 * that open over any of them (`PANELS`), one per folder beside this file, rebuilt 1:1 from the
 * Wideset Core Figma file or, from Analytics on, composed from Wideset without a Figma screen (see
 * README.md). The docs site and the tests read these lists; a folder missing from them
 * (or the other way round) fails `src/__tests__/blocks.test.tsx`.
 */
export type BlockDirection = 'flat' | 'frame' | 'inset' | 'canvas';
/**
 * `takeover`: a window over the app, no sidebar, a top bar with back and breadcrumbs. `none`: a
 * screen before the app (sign in, sign up), with no app navigation at all.
 */
export type BlockNavigation = 'sidebar' | 'rail' | 'top-bar' | 'takeover' | 'none';

export type BlockMeta = {
  /** Folder name and URL segment. */
  id: string;
  title: string;
  /** The visual direction it shows (specs/patterns/directions.md). */
  direction: BlockDirection;
  navigation: BlockNavigation;
  /** One sentence: what the screen is, so a reader knows when to start from it. */
  description: string;
};

export const BLOCKS: BlockMeta[] = [
  {
    id: 'kanban',
    title: 'Kanban',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A project board: workspace sidebar, breadcrumbs and view tabs, filters, and columns of task cards.',
  },
  {
    id: 'process',
    title: 'Process',
    direction: 'flat',
    navigation: 'rail',
    description:
      'A creation flow: a workspace rail beside the sidebar, a step header with progress, and a choice of type.',
  },
  {
    id: 'finance-dashboard',
    title: 'Finance dashboard',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'An overview under a top bar: key figures, charts, a transactions table and a side panel.',
  },
  {
    id: 'spreadsheet',
    title: 'Spreadsheet',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'A table worked in cell by cell under a top bar: view tools, typed columns that sort, a summary under each header, row selection and a status bar.',
  },
  {
    id: 'gantt',
    title: 'Gantt',
    direction: 'flat',
    navigation: 'takeover',
    description:
      'A plan over the app: a top bar to leave by, people and their tasks beside a timeline of months, and a task open in a side panel.',
  },
  {
    id: 'ai-chat',
    title: 'AI chat',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'An AI assistant home: a model switcher in the top bar, a greeting, and a composer with tools and attachments.',
  },
  {
    id: 'communication',
    title: 'Communication',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'A messaging app in three panels: the chat list, the conversation and the contact details.',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A month calendar on a raised page: views and filters in the header, events in the grid.',
  },
  {
    id: 'sign-in',
    title: 'Sign in',
    direction: 'inset',
    navigation: 'none',
    description:
      'A sign-in screen in two raised cards: the form, with its help links and keyboard hints, beside a picture of the product.',
  },
  {
    id: 'sign-in-card',
    title: 'Sign in card',
    direction: 'inset',
    navigation: 'none',
    description:
      'The same sign-in form alone in one centred card, for a product with nothing to show beside it.',
  },
  {
    id: 'sign-up',
    title: 'Sign up',
    direction: 'inset',
    navigation: 'none',
    description:
      'Creating an account in the sign-in card: name, work e-mail, a password you can reveal, and the terms.',
  },
  {
    id: 'crypto',
    title: 'Crypto',
    direction: 'canvas',
    navigation: 'top-bar',
    description:
      'A wallet on a grey canvas: a swap form, the balance with a chart, transactions and a distribution.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A product analytics overview: a period switch, four key figures with their change, a trend chart and the top pages.',
  },
  {
    id: 'sales-overview',
    title: 'Sales overview',
    direction: 'canvas',
    navigation: 'top-bar',
    description:
      'Sales against target on a grey canvas: key figures with their progress to target, the pipeline by stage and the deals closing this month.',
  },
  {
    id: 'customers',
    title: 'Customers',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A list of customers to work through: segment tabs, search and filters, a table with selection and actions on the selected rows.',
  },
  {
    id: 'customer-detail',
    title: 'Customer detail',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'One customer’s record on a raised page: a header with actions, key facts, tabs over open deals and an activity timeline.',
  },
  {
    id: 'billing',
    title: 'Billing',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A workspace’s plan and usage on a raised page: usage against limits, the payment method, a failed payment to retry and the invoices.',
  },
  {
    id: 'invoice',
    title: 'Invoice',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'One invoice as a document on a raised page: who bills whom, the lines and totals, how it was paid, and downloading or sending it.',
  },
  {
    id: 'settings',
    title: 'Settings',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'Workspace settings: a list of sections beside forms for the profile, the workspace and notifications, and a danger zone.',
  },
  {
    id: 'team',
    title: 'Team',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'The people in a workspace: members with their roles, pending invitations and inviting someone new.',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A first run on a raised page: a welcome, a setup checklist with progress, and the next best actions.',
  },
  {
    id: 'empty-list',
    title: 'Empty list',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A list before its first record: an empty state that explains what will appear and how to add or import the first one, and the same list with no search results.',
  },
  {
    id: 'no-access',
    title: 'No access',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'A page the viewer may not open: who owns it, why it is closed and a way to request access.',
  },
  {
    id: 'not-found',
    title: 'Not found',
    direction: 'inset',
    navigation: 'none',
    description: 'A missing page before or outside the app: what happened and the ways back.',
  },
  {
    id: 'forgot-password',
    title: 'Forgot password',
    direction: 'inset',
    navigation: 'none',
    description:
      'Resetting a password in the sign-in card: the e-mail field, then a confirmation that the link is on its way.',
  },
  {
    id: 'check-email',
    title: 'Check your e-mail',
    direction: 'inset',
    navigation: 'none',
    description:
      'The sign-in card after a magic link was sent: where it went, how long it works, and resending it.',
  },
  {
    id: 'two-factor',
    title: 'Two-factor code',
    direction: 'inset',
    navigation: 'none',
    description:
      'The second sign-in step in the sign-in card: a six-digit code, a trusted-device option and backup ways in.',
  },
  {
    id: 'sso-sign-in',
    title: 'Single sign-on',
    direction: 'inset',
    navigation: 'none',
    description:
      'Signing in through an identity provider in the sign-in card: Google, Microsoft and a work e-mail for SAML.',
  },
  {
    id: 'accept-invite',
    title: 'Accept invitation',
    direction: 'inset',
    navigation: 'none',
    description:
      'Joining a workspace from an invitation in the sign-in card: who invited you, the workspace and creating your account.',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A workspace’s integrations as a settings page: search and categories, the connected apps in a table with their status, the ones to add as tiles, and connecting one in a side panel.',
  },
  {
    id: 'plans',
    title: 'Plans',
    direction: 'flat',
    navigation: 'takeover',
    description:
      'Choosing a plan over the app: monthly or yearly, three plans side by side, and a feature comparison.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'An inbox of notifications: unread first, grouped by day, filters, and acting on one without leaving.',
  },
  {
    id: 'report',
    title: 'Report',
    direction: 'canvas',
    navigation: 'sidebar',
    description:
      'A report on a grey canvas: a date range and an export above key figures, charts and a breakdown table, each in its own white section.',
  },
  {
    id: 'home',
    title: 'Home',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A workspace home on a raised page: today’s tasks to tick off with their progress, the deals to move this week, the next meetings and recently opened records.',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A revenue dashboard on a raised page: a period control over four key figures with their change, a trend against the period before, revenue by owner and progress to the quarter’s goal, split by lines instead of cards.',
  },
  {
    id: 'page-states',
    title: 'Page states',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A customer overview with its four modules in the four states a module can be in: loaded, loading, empty and failed with a working Retry, under one page-wide notice.',
  },
  {
    id: 'order-confirmation',
    title: 'Order confirmation',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'The page after a plan upgrade on a raised page: a quiet confirmation with the next charge, the receipt, two next steps and the way back to the workspace.',
  },
  {
    id: 'checkout',
    title: 'Checkout',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Paying for a plan change on a raised page: the plan with seats and add-ons, the billing period, payment method and billing details as tiles, beside a summary with a promo code that reprices as the order changes.',
  },
  {
    id: 'send-payment',
    title: 'Send payment',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Sending a payment on a raised page: one narrow card that is the form, then the review before anything moves, then the receipt, with recent transfers beside it and a confirmation only above a stated limit.',
  },
  {
    id: 'orders',
    title: 'Orders',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'The order history on a raised page: search, a status filter, a date range and a sort over a table that pages, each row opening its order, with a refund dialog from the row’s menu that changes its status.',
  },
  {
    id: 'order-detail',
    title: 'Order detail',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'One order on a raised page: its items and totals, the delivery as a timeline with the current step marked beside the courier’s facts, the customer and addresses in a side column, and refunding it from the header.',
  },
  {
    id: 'referrals',
    title: 'Referrals',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A referral programme on a raised page: the deal in one line, the link to copy and an invite by e-mail, the credit earned and available beside progress to the next reward, the people invited with their status, and redeeming credit against the next invoice in a confirm dialog.',
  },
  {
    id: 'cancel-subscription',
    title: 'Cancel subscription',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Cancelling a plan on a raised page, in one narrow column: what happens and what is lost, an optional reason, one alternative that fits it, and the only red button; then the result in place, with the way to undo it.',
  },
  {
    id: 'inbox',
    title: 'Inbox',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Mail with customers on a raised page: a searchable list of conversations beside the open one, its earlier messages folded to a line, with archive, star and a reply in place.',
  },
  {
    id: 'chat',
    title: 'Chat',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Team chat on a raised page: channels and people in a narrow column, then the open thread grouped by day and sender, with a shared file, a quoted reply, reactions and the composer.',
  },
  {
    id: 'activity-feed',
    title: 'Activity feed',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A workspace feed on a raised page: a composer, the posts with their likes and comments split by lines, and who to follow beside them.',
  },
  {
    id: 'reviews',
    title: 'Reviews',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Customer reviews on a raised page: the average and its spread, the reviews to filter, sort and answer, and a dialog to request one.',
  },
  {
    id: 'goals',
    title: 'Goals',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Team goals on a raised page: each goal’s figure against its target with one bar, a judged state and key results to tick off, then the quarter’s leaderboard with your row selected and the milestones reached, and a dialog to add a goal.',
  },
  {
    id: 'profile',
    title: 'Profile',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A teammate’s profile on a raised page: who they are and their local time, Follow as the one filled button, followers and following that open a list, their open deals and recent activity beside how to reach them and what they reached this year.',
  },
  {
    id: 'access-requests',
    title: 'Access requests',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Who gets into a workspace, on a raised page: requests to approve with a role or decline, one by one or in an action bar, invitations to resend or revoke, and the people blocked, each answer undoable from its toast.',
  },
  {
    id: 'account-settings',
    title: 'Account settings',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A person’s own settings on a raised page, each section’s title beside its controls: profile and a verified e-mail, language and region, a theme that switches, notifications, sign-in and sessions, and deleting the account behind a typed confirmation.',
  },
  {
    id: 'help-center',
    title: 'Help center',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'Help inside the product on a raised page: a search that turns the page into its matches, the topics as tiles, popular articles and the ways to reach support.',
  },
  {
    id: 'article',
    title: 'Article',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A help article on a raised page: the text in a reading column with steps, a note, a table and code, the contents following the scroll, whether it helped and what to read next.',
  },
  {
    id: 'lesson',
    title: 'Lesson',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A course lesson on a raised page: the video with its chapters, the course outline with progress, and a short quiz at the end that completes the lesson.',
  },
  {
    id: 'recording',
    title: 'Recording',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A call recording on a raised page: who spoke when, the transcript that follows the player, highlights and comments at a moment, and a voice note.',
  },
];

/** A part that opens over a screen. It belongs to no direction: it keeps its own look over any. */
export type PanelMeta = {
  /** Folder name and URL segment. */
  id: string;
  title: string;
  /** One sentence: what the panel holds, so a reader knows when to start from it. */
  description: string;
};

export const PANELS: PanelMeta[] = [
  {
    id: 'task-sidepanel',
    title: 'Task side panel',
    description:
      'A record’s detail beside the page: its properties, subtasks, tabs over an activity timeline, and keyboard hints.',
  },
  {
    id: 'modal-form',
    title: 'Form modal',
    description:
      'A short form in a modal: its fields, a consent to tick, the actions in the footer and keyboard hints under them.',
  },
  {
    id: 'modal-stepper',
    title: 'Stepper modal',
    description:
      'A setup in steps in a modal: the steps down the left with their state, the current step’s form beside them.',
  },
  {
    id: 'modal-details',
    title: 'Details modal',
    description:
      'A record read in a modal: its key facts and actions, tabs over its history, and moving to the previous or next record.',
  },
  {
    id: 'modal-task',
    title: 'Task modal',
    description:
      'A task opened in a modal: its properties and progress, subtasks to tick off, and tabs over the activity log.',
  },
  {
    id: 'modal-search',
    title: 'Search modal',
    description:
      'Search across the workspace in a modal: the query, result tabs, and results to move through by keyboard.',
  },
  {
    id: 'modal-access',
    title: 'Access modal',
    description:
      'Sharing in a modal: inviting by e-mail with a role, who has access and their roles, a private switch and the link.',
  },
];

export const DIRECTION_TITLE: Record<BlockDirection, string> = {
  flat: 'Flat',
  frame: 'Frame',
  inset: 'Inset',
  canvas: 'Canvas',
};

export const NAVIGATION_TITLE: Record<BlockNavigation, string> = {
  sidebar: 'Sidebar',
  rail: 'Rail and sidebar',
  'top-bar': 'Top bar',
  takeover: 'Takeover',
  none: 'No navigation',
};
