import { RiCloseLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../components/button/Button';
import { IconButton } from '../components/button/IconButton';
import { Chip } from '../components/chip/Chip';
import { FilterButton } from '../components/filter-button/FilterButton';
import { Select } from '../components/select/Select';

// The press shrink (pressMotion) belongs to buttons only.
const pressScale = /scale-\(--ws-motion-scale-small\)/;

describe('Press scale', () => {
  it('shrinks a Button on press', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' }).className).toMatch(pressScale);
  });

  it('shrinks an IconButton on press', () => {
    render(<IconButton icon={RiCloseLine} aria-label="Close" />);

    expect(screen.getByRole('button', { name: 'Close' }).className).toMatch(pressScale);
  });

  it('does not shrink a Select trigger on press', () => {
    render(
      <Select>
        <Select.Trigger aria-label="Country">
          <Select.Value placeholder="Select country" />
        </Select.Trigger>
      </Select>,
    );

    expect(screen.getByRole('combobox', { name: 'Country' }).className).not.toMatch(pressScale);
  });

  it('does not shrink a FilterButton on press', () => {
    render(<FilterButton options={[]} defaultValue={[]} onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Filter' }).className).not.toMatch(pressScale);
  });

  it('does not shrink a Chip on press', () => {
    render(<Chip>Remote</Chip>);

    expect(screen.getByText('Remote').className).not.toMatch(pressScale);
  });
});
