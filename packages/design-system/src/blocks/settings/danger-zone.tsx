import { useToast } from '@wideset/react';

import { DeleteWorkspaceModal } from './delete-workspace-modal';
import { SectionHeader } from './section-header';
import { SettingRow } from './setting-row';

/** What cannot be undone, kept last and apart; colour only on the action itself. */
export function DangerZone({ workspaceName }: { workspaceName: string }) {
  const { showToast } = useToast();
  return (
    <section aria-labelledby="settings-danger-title" className="gap-ws-12 flex flex-col">
      <SectionHeader id="settings-danger-title" title="Danger zone" />
      <SettingRow
        label="Delete workspace"
        description="Every customer, deal and invoice in it goes too."
      >
        <DeleteWorkspaceModal
          workspaceName={workspaceName}
          onDelete={() => showToast({ status: 'success', content: `${workspaceName} deleted` })}
        />
      </SettingRow>
    </section>
  );
}
