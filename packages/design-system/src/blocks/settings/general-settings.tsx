import { Divider, useToast } from '@wideset/react';
import { type FormEvent, useEffect, useId, useState } from 'react';

import { DangerZone } from './danger-zone';
import { type FieldErrors, general, type GeneralValues, sections } from './data';
import { NotificationsSection } from './notifications-section';
import { ProfileSection } from './profile-section';
import { SaveBar } from './save-bar';
import { SettingsPage } from './settings-page';
import { WorkspaceSection } from './workspace-section';

/** The fields in the order they appear, so the first wrong one gets the focus. */
const FIELDS = Object.keys(general) as (keyof GeneralValues)[];
const page = sections.find(({ id }) => id === 'general')!;

function validate(values: GeneralValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'Enter a name for the workspace.';
  if (!values.slug) errors.slug = 'Enter an address for the workspace.';
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug))
    errors.slug = 'Use lowercase letters, numbers and hyphens, like lumen-studio.';
  if (!values.fullName.trim()) errors.fullName = 'Enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    errors.email = 'Enter an e-mail address like sanne@lumen.studio.';
  return errors;
}

/**
 * The General page. The workspace and profile fields are one form with one save bar, shown only
 * while the draft differs from what is saved; the notification switches apply at once.
 */
export function GeneralSettings({
  hidden,
  saved,
  onSave,
  notify,
  onNotifyChange,
}: {
  hidden: boolean;
  saved: GeneralValues;
  onSave: (values: GeneralValues) => void;
  notify: Record<string, boolean>;
  onNotifyChange: (id: string, on: boolean) => void;
}) {
  const { showToast } = useToast();
  const formId = useId();
  const [draft, setDraft] = useState(saved);
  const [errors, setErrors] = useState<FieldErrors>({});
  const changes = FIELDS.filter((field) => draft[field] !== saved[field]).length;
  const dirty = changes > 0;

  // Closing the tab with unsaved changes asks first.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (patch: Partial<GeneralValues>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    // An error shown after a save goes as soon as its field is right; nothing new appears.
    const now = validate(next);
    setErrors((shown) => {
      const kept: FieldErrors = {};
      for (const field of FIELDS) if (shown[field] && now[field]) kept[field] = now[field];
      return kept;
    });
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(draft);
    setErrors(found);
    const first = FIELDS.find((field) => found[field]);
    if (first) {
      document.getElementById(`settings-${first}`)?.focus();
      return;
    }
    onSave(draft);
    showToast({ status: 'success', content: 'Changes saved' });
  };

  const cancel = () => {
    setDraft(saved);
    setErrors({});
  };

  return (
    <SettingsPage
      title={page.label}
      description={page.description}
      hidden={hidden}
      footer={dirty && <SaveBar form={formId} changes={changes} onCancel={cancel} />}
    >
      {/* Sections are split by a line: a long settings page, read in bands. */}
      <form id={formId} noValidate onSubmit={save} className="gap-ws-14 flex flex-col">
        <WorkspaceSection values={draft} errors={errors} onChange={update} />
        <Divider weight="thin" emphasis="subtle" />
        <ProfileSection values={draft} errors={errors} onChange={update} />
      </form>
      <Divider weight="thin" emphasis="subtle" />
      <NotificationsSection email={saved.email} values={notify} onChange={onNotifyChange} />
      <Divider weight="thin" emphasis="subtle" />
      <DangerZone workspaceName={saved.name} />
    </SettingsPage>
  );
}
