/** The playground's stage: a count beside the label it belongs to, its props set from the rail. */
import { Count, type CountProps } from '@wideset/react';

export default function CountDefault(props: CountProps) {
  return (
    <span className="gap-ws-4 typography-label-strong-md text-ws-static-strong inline-flex items-center">
      Active
      <Count {...props}>3</Count>
    </span>
  );
}
