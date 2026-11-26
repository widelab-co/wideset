import { LinkButton, ListItem, SegmentedControl, Select, Switch } from '@wideset/react';
import { useId } from 'react';

import { PLAYGROUNDS, resetValues, setValues, useValues, withPlayground } from '../lib/playground';
import type { Control } from '../lib/playground-kit';

/**
 * Which control a prop gets, decided here from the definition's `select | switch`, with no change
 * to the playground files (the `wideset-component-docs` skill records the rule; this is its source):
 * - on/off (`switch`) is a Switch on its row;
 * - a choice of two or three short options (each label at most SHORT characters, a "None" counted)
 *   is a SegmentedControl across the panel: two named alternatives are never a switch, a switch
 *   cannot say which one is on;
 * - four or more options, or any long label, is a Select across the panel.
 * Options keep the definition's order, so a scale reads small to large in either.
 */
const SHORT = 10;
const segmented = (control: Control) =>
  control.type === 'select' &&
  control.options.length <= 3 &&
  control.options.every((option) => option.label.length <= SHORT);

const Field = ({ control, component }: { control: Control; component: string }) => {
  const id = useId();
  const values = useValues(component);
  const set = (value: string | boolean) => setValues(component, { [control.key]: value });
  const label = (
    <span id={id} className="typography-body-sm text-ws-static-subtle">
      {control.label}
    </span>
  );

  if (control.type === 'switch')
    return (
      <div className="flex h-ws-forms-sm items-center justify-between gap-ws-7">
        {label}
        <Switch
          size="sm"
          checked={Boolean(values[control.key])}
          onCheckedChange={set}
          aria-labelledby={id}
        />
      </div>
    );

  const value = String(values[control.key]);
  return (
    <div className="flex flex-col gap-ws-3">
      {label}
      {segmented(control) ? (
        <SegmentedControl
          size="sm"
          variant="fullWidth"
          value={value}
          // A segmented control has no empty choice: pressing the current one keeps it.
          onValueChange={(next) => next && set(next)}
          aria-labelledby={id}
        >
          {control.options.map((option) => (
            <SegmentedControl.Item key={option.value} value={option.value}>
              {option.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      ) : (
        <Select value={value} onValueChange={set}>
          <Select.Trigger size="sm" className="w-full" aria-labelledby={id}>
            <span className="truncate">
              {control.options.find((option) => option.value === value)?.label}
            </span>
          </Select.Trigger>
          <Select.Content>
            {control.options.map((option) => (
              <Select.Option key={option.value} value={option.value} textValue={option.label}>
                <ListItem.Label>{option.label}</ListItem.Label>
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      )}
    </div>
  );
};

/**
 * The Playground's Properties: the definition's groups (Appearance, Content,
 * State…), each under its title, apart by space alone; in a group each label sits above its
 * control, controls run the panel's width at the small size.
 */
const PropertiesPanel = ({ component }: { component: string }) => {
  const definition = PLAYGROUNDS[component];
  const values = useValues(component);
  const changed = Object.keys(definition.defaults).some(
    (key) => values[key] !== definition.defaults[key],
  );
  if (!definition.groups.length) return null;

  const reset = changed && (
    <LinkButton size="sm" variant="secondary" onClick={() => resetValues(component)}>
      Reset
    </LinkButton>
  );

  // No visible heading: the first group's title is the top of the panel, padded as its sides;
  // the panel is named for assistive technology. No lines inside: groups part by space, a
  // clearly larger step than between controls; a group's title is its strongest text, the field
  // labels the quietest. Reset sits on the first title's row. The panel is a subtle card in the
  // same tone as the preview's stage.
  return (
    <section
      aria-label="Properties"
      className="flex flex-col gap-ws-14 rounded-ws-container-lg bg-ws-static-alpha-subtle p-ws-9"
    >
      {definition.groups.map((group, index) => (
        <div
          key={group.title}
          role="group"
          aria-label={group.title}
          className="flex flex-col gap-ws-7"
        >
          <div className="flex h-ws-forms-xs items-center justify-between gap-ws-7">
            <h3 className="typography-label-strong-sm text-ws-static-strong">{group.title}</h3>
            {index === 0 && reset}
          </div>
          <div className="flex flex-col gap-ws-7">
            {group.controls.map((control) => (
              <Field key={control.key} control={control} component={component} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default withPlayground(PropertiesPanel);
