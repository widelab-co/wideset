/**
 * How much room each component gets in the gallery grid: four columns (two on narrower
 * screens) packed densely, where a card is one column, two columns, two by two, the full
 * width, or the full width and two rows. The size follows the thumbnail — a lone trigger
 * fits a small card, a calendar needs a tall one, a table a wide one — so the thumbnail
 * rarely has to scale down. Anything not listed is `md`.
 */
export type GallerySize = 'sm' | 'md' | 'lg' | 'wide' | 'xl';

const SIZES: Record<string, GallerySize> = {
  // One small control or a closed trigger.
  button: 'sm',
  'dropdown-menu': 'sm',
  'filter-button': 'sm',
  'helper-text': 'sm',
  'icon-button': 'sm',
  'link-button': 'sm',
  sidepanel: 'sm',
  'split-button': 'sm',
  'status-badge': 'sm',
  'status-modal': 'sm',
  // Tall: a month grid, a stack of options, a tooltip drawn open.
  calendar: 'lg',
  card: 'lg',
  'checkbox-group': 'lg',
  tooltip: 'lg',
  'radio-button-group': 'lg',
  // Wider than half the grid.
  'action-bar': 'wide',
  'inline-alert': 'wide',
  'progress-stepper': 'wide',
  spreadsheet: 'wide',
  'system-alert': 'wide',
  // A whole app sidebar, top to bottom.
  sidebar: 'lg',
  // Overlays drawn open at their real width.
  modal: 'xl',
  popup: 'xl',
};

export const gallerySize = (id: string): GallerySize => SIZES[id] ?? 'md';

/** Grid placement per size; the grid is a container, four columns from 36rem. */
export const GALLERY_SPAN: Record<GallerySize, string> = {
  sm: 'col-span-1',
  md: 'col-span-2',
  lg: 'col-span-2 row-span-2',
  wide: 'col-span-2 @[36rem]:col-span-4',
  xl: 'col-span-2 row-span-2 @[36rem]:col-span-4',
};
