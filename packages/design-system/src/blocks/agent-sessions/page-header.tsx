// TODO(custom): page header (title, a line of description); no PageHeader in Wideset.

/**
 * The page's header: its title and one line saying what the page is for. It has no action of its
 * own: New session is in the sidebar, and the filled button belongs to the session that waits.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-2 flex min-w-0 flex-col">
      <h1 className="typography-subtitle-md text-ws-static-strong">Sessions</h1>
      <p className="typography-body-md text-ws-static-subtle">
        Every Code session across your repositories. The ones that need you come first.
      </p>
    </header>
  );
}
