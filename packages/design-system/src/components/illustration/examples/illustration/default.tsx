/** The playground's stage: one illustration, its props set from the rail. */
import { Illustration, type IllustrationProps } from '@wideset/react';

export default function IllustrationDefault(props: Partial<IllustrationProps>) {
  return <Illustration illustration="computer" {...props} />;
}
