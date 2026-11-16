import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs } from '../components/tabs/Tabs';
import { normalizeSnapshotIds, stableIdSerializer } from './helpers/stable-id-serializer';

describe('Stable snapshot IDs', () => {
  it('preserves ID relationships, suffixes, and distinct identities without changing the DOM', () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <button id="radix-_r_39_-trigger-account" aria-controls="radix-_r_39_-content-account">Account</button>
      <section id="radix-_r_39_-content-account" aria-labelledby="radix-_r_39_-trigger-account"></section>
      <label for="_r_40_">Name</label>
      <input id="_r_40_" aria-describedby="help radix-_r_41_">
      <span id="radix-_r_41_">Hint</span>
      <p id="help" data-example="_r_39_">Literal _r_39_</p>`;
    const original = element.innerHTML;
    const normalized = normalizeSnapshotIds(element);

    expect(normalized.querySelector('button')).toHaveAttribute(
      'id',
      'radix-:id-1:-trigger-account',
    );
    expect(normalized.querySelector('button')).toHaveAttribute(
      'aria-controls',
      'radix-:id-1:-content-account',
    );
    expect(normalized.querySelector('section')).toHaveAttribute(
      'id',
      'radix-:id-1:-content-account',
    );
    expect(normalized.querySelector('section')).toHaveAttribute(
      'aria-labelledby',
      'radix-:id-1:-trigger-account',
    );
    expect(normalized.querySelector('label')).toHaveAttribute('for', ':id-2:');
    expect(normalized.querySelector('input')).toHaveAttribute('id', ':id-2:');
    expect(normalized.querySelector('input')).toHaveAttribute(
      'aria-describedby',
      'help radix-:id-3:',
    );
    expect(normalized.querySelector('span')).toHaveAttribute('id', 'radix-:id-3:');
    expect(normalized.querySelector('p')).toHaveAttribute('id', 'help');
    expect(normalized.querySelector('p')).toHaveAttribute('data-example', '_r_39_');
    expect(normalized.querySelector('p')).toHaveTextContent('Literal _r_39_');
    expect(element.innerHTML).toBe(original);
  });

  it('preserves generated-looking text inside explicit IDs and normalizes separate reference tokens', () => {
    const element = document.createElement('div');
    element.id = 'report_r_1_details';
    expect(stableIdSerializer.test(element)).toBe(false);
    element.setAttribute(
      'aria-describedby',
      'report_r_1_details\t_r_2_\nradix-_r_3_-hint report-radix-_r_4_',
    );

    const normalized = normalizeSnapshotIds(element);
    expect(normalized).toHaveAttribute('id', 'report_r_1_details');
    expect(normalized).toHaveAttribute(
      'aria-describedby',
      'report_r_1_details\t:id-1:\nradix-:id-2:-hint report-radix-_r_4_',
    );
  });

  it.each([':r1:', '«r1»', '_r_1_', ':R1H2:', '_R_1H2_'])(
    'normalizes the React ID format %s',
    (id) => {
      const element = document.createElement('input');
      element.id = id;
      expect(normalizeSnapshotIds(element)).toHaveAttribute('id', ':id-1:');
    },
  );

  it('registers normalization for fragment snapshots and restarts numbering for each payload', () => {
    const first = document.createDocumentFragment();
    const label = document.createElement('label');
    const input = document.createElement('input');
    label.htmlFor = 'radix-_r_10_';
    label.textContent = 'Name';
    input.id = label.htmlFor;
    first.append(label, input);

    const second = first.cloneNode(true) as DocumentFragment;
    second.querySelector('label')!.htmlFor = 'radix-_r_99_';
    second.querySelector('input')!.id = 'radix-_r_99_';

    expect(normalizeSnapshotIds(second).firstElementChild).toHaveAttribute('for', 'radix-:id-1:');
    expect(first).toMatchSnapshot('first payload');
    expect(second).toMatchSnapshot('later payload');
  });

  it('keeps Tabs snapshot output stable after an additional render and unmount', () => {
    const tabs = (
      <Tabs defaultValue="account">
        <Tabs.List>
          <Tabs.Item value="account">Account</Tabs.Item>
        </Tabs.List>
        <Tabs.Content value="account">Account settings</Tabs.Content>
      </Tabs>
    );
    const first = render(tabs);
    const firstElement = first.container.firstElementChild!;
    const firstId = first.container.querySelector('[role="tab"]')!.id;
    const expected = normalizeSnapshotIds(firstElement).outerHTML;
    first.unmount();

    const extra = render(tabs);
    extra.unmount();

    const second = render(tabs);
    const tab = second.getByRole('tab', { name: 'Account' });
    const panel = second.getByRole('tabpanel', { name: 'Account' });
    expect(tab.id).not.toBe(firstId);
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(normalizeSnapshotIds(second.container.firstElementChild!).outerHTML).toBe(expected);
  });
});
