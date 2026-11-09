export type CountProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** The quantity: a number, or a short capped value such as `99+`. */
  children?: React.ReactNode;
  /** Additional CSS classes for layout overrides. */
  className?: string;
};
