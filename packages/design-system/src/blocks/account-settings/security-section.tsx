import { Button, useToast } from '@wideset/react';

import { ActiveSessions } from './active-sessions';
import { account, security } from './data';
import { formatDate } from './format';
import { LinkedAccounts } from './linked-accounts';
import { SettingRow } from './setting-row';
import { SettingsSection } from './settings-section';

/**
 * How Maya gets in and where she is in now: the password and two-factor first, then the linked
 * sign-in providers, then her sessions. Everything here acts at once (or e-mails a link), so the
 * section has no part in the save bar.
 */
export function SecuritySection() {
  const { showToast } = useToast();

  return (
    <SettingsSection
      title="Sign-in and security"
      description="How you sign in, and the devices you are signed in on now."
    >
      <div className="gap-ws-14 flex flex-col">
        <div className="gap-ws-11 flex flex-col">
          <SettingRow
            label="Password"
            description={`Last changed on ${formatDate(security.passwordChanged)}.`}
          >
            <Button
              size="sm"
              variant="secondary"
              preset="border"
              onClick={() =>
                showToast({
                  status: 'success',
                  content: `A link to change your password is on its way to ${account.email}`,
                })
              }
            >
              Change password
            </Button>
          </SettingRow>
          <SettingRow
            label="Two-factor authentication"
            description={`On, with ${security.twoFactor.method}. ${security.twoFactor.backupCodes} backup codes left.`}
          >
            <Button size="sm" variant="secondary" preset="border" asChild>
              <a href="#two-factor">Manage</a>
            </Button>
          </SettingRow>
        </div>
        <LinkedAccounts />
        <ActiveSessions />
      </div>
    </SettingsSection>
  );
}
