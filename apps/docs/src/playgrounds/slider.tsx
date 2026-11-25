import { Slider } from '@wideset/react';

import { attrs, playground, type Values } from '../lib/playground-kit';

const startValue = (v: Values) => (v.range ? '[20, 80]' : '[40]');

/** `defaultValue` is read once, so the stage remounts the slider when the range switch flips. */
export default playground({
  from: 'SliderProps',
  hide: ['type', 'labels'],
  content: [
    { key: 'range', label: 'Range', type: 'switch', default: false },
    { key: 'tooltip', label: 'Value tooltip', type: 'switch', default: false },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => (
    <div className="w-[20rem] max-w-full">
      <Slider
        key={String(v.range)}
        {...props()}
        defaultValue={v.range ? [20, 80] : [40]}
        showTooltipValue={Boolean(v.tooltip)}
        disabled={Boolean(v.disabled)}
      />
    </div>
  ),
  // `defaultValue` sits among the generated props, and the tag breaks onto lines once it is long.
  code: (v) => {
    const props = [
      `defaultValue={${startValue(v)}}`,
      attrs([['showTooltipValue', v.tooltip, false]]),
      attrs([['disabled', v.disabled, false]]),
    ].filter(Boolean);
    return props.join(' ').length > 70
      ? `<Slider\n${props.map((p) => `  ${p}`).join('\n')}\n/>`
      : `<Slider ${props.join(' ')} />`;
  },
});
