import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState, useSyncExternalStore } from 'react';

import { AccountMenu } from './account-menu';
import { accounts, type Theme, workspaces } from './data';
import { HomePage } from './home-page';
import { WorkspaceSidebar } from './sidebar';
import { SignedOut } from './signed-out';

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
 * Account menu (panel over Home, Inset direction): the menu from the account row at the foot of
 * the sidebar, open on load. Everything in it works: the workspace and the account switch what the
 * sidebar shows, the theme really turns the screen (the `dark` class on its root, and the menus
 * portal into that root so they turn with it; a real app sets it on <html> with `useTheme`), and
 * Log out leaves a signed-out card with the way back.
 */
export default function AccountMenuBlock() {
  const sidebarId = useId();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);
  const [workspaceId, setWorkspaceId] = useState(workspaces[0].id);
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [theme, setTheme] = useState<Theme>('system');
  const [signedOut, setSignedOut] = useState(false);
  const systemDark = useSystemDark();

  const dark = theme === 'dark' || (theme === 'system' && systemDark);
  const workspace = workspaces.find((item) => item.id === workspaceId) ?? workspaces[0];
  const account = accounts.find((item) => item.id === accountId) ?? accounts[0];

  return (
    <AppShell direction="inset" ref={setRoot} className={cn(dark && 'dark')}>
      {signedOut ? (
        <SignedOut
          email={account.email}
          workspace={workspace.name}
          onSignIn={() => setSignedOut(false)}
        />
      ) : (
        <>
          <WorkspaceSidebar
            id={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            workspace={workspace}
            account={account}
            accountMenu={
              <AccountMenu
                open={open}
                onOpenChange={setOpen}
                account={account}
                accounts={accounts}
                onAccountChange={setAccountId}
                workspace={workspace}
                workspaces={workspaces}
                onWorkspaceChange={setWorkspaceId}
                theme={theme}
                onThemeChange={setTheme}
                onLogOut={() => setSignedOut(true)}
                container={root}
              />
            }
          />
          <AppShell.Main>
            <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
              {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                  pulled left so its glyph, not its box, sits 20px from the edge; the crumbs
                  follow it. */}
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
                  <Breadcrumbs.Item>Home</Breadcrumbs.Item>
                </Breadcrumbs>
              </div>
            </div>

            <HomePage />
          </AppShell.Main>
        </>
      )}
    </AppShell>
  );
}
