// TODO(custom): page header (title and a line of description); no PageHeader in Wideset.

/**
 * The page's title and what it holds in one line. It has no action of its own: the only filled
 * button is Save changes, and it comes with the save bar once something changes.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-2 flex min-w-0 flex-col">
      <h1 className="typography-subtitle-md text-ws-static-strong">Account settings</h1>
      <p className="typography-body-md text-ws-static-subtle">
        Your profile, how Orbit looks and talks to you, and how you sign in. Only you see these.
      </p>
    </header>
  );
}
