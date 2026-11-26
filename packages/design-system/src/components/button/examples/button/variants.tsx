/**
 * Colour carries meaning, not emphasis. Primary is the action the view is for; secondary is a
 * supporting action next to it. Danger is for actions that destroy something, success for a
 * confirmation that completes a flow. Inverse is only for dark or coloured surfaces.
 */
import { Button } from '@wideset/react';

export default function ButtonVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="danger">Delete project</Button>
      <Button variant="success">Approve</Button>
      <div className="bg-ws-static-inverse-background rounded-ws-container-md p-ws-8">
        <Button variant="inverse">Upgrade plan</Button>
      </div>
    </div>
  );
}
