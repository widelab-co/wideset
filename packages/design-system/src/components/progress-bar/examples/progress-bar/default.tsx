/** The playground's stage: one upload bar composed from its parts, its props set from the rail. */
import { ProgressBar, type ProgressBarProps } from '@wideset/react';

type StageProps = Omit<ProgressBarProps, 'children'>;

export default function ProgressBarDefault(props: Partial<StageProps>) {
  return (
    <div className="w-[20rem] max-w-full">
      <ProgressBar value={65} {...props}>
        <ProgressBar.Header>
          <ProgressBar.Label>Uploading assets</ProgressBar.Label>
          <ProgressBar.Value />
        </ProgressBar.Header>
        <ProgressBar.Track />
        <ProgressBar.Description>12 of 18 files uploaded</ProgressBar.Description>
      </ProgressBar>
    </div>
  );
}
