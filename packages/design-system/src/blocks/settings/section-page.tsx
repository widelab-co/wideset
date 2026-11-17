import { Button } from '@wideset/react';

import type { SettingRowData } from './data';
import { SettingRow } from './setting-row';
import { SettingsPage } from './settings-page';
import { SwitchRow } from './switch-row';

/** A shorter section (Members, Billing, Security…): its settings as rows of switches and actions. */
export function SectionPage({
  title,
  description,
  rows,
  hidden,
}: {
  title: string;
  description: string;
  rows: SettingRowData[];
  hidden: boolean;
}) {
  return (
    <SettingsPage title={title} description={description} hidden={hidden}>
      <ul className="gap-ws-11 flex flex-col">
        {rows.map((row) => (
          <li key={row.id}>
            {row.kind === 'switch' ? (
              <SwitchRow label={row.label} description={row.description} defaultChecked={row.on} />
            ) : (
              <SettingRow label={row.label} description={row.description}>
                <Button size="sm" variant="secondary" preset="border">
                  {row.action}
                </Button>
              </SettingRow>
            )}
          </li>
        ))}
      </ul>
    </SettingsPage>
  );
}
