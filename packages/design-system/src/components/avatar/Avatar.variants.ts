import { cva } from 'class-variance-authority';

/**
 * Box styles for every avatar content mode.
 *
 * `--mask-position` / `--mask-radius` place the notch the status dot sits in;
 * `--mask-edge` is its feather width. Keep the `_` around `+` inside the
 * `calc()` — without it the mask is invalid and silently resolves to `none`.
 */
export const avatarVariants = cva(
  'bg-ws-static-alpha-base text-ws-static-base relative box-border inline-flex shrink-0 items-center justify-center object-cover',
  {
    variants: {
      size: {
        xs: 'typography-caption-strong-sm h-ws-11 w-ws-11 [&_svg]:size-ws-7 [--mask-edge:0.5px] [--mask-position:5px] [--mask-radius:4px]',
        sm: 'typography-caption-strong-md h-ws-12 w-ws-12 [&_svg]:size-ws-8 [--mask-edge:0.5px] [--mask-position:5px] [--mask-radius:4px]',
        md: 'typography-label-strong-sm h-ws-14 w-ws-14 [&_svg]:size-ws-9 [--mask-edge:0.5px] [--mask-position:6px] [--mask-radius:6px]',
        lg: 'typography-label-strong-md h-ws-16 w-ws-16 [&_svg]:size-ws-11 [--mask-edge:0.5px] [--mask-position:7px] [--mask-radius:7px]',
        xl: 'typography-label-strong-lg h-ws-18 w-ws-18 [&_svg]:size-ws-12 [--mask-edge:0.5px] [--mask-position:8px] [--mask-radius:8px]',
        '2xl':
          'typography-subtitle-lg h-ws-22 w-ws-22 [&_svg]:size-ws-16 [--mask-edge:0.5px] [--mask-position:11px] [--mask-radius:11px]',
      },
      shape: {
        round: 'rounded-full',
        square: '',
      },
      hasStatus: {
        // `no-clip` keeps the group ring (an outline, outside the box) from being masked away.
        true: 'mask-[radial-gradient(circle_at_calc(100%-var(--mask-position))_calc(100%-var(--mask-position)),transparent_var(--mask-radius),black_calc(var(--mask-radius)_+_var(--mask-edge)))] [mask-clip:no-clip] [-webkit-mask-clip:no-clip] [-webkit-mask-image:radial-gradient(circle_at_calc(100%-var(--mask-position))_calc(100%-var(--mask-position)),transparent_var(--mask-radius),black_calc(var(--mask-radius)_+_var(--mask-edge)))]',
        false: '',
      },
    },
    compoundVariants: [
      { shape: 'square', size: 'xs', class: 'rounded-ws-control-sm' },
      { shape: 'square', size: 'sm', class: 'rounded-ws-control-md' },
      { shape: 'square', size: 'md', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'lg', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'xl', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: '2xl', class: 'rounded-ws-container-lg' },
    ],
    defaultVariants: {
      size: 'md',
      shape: 'round',
    },
  },
);

export const groupVariants = cva('is-group group', {
  variants: {
    size: {
      xs: '-space-x-ws-4',
      sm: '-space-x-ws-4',
      md: '-space-x-ws-4',
      lg: '-space-x-ws-4',
      xl: '-space-x-ws-4',
      '2xl': '-space-x-ws-4',
    },
    layout: {
      row: [
        'isolate flex flex-nowrap items-center whitespace-nowrap',
        // Figma strokes each avatar of a row outside, Border Width/md in Static/Fill/Container,
        // so every avatar cuts a gap into the one it overlaps. An outline is that outside
        // stroke: it follows the avatar's radius and never moves the layout. It goes on the
        // avatar box (the root's first child); `Avatar.More` sits behind and overlaps nothing.
        '[&>[data-slot=avatar]>:first-child]:outline-2',
        '[&>[data-slot=avatar]>:first-child]:outline-ws-static-container',
      ].join(' '),
      grid: 'gap-ws-3 flex flex-wrap space-x-0',
    },
  },
  compoundVariants: [
    // Figma's Large row strokes Border Width/lg (3px); xl and 2xl have no Figma group and follow it.
    {
      layout: 'row',
      size: ['lg', 'xl', '2xl'],
      class: '[&>[data-slot=avatar]>:first-child]:outline-3',
    },
  ],
  defaultVariants: {
    size: 'md',
    layout: 'row',
  },
});

/**
 * Styles for `Avatar.More`. Self-contained rather than layered on
 * `avatarVariants`: it shares the avatar's box but carries its own fill and a
 * type step one below the avatar's. Keep the box values in sync with
 * `avatarVariants` — a test asserts they match.
 */
export const moreVariants = cva(
  [
    'relative box-border inline-flex shrink-0 items-center justify-center',
    'text-ws-static-base transition-colors',
    'bg-ws-dynamic-secondary-alpha-strong-default',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'typography-caption-strong-sm h-ws-11 w-ws-11 [&_svg]:size-ws-7',
        sm: 'typography-caption-strong-sm h-ws-12 w-ws-12 [&_svg]:size-ws-8',
        md: 'typography-caption-strong-md h-ws-14 w-ws-14 [&_svg]:size-ws-9',
        lg: 'typography-label-strong-sm h-ws-16 w-ws-16 [&_svg]:size-ws-11',
        xl: 'typography-label-strong-md h-ws-18 w-ws-18 [&_svg]:size-ws-12',
        '2xl': 'typography-label-strong-lg h-ws-22 w-ws-22 [&_svg]:size-ws-16',
      },
      shape: {
        round: 'rounded-full',
        square: '',
      },
    },
    compoundVariants: [
      { shape: 'square', size: 'xs', class: 'rounded-ws-control-sm' },
      { shape: 'square', size: 'sm', class: 'rounded-ws-control-md' },
      { shape: 'square', size: 'md', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'lg', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'xl', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: '2xl', class: 'rounded-ws-container-lg' },
    ],
    defaultVariants: {
      size: 'md',
      shape: 'round',
    },
  },
);

export const statusVariants = cva('right-ws-2 bottom-ws-2 z-ws-base absolute rounded-full', {
  variants: {
    size: {
      xs: 'size-ws-4',
      sm: 'size-ws-4',
      md: 'size-ws-5',
      lg: 'size-ws-6',
      xl: 'size-ws-7',
      '2xl': 'size-ws-9',
    },
    status: {
      online: 'bg-ws-semantic-inverse-positive',
      offline: 'bg-ws-semantic-inverse-negative',
      unavailable: 'bg-ws-dynamic-primary-disabled',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/**
 * Styles for the `selected` ring, applied to its own element beside the status
 * dot so the notch can cut the ring without clipping the dot.
 *
 * Keep `mask-clip: no-clip` — the outline sits outside the box, so any other
 * value masks it away entirely. Radii mirror `avatarVariants`; a test asserts
 * they match.
 */
export const selectionRingVariants = cva(
  'outline-ws-dynamic-primary-strong-default pointer-events-none absolute inset-0 outline-2 outline-offset-2 outline-solid',
  {
    variants: {
      shape: {
        round: 'rounded-full',
        square: '',
      },
      size: {
        xs: '[--mask-edge:0.5px] [--mask-position:5px] [--mask-radius:4px]',
        sm: '[--mask-edge:0.5px] [--mask-position:5px] [--mask-radius:4px]',
        md: '[--mask-edge:0.5px] [--mask-position:6px] [--mask-radius:6px]',
        lg: '[--mask-edge:0.5px] [--mask-position:7px] [--mask-radius:7px]',
        xl: '[--mask-edge:0.5px] [--mask-position:8px] [--mask-radius:8px]',
        '2xl': '[--mask-edge:0.5px] [--mask-position:11px] [--mask-radius:11px]',
      },
      hasStatus: {
        true: 'mask-[radial-gradient(circle_at_calc(100%-var(--mask-position))_calc(100%-var(--mask-position)),transparent_var(--mask-radius),black_calc(var(--mask-radius)_+_var(--mask-edge)))] [mask-clip:no-clip] [-webkit-mask-clip:no-clip] [-webkit-mask-image:radial-gradient(circle_at_calc(100%-var(--mask-position))_calc(100%-var(--mask-position)),transparent_var(--mask-radius),black_calc(var(--mask-radius)_+_var(--mask-edge)))]',
        false: '',
      },
    },
    compoundVariants: [
      { shape: 'square', size: 'xs', class: 'rounded-ws-control-sm' },
      { shape: 'square', size: 'sm', class: 'rounded-ws-control-md' },
      { shape: 'square', size: 'md', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'lg', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: 'xl', class: 'rounded-ws-control-lg' },
      { shape: 'square', size: '2xl', class: 'rounded-ws-container-lg' },
    ],
    defaultVariants: {
      size: 'md',
      shape: 'round',
      hasStatus: false,
    },
  },
);
