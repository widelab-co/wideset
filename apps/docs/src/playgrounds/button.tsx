import { RiArrowRightLine, RiSparkling2Line } from '@remixicon/react';
import { Button } from '@wideset/react';

import { options, playground } from '../lib/playground-kit';

/**
 * Variant, style, size and disabled come from `ButtonProps`; this file only decides what
 * the types cannot: the label, where the icon goes, and the dark stage for `inverse`.
 */
export default playground({
  from: 'ButtonProps',
  // The native button type changes nothing on the stage.
  hide: ['type'],
  content: [
    {
      key: 'label',
      label: 'Label',
      type: 'select',
      options: options('Continue', 'Generate', 'Save', 'Delete'),
      default: 'Continue',
    },
    {
      key: 'icon',
      label: 'Icon',
      type: 'select',
      options: options('none', 'prefix', 'suffix'),
      default: 'none',
    },
  ],
  render: (v, { props }) => (
    <Button {...props()}>
      {v.icon === 'prefix' && <Button.Icon icon={RiSparkling2Line} />}
      {String(v.label)}
      {v.icon === 'suffix' && <Button.Icon icon={RiArrowRightLine} />}
    </Button>
  ),
  code: (v, { attrs }) => {
    const open = `<Button${attrs()}>`;
    if (v.icon === 'none') return `${open}${v.label}</Button>`;
    const icon =
      v.icon === 'prefix'
        ? `  <Button.Icon icon={RiSparkling2Line} />\n  ${v.label}`
        : `  ${v.label}\n  <Button.Icon icon={RiArrowRightLine} />`;
    return `${open}\n${icon}\n</Button>`;
  },
  // Every part at once, on a neutral button so the icon and the label read as parts.
  anatomy: () => (
    <Button variant="secondary" preset="border" size="lg">
      <Button.Icon icon={RiSparkling2Line} />
      <Button.TruncatedText>Generate report</Button.TruncatedText>
    </Button>
  ),
  stage: (v) => (v.variant === 'inverse' ? 'bg-ws-static-inverse-background' : undefined),
});
