import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { DividerLineProps, DividerProps } from './Divider.types';
import {
  DIVIDER_WEIGHT_PX,
  dividerDashedLineVariants,
  dividerLineVariants,
  dividerTextVariants,
  dividerVariants,
} from './Divider.variants';

const DividerLine = ({ lineStyle, emphasis, weight }: DividerLineProps) => {
  if (lineStyle === 'dashed') {
    const weightPx = DIVIDER_WEIGHT_PX[weight ?? 'default'];
    return (
      <svg aria-hidden="true" height={weightPx} className={dividerDashedLineVariants({ emphasis })}>
        <line
          x1="0"
          y1={weightPx / 2}
          x2="100%"
          y2={weightPx / 2}
          strokeWidth={weightPx}
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  return <div className={dividerLineVariants({ emphasis, weight })} />;
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, text, lineStyle, emphasis, weight, textAlign = 'center', ...props }, ref) => {
    const dividerLine = <DividerLine lineStyle={lineStyle} emphasis={emphasis} weight={weight} />;

    return (
      <div
        ref={ref}
        className={cn(dividerVariants({ withText: Boolean(text) }), className)}
        role="separator"
        data-slot="divider"
        {...props}
      >
        {text ? (
          <>
            {textAlign !== 'left' && dividerLine}
            <span className={cn(dividerTextVariants({ textAlign }))}>{text}</span>
            {textAlign !== 'right' && dividerLine}
          </>
        ) : (
          dividerLine
        )}
      </div>
    );
  },
);

Divider.displayName = 'Divider';
