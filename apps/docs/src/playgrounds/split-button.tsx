import { playground } from '../lib/playground-kit';

/**
 * Stage and code come from `examples/split-button/default.tsx`. Variant, style, size and both
 * disabled flags come from `SplitButtonProps`. The menu only opens on click, so its side and
 * alignment are hidden.
 */
export default playground({
  from: 'SplitButtonProps',
  hide: ['type', 'open', 'menuSide', 'menuAlign'],
  labels: { iconDisabled: 'Menu disabled' },
  group: { iconDisabled: 'State' },
  stage: (v) => (v.variant === 'inverse' ? 'bg-ws-static-inverse-background' : undefined),
});
