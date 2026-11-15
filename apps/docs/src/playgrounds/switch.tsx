import { Switch } from '@wideset/react';

import { attrs, playground } from '../lib/playground-kit';

/**
 * Size and label position come from `SwitchProps`. The checked state and `disabled` (both
 * from Radix) are written by hand. `defaultChecked` is read once, so the stage remounts the
 * switch when it flips.
 */
export default playground({
  from: 'SwitchProps',
  content: [
    { key: 'checked', label: 'Checked', type: 'switch', default: true, group: 'State' },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <Switch
      key={String(v.checked)}
      {...props()}
      defaultChecked={Boolean(v.checked)}
      disabled={Boolean(v.disabled)}
    >
      <Switch.Label>Email notifications</Switch.Label>
    </Switch>
  ),
  code: (v, { attrs: generated }) => {
    const state = attrs([
      ['defaultChecked', v.checked, false],
      ['disabled', v.disabled, false],
    ]);
    return `<Switch${generated()}${state ? ` ${state}` : ''}>
  <Switch.Label>Email notifications</Switch.Label>
</Switch>`;
  },
});
