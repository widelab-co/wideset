import { RiCheckLine } from '@remixicon/react';
import { Table } from '@wideset/react';
import { useId } from 'react';

import { type FeatureGroup, FEATURES, type FeatureValue, PLANS } from './data';
import { formatCount } from './format';

/** A check, a dash or the limit itself; the check and the dash name themselves to screen readers. */
function Value({ value }: { value: FeatureValue }) {
  if (value === true)
    return (
      <RiCheckLine role="img" aria-label="Included" className="size-ws-9 text-ws-static-strong" />
    );
  if (value === false)
    return (
      <span className="text-ws-static-subtle">
        <span aria-hidden>—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return (
    <span className="tabular-nums">{typeof value === 'number' ? formatCount(value) : value}</span>
  );
}

/**
 * One group of features, its title and a table whose four equal columns sit under the plan
 * summaries above. From lg those name the plan columns on screen and the header row is only read
 * out; narrower, the plans stack and the header row shows.
 */
function FeatureGroupTable({ group }: { group: FeatureGroup }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-5 flex flex-col">
      <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        {group.title}
      </h3>
      <Table aria-labelledby={titleId} className="w-full table-fixed">
        <Table.Head className="lg:sr-only">
          <Table.Row>
            <Table.Header flushMargin>Feature</Table.Header>
            {PLANS.map((plan) => (
              <Table.Header key={plan.id}>{plan.name}</Table.Header>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {group.features.map((feature) => (
            <Table.Row key={feature.name}>
              <Table.Cell flushMargin>{feature.name}</Table.Cell>
              {PLANS.map((plan) => (
                <Table.Cell key={plan.id}>
                  <Value value={feature.values[plan.id]} />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}

/** Every feature by plan, grouped by what it is for. */
export function FeatureTable() {
  return (
    <div className="gap-ws-16 flex flex-col">
      {FEATURES.map((group) => (
        <FeatureGroupTable key={group.title} group={group} />
      ))}
    </div>
  );
}
