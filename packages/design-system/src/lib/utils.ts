import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Every Wideset token class carries the `ws` prefix (`p-ws-4`, `rounded-ws-control-md`,
// `shadow-ws-low`, `z-ws-modal`, …) — see prefix-tokens.cjs. tw-merge only knows Tailwind's
// default scales, so without these validators it keeps both classes of a conflicting pair.
const isWs = (value: string) => value.startsWith('ws-');
const isWsFontSize = (value: string) => /^ws-(\d+|[a-z0-9]+-desktop)$/.test(value);
const isWsFontWeight = (value: string) =>
  /^ws-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|md)$/.test(value);
const isWsFontFamily = (value: string) => /^ws-(sans|heading|body|mono)$/.test(value);

const twMerge = extendTailwindMerge<string>({
  extend: {
    theme: {
      spacing: [isWs],
      radius: [isWs],
      // Shadow utilities from src/styles/utilities/shadow.css.
      shadow: [isWs],
      'drop-shadow': [isWs],
      text: [isWsFontSize],
      'font-weight': [isWsFontWeight],
      font: [isWsFontFamily],
      tracking: [isWs],
      leading: [isWs],
    },
    classGroups: {
      // Wideset z-index scale from src/styles/utilities/z-index.css.
      z: [{ z: [isWs] }],
      // tw-merge's max-h group lacks `none`, and `max-h-ws-*` sorts after `max-h-none` in the
      // stylesheet, so the pair must be merged (MultiSelect tagsGrow).
      'max-h': [{ 'max-h': ['none'] }],
    },
    orderSensitiveModifiers: [],
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
