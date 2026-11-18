import { useId } from 'react';

import { notifications } from './data';
import { SectionHeader } from './section-header';
import { SwitchRow } from './switch-row';

/**
 * E-mail notifications, one switch each. A switch applies the moment it flips, so this section
 * stays out of the save bar (and says so).
 */
export function NotificationsSection({
  email,
  values,
  onChange,
}: {
  email: string;
  values: Record<string, boolean>;
  onChange: (id: string, on: boolean) => void;
}) {
  // Rendered on two pages (General and Notifications), so the title's id is generated.
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="gap-ws-12 flex flex-col">
      <SectionHeader
        id={titleId}
        title="E-mail notifications"
        description={`Sent to ${email}. Each switch applies right away.`}
      />
      <ul className="gap-ws-11 flex flex-col">
        {notifications.map(({ id, label, description }) => (
          <li key={id}>
            <SwitchRow
              label={label}
              description={description}
              checked={values[id]}
              onCheckedChange={(on) => onChange(id, on)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
