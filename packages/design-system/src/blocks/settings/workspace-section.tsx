// TODO(custom): avatar upload (Change, Remove) composed by hand.
import { Avatar, Button, FormField, Select, TextInput } from '@wideset/react';
import { useRef } from 'react';

import { currencies, type FieldErrors, type GeneralValues, timeZones, workspace } from './data';
import { SectionHeader } from './section-header';

/** The workspace's logo, name, address and defaults; saved with the save bar. */
export function WorkspaceSection({
  values,
  errors,
  onChange,
}: {
  values: GeneralValues;
  errors: FieldErrors;
  onChange: (patch: Partial<GeneralValues>) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section aria-labelledby="settings-workspace-title" className="gap-ws-12 flex flex-col">
      <SectionHeader id="settings-workspace-title" title="Workspace" />

      <div className="gap-ws-11 flex flex-col">
        <FormField
          label="Logo"
          id="settings-logo-label"
          helperText="On invoices and e-mails to customers. Square, 256 px or more."
        >
          <div
            role="group"
            aria-labelledby="settings-logo-label"
            className="gap-ws-9 flex items-center"
          >
            {values.logo ? (
              <Avatar
                shape="square"
                size="xl"
                src={values.logo}
                alt={`${values.name} logo`}
                initials={workspace.initials}
              />
            ) : (
              <Avatar
                shape="square"
                size="xl"
                initials={workspace.initials}
                color={workspace.color}
              />
            )}
            <div className="gap-ws-5 flex">
              <Button
                id="settings-logo"
                size="sm"
                variant="secondary"
                preset="border"
                onClick={() => fileInput.current?.click()}
              >
                {values.logo ? 'Change logo' : 'Upload logo'}
              </Button>
              {values.logo && (
                <Button
                  size="sm"
                  variant="secondary"
                  preset="ghost"
                  onClick={() => onChange({ logo: null })}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onChange({ logo: URL.createObjectURL(file) });
                event.target.value = '';
              }}
            />
          </div>
        </FormField>

        <FormField label="Name" htmlFor="settings-name" errorText={errors.name}>
          <TextInput
            id="settings-name"
            size="sm"
            required
            autoComplete="organization"
            variant={errors.name ? 'danger' : 'primary'}
            value={values.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </FormField>

        <FormField
          label="URL"
          htmlFor="settings-slug"
          helperText="Changing it breaks links people have saved."
          errorText={errors.slug}
        >
          <TextInput
            id="settings-slug"
            size="sm"
            required
            autoComplete="off"
            spellCheck={false}
            variant={errors.slug ? 'danger' : 'primary'}
            value={values.slug}
            onChange={(event) =>
              onChange({ slug: event.target.value.toLowerCase().replace(/\s+/g, '-') })
            }
          >
            <TextInput.Prefix>orbit.app/</TextInput.Prefix>
            <TextInput.Input />
          </TextInput>
        </FormField>

        <FormField
          label="Currency"
          htmlFor="settings-currency"
          helperText="New deals and revenue reports use it."
        >
          <Select
            id="settings-currency"
            size="sm"
            className="w-full"
            options={currencies}
            value={values.currency}
            onValueChange={(currency) => onChange({ currency })}
          />
        </FormField>

        <FormField
          label="Time zone"
          htmlFor="settings-timeZone"
          helperText="Reports and the Monday digest follow it."
        >
          <Select
            id="settings-timeZone"
            size="sm"
            className="w-full"
            hasSearch
            options={timeZones}
            value={values.timeZone}
            onValueChange={(timeZone) => onChange({ timeZone })}
          />
        </FormField>
      </div>
    </section>
  );
}
