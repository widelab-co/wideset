// TODO(custom): photo upload (Change, Remove) composed by hand, and a helper line holding an action (HelperText is not exported and takes text only).
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Avatar, Button, FormField, TextInput } from '@wideset/react';
import { useRef } from 'react';

import { account, type AccountValues, type FieldErrors } from './data';
import { SettingsSection } from './settings-section';
import { TextButton } from './text-button';

/**
 * Who Maya is to her teammates: photo, name, job title and the e-mail she signs in with, saved
 * with the save bar. The address carries its state: Verified as a quiet mark beside its label;
 * a new address does not replace it until the link sent to it is opened, and until then the line
 * under the field says so, with Resend.
 */
export function ProfileSection({
  values,
  errors,
  onChange,
  confirmedEmail,
  pendingEmail,
  onResend,
}: {
  values: AccountValues;
  errors: FieldErrors;
  onChange: (patch: Partial<AccountValues>) => void;
  /** The address Maya signs in with now. */
  confirmedEmail: string;
  /** A new address waiting for its confirmation link to be opened. */
  pendingEmail: string | null;
  onResend: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const editing = values.email !== confirmedEmail;
  const waiting = pendingEmail !== null && !editing && !errors.email;

  return (
    <SettingsSection title="Profile" description="How you appear to your teammates in Orbit.">
      <div className="gap-ws-11 flex flex-col">
        <FormField label="Photo" id="account-photo-label">
          <div
            role="group"
            aria-labelledby="account-photo-label"
            className="gap-ws-9 flex items-center"
          >
            {values.photo ? (
              <Avatar size="xl" src={values.photo} alt={values.name} initials={account.initials} />
            ) : (
              <Avatar size="xl" initials={account.initials} color={account.color} />
            )}
            <div className="gap-ws-5 flex">
              <Button
                id="account-photo"
                size="sm"
                variant="secondary"
                preset="border"
                onClick={() => fileInput.current?.click()}
              >
                {values.photo ? 'Change photo' : 'Upload photo'}
              </Button>
              {values.photo && (
                <Button
                  size="sm"
                  variant="secondary"
                  preset="ghost"
                  onClick={() => onChange({ photo: null })}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onChange({ photo: URL.createObjectURL(file) });
                event.target.value = '';
              }}
            />
          </div>
        </FormField>

        <FormField label="Name" htmlFor="account-name" errorText={errors.name}>
          <TextInput
            id="account-name"
            size="sm"
            required
            autoComplete="name"
            variant={errors.name ? 'danger' : 'primary'}
            value={values.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </FormField>

        <FormField label="Job title" htmlFor="account-jobTitle" suffix="(optional)">
          <TextInput
            id="account-jobTitle"
            size="sm"
            autoComplete="organization-title"
            value={values.jobTitle}
            onChange={(event) => onChange({ jobTitle: event.target.value })}
          />
        </FormField>

        <FormField
          label="E-mail"
          htmlFor="account-email"
          aside={
            editing ? undefined : (
              <span className="gap-ws-2 flex items-center">
                <RiCheckboxCircleFill
                  aria-hidden="true"
                  className="size-ws-8 text-ws-semantic-positive"
                />
                Verified
              </span>
            )
          }
          helperText={
            errors.email || waiting
              ? undefined
              : editing
                ? 'We send a link to the new address; it takes over once the link is opened.'
                : 'You sign in with it, and notifications go here.'
          }
          errorText={errors.email}
        >
          <TextInput
            id="account-email"
            type="email"
            size="sm"
            required
            autoComplete="email"
            variant={errors.email ? 'danger' : 'primary'}
            value={values.email}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </FormField>
        {waiting && (
          // Drawn as FormField's helper line, which cannot hold a button.
          <p role="status" className="typography-body-sm text-ws-static-subtle py-ws-3 -mt-ws-8">
            Check your inbox at {pendingEmail} to confirm the new address.{' '}
            <TextButton onClick={onResend}>Resend</TextButton>
          </p>
        )}
      </div>
    </SettingsSection>
  );
}
