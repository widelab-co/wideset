import { RiCheckLine } from '@remixicon/react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { getPresetLabel } from './DateRangePicker.logic';
import {
  type DateRangePickerPresetsProps,
  type DateRangePreset,
  dateRangePresetLabels,
} from './DateRangePicker.types';
import { dateRangePickerPresetMotionVariants } from './DateRangePicker.variants';

const DateRangePickerPresets = ({
  activeDatePreset,
  onDatePresetSelect,
  presetLabels,
  defaultMotion,
}: DateRangePickerPresetsProps) => {
  const motion = useDefaultMotion(defaultMotion);

  return (
    <div
      data-slot="date-range-picker-presets"
      className="border-ws-static-base p-ws-5 flex w-[10rem] flex-col border-r"
    >
      {(Object.keys(dateRangePresetLabels) as DateRangePreset[]).map((preset) => {
        const isActive = activeDatePreset === preset;

        return (
          <button
            key={preset}
            type="button"
            aria-current={isActive || undefined}
            onClick={() => onDatePresetSelect(preset)}
            className={cn(
              'rounded-ws-control-md typography-label-sm text-ws-dynamic-secondary-default min-h-ws-14 gap-ws-5 px-ws-5 py-ws-3 flex items-center justify-between text-left whitespace-nowrap',
              'hover:bg-ws-dynamic-secondary-alpha-hover active:bg-ws-dynamic-secondary-alpha-pressed',
              dateRangePickerPresetMotionVariants({ enabled: motion }),
              isActive && 'bg-ws-dynamic-primary-alpha-strong-default',
            )}
          >
            <span>{getPresetLabel(preset, presetLabels)}</span>
            {isActive && (
              <RiCheckLine
                aria-hidden="true"
                focusable="false"
                className="text-ws-dynamic-primary-default size-ws-11 shrink-0"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

DateRangePickerPresets.displayName = 'DateRangePickerPresets';

export { DateRangePickerPresets };
