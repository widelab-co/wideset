/**
 * Selecting rows opens the bar; clearing the selection closes it. Select all, in the header and
 * in the bar, shares the rows' state: indeterminate while only some rows are selected, it
 * selects the rest, and once every row is selected it clears them. The count is a polite live
 * region, so a screen reader reads it out as it changes. Keep the bar mounted and toggle
 * `isOpen`, so it can animate out.
 */
import { RiDeleteBin6Line, RiSendPlaneLine, RiShareForwardLine } from '@remixicon/react';
import { ActionBar, Button, Checkbox, IconButton, Table, Tooltip } from '@wideset/react';
import { useState } from 'react';

const clients = [
  { id: 1, name: 'Tech Nova', country: 'Brazil', employees: 58 },
  { id: 2, name: 'Eco Solutions', country: 'Japan', employees: 72 },
  { id: 3, name: 'Skyline Innovations', country: 'Nigeria', employees: 14 },
  { id: 4, name: 'Terra Firma', country: 'Canada', employees: 49 },
  { id: 5, name: 'Quantum Leap', country: 'Australia', employees: 29 },
];

export default function ActionBarSelection() {
  const [selected, setSelected] = useState<number[]>([1, 2, 4]);
  const toggle = (id: number) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  const allSelected = selected.length === clients.length;
  const selectAll = (checked: boolean | 'indeterminate') =>
    setSelected(checked === true ? clients.map((client) => client.id) : []);

  return (
    <div className="relative h-[23rem] w-[34rem] max-w-full [transform:translateZ(0)]">
      <Table selectionMode="multiple">
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-[3rem]">
              <Checkbox
                checked={allSelected || (selected.length > 0 ? 'indeterminate' : false)}
                onCheckedChange={selectAll}
                aria-label="Select all clients"
              />
            </Table.Header>
            <Table.Header>Client</Table.Header>
            <Table.Header>Country</Table.Header>
            <Table.Header align="right">Employees</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {clients.map((client) => (
            <Table.Row
              key={client.id}
              selected={selected.includes(client.id)}
              onClick={() => toggle(client.id)}
            >
              <Table.Cell>
                <Checkbox
                  checked={selected.includes(client.id)}
                  aria-label={`Select ${client.name}`}
                />
              </Table.Cell>
              <Table.Cell>{client.name}</Table.Cell>
              <Table.Cell>{client.country}</Table.Cell>
              <Table.Cell align="right">{client.employees}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <ActionBar isOpen={selected.length > 0}>
        <ActionBar.Count>
          {selected.length} {selected.length === 1 ? 'row' : 'rows'} selected
        </ActionBar.Count>
        <ActionBar.Actions>
          <ActionBar.SelectAll
            checked={allSelected || 'indeterminate'}
            onCheckedChange={selectAll}
          />
          <Button variant="secondary" size="sm">
            <Button.Icon icon={RiSendPlaneLine} />
            Publish
          </Button>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="secondary"
                size="sm"
                icon={RiShareForwardLine}
                aria-label="Forward"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Forward</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="danger"
                preset="ghost"
                size="sm"
                icon={RiDeleteBin6Line}
                aria-label="Delete"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Delete</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
        </ActionBar.Actions>
      </ActionBar>
    </div>
  );
}
