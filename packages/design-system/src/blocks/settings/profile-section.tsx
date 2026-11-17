import { FormField, TextInput } from '@wideset/react';

import { account, type FieldErrors, type GeneralValues } from './data';
import { SectionHeader } from './section-header';

/** The signed-in user's name and e-mail, saved with the save bar; the role is read-only. */
export function ProfileSection({
  values,
  errors,
  onChange,
}: {
  values: GeneralValues;
  errors: FieldErrors;
  onChange: (patch: Partial<GeneralValues>) => void;
}) {
  return (
    <section aria-labelledby="settings-profile-title" className="gap-ws-12 flex flex-col">
      <SectionHeader id="settings-profile-title" title="Your profile" />

      <div className="gap-ws-11 flex flex-col">
        <FormField label="Full name" htmlFor="settings-fullName" errorText={errors.fullName}>
          <TextInput
            id="settings-fullName"
            size="sm"
            required
            autoComplete="name"
            variant={errors.fullName ? 'danger' : 'primary'}
            value={values.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
          />
        </FormField>

        <FormField
          label="E-mail"
          htmlFor="settings-email"
          helperText="You sign in with it, and notifications go here."
          errorText={errors.email}
        >
          <TextInput
            id="settings-email"
            type="email"
            size="sm"
            required
            autoComplete="email"
            variant={errors.email ? 'danger' : 'primary'}
            value={values.email}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </FormField>

        <FormField
          label="Role"
          htmlFor="settings-role"
          helperText="Only another owner can change your role."
        >
          <TextInput id="settings-role" size="sm" disabled readOnly value={account.role} />
        </FormField>
      </div>
    </section>
  );
}
