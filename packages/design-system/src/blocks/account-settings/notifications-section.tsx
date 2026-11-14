import { account, notifications } from './data';
import { SettingsSection } from './settings-section';
import { SwitchRow } from './switch-row';

/**
 * What Orbit e-mails Maya about, one switch each. A switch applies the moment it flips, so the
 * section stays out of the save bar and its line says so.
 */
export function NotificationsSection({
  values,
  onChange,
}: {
  values: Record<string, boolean>;
  onChange: (id: string, on: boolean) => void;
}) {
  return (
    <SettingsSection
      title="Notifications"
      description={`E-mails to ${account.email}. Each switch applies right away.`}
    >
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
    </SettingsSection>
  );
}
