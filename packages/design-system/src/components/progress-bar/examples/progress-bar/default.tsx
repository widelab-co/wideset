/** The playground's stage: one upload bar with its label and description, its props set from the rail. */
import { ProgressBar, type ProgressBarProps } from '@wideset/react';

type ProgressBarDefaultProps = Pick<ProgressBarProps, 'value' | 'max' | 'variant' | 'type'> & {
  label?: string;
  description?: string;
};

export default function ProgressBarDefault({
  label = 'Uploading assets',
  description = '12 of 18 files uploaded',
  ...props
}: ProgressBarDefaultProps) {
  return (
    <div className="w-[20rem] max-w-full">
      <ProgressBar value={65} aria-label={label} {...props}>
        {props.type === 'circle' ? (
          <>
            <ProgressBar.Value />
            <ProgressBar.Track />
          </>
        ) : (
          <>
            <ProgressBar.Header>
              <ProgressBar.Label>{label}</ProgressBar.Label>
              <ProgressBar.Value />
            </ProgressBar.Header>
            <ProgressBar.Track />
            <ProgressBar.Description>{description}</ProgressBar.Description>
          </>
        )}
      </ProgressBar>
    </div>
  );
}
