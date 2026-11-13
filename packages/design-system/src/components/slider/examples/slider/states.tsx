/** Hover, drag and focus are live; the focus ring shows only for keyboard focus. A disabled slider ignores the pointer and leaves the tab order, so say why it is locked next to it. */
import { Slider } from '@wideset/react';

export default function SliderStates() {
  return (
    <div className="gap-x-ws-7 gap-y-ws-16 grid w-[24rem] max-w-full grid-cols-[4rem_1fr] items-center">
      <span className="typography-caption-md text-ws-static-subtle">Default</span>
      <Slider thumbAriaLabels={['Minimum price', 'Maximum price']} defaultValue={[20, 80]} />
      <span className="typography-caption-md text-ws-static-subtle">Disabled</span>
      <Slider
        thumbAriaLabels={['Minimum price', 'Maximum price']}
        defaultValue={[20, 80]}
        disabled
      />
    </div>
  );
}
