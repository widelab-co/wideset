// TODO(custom): an option's values as removable chips with a field to add more; Wideset has no chip or tag input.
import { RiCloseLine, RiDeleteBinLine } from '@remixicon/react';
import { Chip, IconButton, TextInput } from '@wideset/react';
import { useState } from 'react';

import type { ProductOption } from './data';

type OptionRowProps = {
  /** The name field's id, so a row just added can be focused. */
  nameId: string;
  option: ProductOption;
  onChange: (option: ProductOption) => void;
  onRemove: () => void;
};

/** The grid an option row and the labels above the rows share. */
export const OPTION_GRID = 'gap-ws-7 grid grid-cols-[10rem_minmax(0,1fr)_auto]';

/**
 * One option: its name, its values as chips, and a field that adds a value on Enter or when it is
 * left. A chip removes its value; Backspace in the empty field takes the last one, as in any
 * tag field. A value already there is not added twice.
 */
export function OptionRow({ nameId, option, onChange, onRemove }: OptionRowProps) {
  const [text, setText] = useState('');
  const label = option.name.trim() || 'option';

  const add = () => {
    const value = text.trim();
    setText('');
    if (value && !option.values.includes(value))
      onChange({ ...option, values: [...option.values, value] });
  };
  const remove = (value: string) =>
    onChange({ ...option, values: option.values.filter((v) => v !== value) });

  return (
    <div role="group" aria-label={`Option: ${label}`} className={`${OPTION_GRID} items-start`}>
      <TextInput
        id={nameId}
        size="sm"
        aria-label="Option name"
        placeholder="Colour"
        autoComplete="off"
        value={option.name}
        onChange={(event) => onChange({ ...option, name: event.target.value })}
      />
      <div className="gap-ws-3 flex min-w-0 flex-wrap items-center">
        {option.values.map((value) => (
          <Chip
            key={value}
            variant="secondary"
            aria-label={`Remove ${value} from ${label}`}
            onClick={() => remove(value)}
          >
            {value}
            <Chip.Icon icon={RiCloseLine} />
          </Chip>
        ))}
        <TextInput
          size="sm"
          aria-label={`Add a value to ${label}`}
          placeholder="Add value"
          autoComplete="off"
          className="w-[8rem]"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onBlur={add}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Enter adds the value; it must not submit the form around it.
              event.preventDefault();
              add();
            } else if (event.key === 'Backspace' && !text && option.values.length > 0) {
              remove(option.values[option.values.length - 1]);
            }
          }}
        />
      </div>
      <IconButton
        icon={RiDeleteBinLine}
        size="sm"
        variant="secondary"
        preset="ghost"
        aria-label={`Remove the ${label} option`}
        onClick={onRemove}
      />
    </div>
  );
}
