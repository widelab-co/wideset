import { RiArrowDownSLine, RiSendPlaneLine } from '@remixicon/react';
import { DropdownMenu, ListItem, SplitButton } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/** The anatomy's menu: never opened in the picture, so one item is enough. */
const menuContent = (
  <DropdownMenu.Item>
    <ListItem.Content>
      <ListItem.Label>Save as draft</ListItem.Label>
    </ListItem.Content>
  </DropdownMenu.Item>
);

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
  anatomy: () => (
    <SplitButton
      variant="secondary"
      preset="border"
      size="lg"
      icon={RiArrowDownSLine}
      menuContent={menuContent}
    >
      <SplitButton.Icon icon={RiSendPlaneLine} />
      <SplitButton.TruncatedText>Publish changes</SplitButton.TruncatedText>
    </SplitButton>
  ),
  stage: (v) => (v.variant === 'inverse' ? 'bg-ws-static-inverse-background' : undefined),
});
