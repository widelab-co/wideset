/**
 * The corner ladders the Themes page offers: "Round" makes every control a pill; containers keep
 * a bounded ladder, because a card at half its own height is a lozenge.
 */
export type Radius = 'sharp' | 'default' | 'round';

export const STEPS = ['none', 'small', 'medium', 'large', 'xlarge'] as const;
export const LADDERS: Record<Radius, { control: string[]; container: string[] }> = {
  sharp: {
    control: ['0rem', '0.125rem', '0.125rem', '0.25rem', '0.25rem'],
    container: ['0rem', '0.25rem', '0.375rem', '0.5rem', '0.5rem'],
  },
  default: { control: [], container: [] },
  round: {
    control: ['0rem', '9999px', '9999px', '9999px', '9999px'],
    container: ['0rem', '0.75rem', '1rem', '1.5rem', '2rem'],
  },
};
