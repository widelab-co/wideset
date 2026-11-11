// TODO(custom): settings section (title and one line on the left, its controls on the right); no SettingsSection in Wideset.
import { type ReactNode, useId } from 'react';

/**
 * One band of the settings page: what it is, in a title and one line, on the left; its controls
 * in a 40rem column pinned to the page's right edge, so every section's controls (and the save
 * bar's buttons) end on the same line. Bands are split by a line, not boxed.
 */
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="gap-x-ws-16 gap-y-ws-9 border-ws-static-subtle pt-ws-14 first:pt-ws-0 grid grid-cols-1 justify-between border-t first:border-t-0 lg:grid-cols-[20rem_minmax(0,40rem)]"
    >
      <div className="gap-ws-3 flex flex-col">
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>
      <div className="flex min-w-0 flex-col">{children}</div>
    </section>
  );
}
