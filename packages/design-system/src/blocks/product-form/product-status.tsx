import { SegmentedControl } from '@wideset/react';

import type { Status } from './data';
import { FormSection } from './form-section';

type ProductStatusProps = {
  status: Status;
  /** Picking Active publishes, with the same checks as the header's button. */
  onStatusChange: (status: Status) => void;
};

/**
 * Whether the product is on sale. Two states that apply at once, so a segmented control rather
 * than a menu; Active goes through publishing, so it can stop at a field that is missing.
 */
export function ProductStatus({ status, onStatusChange }: ProductStatusProps) {
  return (
    <FormSection
      title="Status"
      description={
        status === 'active' ? 'On sale in the channels below.' : 'Only your team can see a draft.'
      }
    >
      <SegmentedControl
        size="sm"
        variant="fullWidth"
        aria-label="Status"
        value={status}
        onValueChange={(value) => onStatusChange(value as Status)}
      >
        <SegmentedControl.Item value="draft">Draft</SegmentedControl.Item>
        <SegmentedControl.Item value="active">Active</SegmentedControl.Item>
      </SegmentedControl>
    </FormSection>
  );
}
