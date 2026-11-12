// TODO(custom): page header (title, a line of description); no PageHeader in Wideset.
import { contact } from './data';

/** The page's title and one line on where the times come from. No actions: the card holds them. */
export function PageHeader() {
  const firstName = contact.name.split(' ')[0];

  return (
    <header className="gap-ws-2 flex min-w-0 flex-col">
      <h1 className="typography-subtitle-md text-ws-static-strong">
        Book a meeting with {contact.name}
      </h1>
      <p className="typography-body-md text-ws-static-subtle">
        The times are the free time {firstName} shared with Lumen Studio. Orbit sends her the
        invitation once you book.
      </p>
    </header>
  );
}
