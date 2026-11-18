/**
 * The slider prints no numbers itself: put a `Slider.Label` where the reader needs the scale.
 * Both ends in one row is the usual choice; under the track suits a narrow row; one end alone
 * works when the other is obvious. They are plain numbers, so still name what the slider sets
 * in a visible label next to it.
 */
import { Slider } from '@wideset/react';

export default function SliderLabels() {
  return (
    <div className="gap-ws-16 flex w-[20rem] max-w-full flex-col">
      <div className="gap-ws-9 flex items-center">
        <Slider.Label>0</Slider.Label>
        <Slider className="min-w-0 flex-1" aria-label="Volume" defaultValue={[40]} />
        <Slider.Label>100</Slider.Label>
      </div>
      <div>
        <Slider aria-label="Brightness" defaultValue={[40]} />
        <div className="pt-ws-8 flex justify-between">
          <Slider.Label>0</Slider.Label>
          <Slider.Label>100</Slider.Label>
        </div>
      </div>
      <div className="gap-ws-9 flex items-center">
        <Slider className="min-w-0 flex-1" aria-label="Opacity" defaultValue={[40]} />
        <Slider.Label>100</Slider.Label>
      </div>
    </div>
  );
}
