import { Avatar, type AvatarProps } from '@wideset/react';

import type { App } from './data';

/**
 * An app's logo as a square `Avatar`: its Remix brand icon on the neutral tile, or its initials.
 * Decorative: the app's name always sits beside it.
 */
export function AppLogo({ app, size }: { app: App; size: AvatarProps['size'] }) {
  return 'icon' in app.logo ? (
    <Avatar shape="square" size={size} icon={<app.logo.icon />} aria-hidden />
  ) : (
    <Avatar
      shape="square"
      size={size}
      initials={app.logo.initials}
      color={app.logo.color}
      aria-hidden
    />
  );
}
