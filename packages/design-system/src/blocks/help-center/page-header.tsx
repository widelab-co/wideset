// TODO(custom): page header (title, a line of description); no PageHeader in Wideset.

/**
 * The page's title and what it is for. No actions on the right: the search under it is the
 * page's control, and the way to a person comes last.
 */
export function PageHeader() {
  return (
    <header className="gap-ws-2 flex min-w-0 flex-col items-center text-center">
      <h1 className="typography-title-md text-ws-static-strong">Help and support</h1>
      <p className="typography-body-md text-ws-static-subtle">
        Search the guides, browse a topic or talk to the support team.
      </p>
    </header>
  );
}
