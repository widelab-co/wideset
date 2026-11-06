import * as React from 'react';
import { cn } from 'src/lib/utils';

import { ILLUSTRATION_ART } from './Illustration.art';
import type { IllustrationProps } from './Illustration.types';
import { illustrationToneVariants, illustrationVariants } from './Illustration.variants';

/**
 * A line drawing for an empty state, a first-run screen or an announcement: Figma's Illustration.
 * Decorative unless it gets a `title`.
 */
export const Illustration = React.forwardRef<SVGSVGElement, IllustrationProps>(
  ({ illustration, size = 'lg', title, className, ...props }, ref) => {
    const titleId = React.useId();
    const art = ILLUSTRATION_ART[illustration][size];
    const labelled = Boolean(title);

    return (
      <svg
        ref={ref}
        data-slot="illustration"
        viewBox={`0 0 ${art.box} ${art.box}`}
        fill="none"
        role={labelled ? 'img' : undefined}
        aria-labelledby={labelled ? titleId : undefined}
        aria-hidden={labelled ? undefined : true}
        focusable="false"
        {...props}
        className={cn(illustrationVariants({ size }), className)}
      >
        {labelled ? <title id={titleId}>{title}</title> : null}
        {art.paths.map((path, index) => (
          <path
            key={index}
            d={path.d}
            className={illustrationToneVariants({ tone: path.tone, stroke: Boolean(path.stroke) })}
            fillRule={path.evenodd ? 'evenodd' : undefined}
            clipRule={path.evenodd ? 'evenodd' : undefined}
            strokeWidth={path.stroke ? (path.width ?? 1) : undefined}
            strokeLinecap={path.stroke ? 'round' : undefined}
            strokeLinejoin={path.stroke ? 'round' : undefined}
            strokeMiterlimit={path.stroke ? 1.5 : undefined}
          />
        ))}
      </svg>
    );
  },
);

Illustration.displayName = 'Illustration';
