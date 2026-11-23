import { cn } from 'src/lib/utils';

/** Checkbox and radio surface fill when their state changes. */
export const boxFillMotion =
  'transition-[background-color,border-color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)';

/** Base transitions for hover tint and returning from interaction states. */
export const hoverTintMotion =
  'transition-[background-color,border-color,color,box-shadow,scale,opacity] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)';

/** Compose with hoverTintMotion for press feedback and a smooth release. */
export const pressMotion = cn(
  'active:not-disabled:not-aria-disabled:duration-(--ws-motion-duration-micro)',
  'active:not-disabled:not-aria-disabled:scale-(--ws-motion-scale-small)',
);

/** Button press feedback, excluding popup triggers. */
export const buttonPressMotion = cn(
  'not-[[aria-haspopup]:not([aria-haspopup=false])]:active:not-disabled:not-aria-disabled:duration-(--ws-motion-duration-micro)',
  'not-[[aria-haspopup]:not([aria-haspopup=false])]:active:not-disabled:not-aria-disabled:scale-(--ws-motion-scale-small)',
);

export const switchTrackMotion =
  'transition-[background-color] duration-(--ws-motion-duration-micro) ease-(--ws-motion-ease-out)';

export const switchThumbTravelMotion =
  'transition-[translate,width,height] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)';

export const fieldFocusMotion =
  'transition-[border-color,box-shadow,background-color,color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)';

export const fieldShakeMotion =
  'data-[shake=true]:animate-[ws-field-shake_calc(var(--ws-motion-duration-micro)*3.5)_linear]';

export const fieldShakeWithinMotion =
  'has-data-[shake=true]:animate-[ws-field-shake_calc(var(--ws-motion-duration-micro)*3.5)_linear]';

export const sidebarCollapseMotion =
  'transition-[width] duration-(--ws-motion-duration-slow) ease-(--ws-motion-ease-smooth-out)';

export const fillTravelMotion =
  'transition-transform duration-(--ws-motion-duration-medium) ease-(--ws-motion-ease-smooth-out)';
