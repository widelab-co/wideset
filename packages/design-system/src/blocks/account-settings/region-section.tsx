import { FormField, Select } from '@wideset/react';

import { type AccountValues, formats, languages, timeZones } from './data';
import { formatExample } from './format';
import { SettingsSection } from './settings-section';

/**
 * The language Orbit speaks, the time zone it keeps and how it writes dates and numbers, saved
 * with the save bar. The format is easier to pick by sight than by name, so a line under it
 * shows today and an amount the way the current choice (and time zone) writes them.
 */
export function RegionSection({
  values,
  onChange,
}: {
  values: AccountValues;
  onChange: (patch: Partial<AccountValues>) => void;
}) {
  const example = formatExample(values.format, values.timeZone);

  return (
    <SettingsSection
      title="Language and region"
      description="The language Orbit uses, and how it writes times, dates and amounts."
    >
      <div className="gap-ws-11 flex flex-col">
        <FormField label="Language" htmlFor="account-language">
          <Select
            id="account-language"
            size="sm"
            className="w-full"
            options={languages}
            value={values.language}
            onValueChange={(language) => onChange({ language })}
          />
        </FormField>

        <FormField
          label="Time zone"
          htmlFor="account-timeZone"
          helperText="Due dates, reminders and the Monday digest follow it."
        >
          <Select
            id="account-timeZone"
            size="sm"
            className="w-full"
            hasSearch
            options={timeZones}
            value={values.timeZone}
            onValueChange={(timeZone) => onChange({ timeZone })}
          />
        </FormField>

        <FormField
          label="Date and number format"
          htmlFor="account-format"
          helperText={`Now reads ${example.when}; an amount reads ${example.amount}.`}
        >
          <Select
            id="account-format"
            size="sm"
            className="w-full"
            options={formats}
            value={values.format}
            onValueChange={(format) => onChange({ format })}
          />
        </FormField>
      </div>
    </SettingsSection>
  );
}
