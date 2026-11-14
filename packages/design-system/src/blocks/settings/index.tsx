import { AppShell, ToastProvider } from '@wideset/react';
import { useState } from 'react';

import { general, notifications, type SectionId, sectionRows, sections } from './data';
import { GeneralSettings } from './general-settings';
import { NotificationsSection } from './notifications-section';
import { SectionPage } from './section-page';
import { SettingsNav } from './settings-nav';
import { SettingsPage } from './settings-page';
import { AppSidebar } from './sidebar';

/**
 * Settings (Frame direction): the tinted app sidebar, then the page: the settings section list
 * beside the open section's form. Every section stays mounted while another is open, so a draft
 * or a flipped switch survives the switch.
 */
export default function Settings() {
  const [open, setOpen] = useState<SectionId>('general');
  // What the server holds; the General page edits a draft of it.
  const [saved, setSaved] = useState(general);
  const [notify, setNotify] = useState(() =>
    Object.fromEntries(notifications.map(({ id, on }) => [id, on])),
  );
  const flip = (id: string, on: boolean) => setNotify((current) => ({ ...current, [id]: on }));

  return (
    <ToastProvider position="bottom-center">
      <AppShell direction="frame">
        <AppSidebar workspaceName={saved.name} email={saved.email} />
        <AppShell.Main className="flex">
          <SettingsNav active={open} onSelect={setOpen} />
          {sections.map(({ id, label, description }) =>
            id === 'general' ? (
              <GeneralSettings
                key={id}
                hidden={open !== id}
                saved={saved}
                onSave={setSaved}
                notify={notify}
                onNotifyChange={flip}
              />
            ) : id === 'notifications' ? (
              <SettingsPage key={id} title={label} description={description} hidden={open !== id}>
                <NotificationsSection email={saved.email} values={notify} onChange={flip} />
              </SettingsPage>
            ) : (
              <SectionPage
                key={id}
                title={label}
                description={description}
                rows={sectionRows[id]}
                hidden={open !== id}
              />
            ),
          )}
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
