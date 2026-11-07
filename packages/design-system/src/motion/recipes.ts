import { cn } from 'src/lib/utils';

/** Checkbox and radio surface fill when their state changes. */
export const boxFillMotion =
  'transition-[background-color,border-color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)';

/** Base transitions for hover tint and returning from interaction states. */
export const hoverTintMotion =
  'transition-[background-color,border-color,color,box-shadow,scale,opacity] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)';

/**
 * Compose with hoverTintMotion for press feedback and a smooth release. Buttons only (Button,
 * IconButton, SplitButton, Chip): fields, tabs, menus, list rows, tiles and calendar cells answer
 * a press with colour, never with a scale.
 */
export const pressMotion = cn(
  'active:not-disabled:not-aria-disabled:duration-(--ws-motion-duration-micro)',
  'active:not-disabled:not-aria-disabled:scale-(--ws-motion-scale-small)',
);

/**
 * Menus, selects, comboboxes and pickers (every Popup, DropdownMenu and Select list): a short
 * fade in and out, no zoom or slide. Each duration carries its state variant because
 * animate-in / animate-out set their own 150ms at that specificity; transition-none keeps the
 * durations off every other property.
 */
export const menuFadeMotion = cn(
  'transition-none ease-(--ws-motion-ease-out)',
  'data-[state=open]:animate-in data-[state=open]:fade-in-0',
  'data-[state=open]:duration-(--ws-motion-duration-quick)',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
  'data-[state=closed]:duration-(--ws-motion-duration-quick)',
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
