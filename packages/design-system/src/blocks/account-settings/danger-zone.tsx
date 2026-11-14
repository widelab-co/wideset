import { useToast } from '@wideset/react';

import { DeactivateAccountModal } from './deactivate-account-modal';
import { DeleteAccountModal } from './delete-account-modal';
import { SettingRow } from './setting-row';
import { SettingsSection } from './settings-section';

/**
 * Leaving Orbit, kept last: deactivating (undone by signing in) above deleting (for good), each
 * in one line. Colour goes only on the delete button, the one action that cannot be undone.
 */
export function DangerZone({ email }: { email: string }) {
  const { showToast } = useToast();

  return (
    <SettingsSection
      title="Danger zone"
      description="Step away from Orbit for a while, or leave it for good."
    >
      <div className="gap-ws-11 flex flex-col">
        <SettingRow
          label="Deactivate account"
          description="Hides you from teammates until you sign in again."
        >
          <DeactivateAccountModal
            onDeactivate={() => showToast({ content: 'Your account is deactivated' })}
          />
        </SettingRow>
        <SettingRow label="Delete account" description="Removes your profile and notes for good.">
          <DeleteAccountModal
            email={email}
            onDelete={() => showToast({ content: 'Your account is deleted' })}
          />
        </SettingRow>
      </div>
    </SettingsSection>
  );
}
