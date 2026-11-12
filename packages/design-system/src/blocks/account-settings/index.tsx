import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { type FormEvent, useEffect, useId, useState, useSyncExternalStore } from 'react';

import { AppearanceSection } from './appearance-section';
import { DangerZone } from './danger-zone';
import {
  type AccountValues,
  type FieldErrors,
  notifications,
  saved as initialValues,
  type Theme,
} from './data';
import { NotificationsSection } from './notifications-section';
import { PageHeader } from './page-header';
import { ProfileSection } from './profile-section';
import { RegionSection } from './region-section';
import { SaveBar } from './save-bar';
import { SecuritySection } from './security-section';
import { AccountSidebar } from './sidebar';

/** One column of the page: the header, the sections and the save bar share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** The fields in the order they appear, so the first wrong one gets the focus. */
const FIELDS = Object.keys(initialValues) as (keyof AccountValues)[];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: AccountValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'Enter your name.';
  if (!EMAIL.test(values.email.trim()))
    errors.email = 'Enter an e-mail address like maya@lumenstudio.co.';
  return errors;
}

/**
 * Whether the device asks for dark, kept in step with it. Where there is no `matchMedia` (a test
 * runner, an old browser) the answer is light and nothing is watched.
 */
const DARK_QUERY = '(prefers-color-scheme: dark)';
const darkQuery = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_QUERY)
    : null;
const subscribe = (onChange: () => void) => {
  const query = darkQuery();
  query?.addEventListener('change', onChange);
  return () => query?.removeEventListener('change', onChange);
};
const useSystemDark = () =>
  useSyncExternalStore(
    subscribe,
    () => darkQuery()?.matches ?? false,
    () => false,
  );

/**
 * The page inside the card, under the toasts. Profile and language and region are one form with
 * one save bar, up only while the draft differs from what is saved; the theme, the switches and
 * everything in security apply at once.
 */
function AccountPage({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const { showToast } = useToast();
  const formId = useId();
  // What the server holds; the form edits a draft of it.
  const [stored, setStored] = useState(initialValues);
  const [draft, setDraft] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [notify, setNotify] = useState(() =>
    Object.fromEntries(notifications.map(({ id, on }) => [id, on])),
  );
  const changes = FIELDS.filter((field) => draft[field] !== stored[field]).length;
  const dirty = changes > 0;

  // Closing the tab with unsaved changes asks first.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (patch: Partial<AccountValues>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    // An error shown after a save goes as soon as its field is right; nothing new appears.
    const now = validate(next);
    setErrors((shown) => {
      const kept: FieldErrors = {};
      for (const field of FIELDS) if (shown[field] && now[field]) kept[field] = now[field];
      return kept;
    });
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(draft);
    setErrors(found);
    const first = FIELDS.find((field) => found[field]);
    if (first) {
      document.getElementById(`account-${first}`)?.focus();
      return;
    }
    const email = draft.email.trim().toLowerCase();
    // A new address takes over only once the link sent to it is opened.
    const next = { ...draft, email: stored.email };
    if (email !== stored.email) setPendingEmail(email);
    setStored(next);
    setDraft(next);
    showToast({ status: 'success', content: 'Changes saved' });
  };

  return (
    <>
      {/* The page scrolls inside the card, so the card's corners stay put. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
          <PageHeader />
          <div className="gap-ws-14 flex flex-col">
            <form id={formId} noValidate onSubmit={save} className="gap-ws-14 flex flex-col">
              <ProfileSection
                values={draft}
                errors={errors}
                onChange={update}
                confirmedEmail={stored.email}
                pendingEmail={pendingEmail}
                onResend={() =>
                  showToast({ content: `Confirmation link sent again to ${pendingEmail}` })
                }
              />
              <RegionSection values={draft} onChange={update} />
            </form>
            <AppearanceSection theme={theme} onThemeChange={onThemeChange} />
            <NotificationsSection
              values={notify}
              onChange={(id, on) => setNotify({ ...notify, [id]: on })}
            />
            <SecuritySection />
            <DangerZone email={stored.email} />
          </div>
        </div>
      </div>
      {dirty && (
        <SaveBar
          form={formId}
          changes={changes}
          onCancel={() => {
            setDraft(stored);
            setErrors({});
          }}
        />
      )}
    </>
  );
}

/**
 * Account settings (Inset direction): Maya's own account on the raised page beside the workspace
 * sidebar, reached from the account menu, so no sidebar page is active. One calm column of
 * sections, each a title and a line beside its controls: profile, language and region,
 * appearance, notifications, sign-in and security, and the danger zone. The theme really turns
 * the screen: the `dark` class on its root re-points every token under it (a real app sets it
 * on <html> with `useTheme`, so menus and dialogs, which open outside the screen, follow too).
 */
export default function AccountSettings() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const systemDark = useSystemDark();
  const dark = theme === 'dark' || (theme === 'system' && systemDark);

  return (
    <ToastProvider position="bottom-center">
      <div className={cn('bg-ws-static-background flex h-dvh', dark && 'dark')}>
        <AccountSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
            <div className="gap-ws-5 px-ws-11 flex w-full items-center">
              <IconButton
                icon={RiSideBarLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-subtle size-ws-9"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls={sidebarId}
                onClick={() => setCollapsed(!collapsed)}
                className="-ml-ws-5"
              />
              <Breadcrumbs separator="arrow">
                <Breadcrumbs.Item asChild>
                  <a href="#account">Account</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          <AccountPage theme={theme} onThemeChange={setTheme} />
        </main>
      </div>
    </ToastProvider>
  );
}
