import { CUSTOMERS, type Deal, OWNERS, STAGES } from './data';
import { formatEither, formatMonthDay, formatUsd } from './format';

/*
  The filter as data: conditions of field, test and value, joined by one word. Each field has a
  kind, and the kind decides the tests it offers and the control its value takes: a list of
  options, an amount, or a day.
*/

export type FieldId = 'stage' | 'owner' | 'amount' | 'closeDate' | 'customer';
export type Operator = 'is' | 'isNot' | 'anyOf' | 'gt' | 'lt' | 'before' | 'after' | 'between';
type Kind = 'option' | 'amount' | 'date';
type Option = { value: string; label: string };

export const FIELDS: Record<FieldId, { label: string; kind: Kind; options?: Option[] }> = {
  stage: { label: 'Stage', kind: 'option', options: STAGES.map((s) => ({ value: s, label: s })) },
  owner: {
    label: 'Owner',
    kind: 'option',
    options: Object.entries(OWNERS).map(([value, label]) => ({ value, label })),
  },
  amount: { label: 'Amount', kind: 'amount' },
  closeDate: { label: 'Close date', kind: 'date' },
  customer: {
    label: 'Customer',
    kind: 'option',
    options: CUSTOMERS.map((c) => ({ value: c, label: c })),
  },
};
export const FIELD_IDS = Object.keys(FIELDS) as FieldId[];

export const OPERATORS: Record<Kind, { value: Operator; label: string }[]> = {
  option: [
    { value: 'is', label: 'is' },
    { value: 'isNot', label: 'is not' },
    { value: 'anyOf', label: 'is any of' },
  ],
  amount: [
    { value: 'gt', label: 'greater than' },
    { value: 'lt', label: 'less than' },
  ],
  date: [
    { value: 'before', label: 'before' },
    { value: 'after', label: 'after' },
    { value: 'between', label: 'between' },
  ],
};

/**
 * One condition. It keeps a slot for each kind of value, and only its field's kind is read:
 * `values` for options (one for is and is not), `amount` as typed, `from` and `to` as days (one
 * day for before and after).
 */
export type Condition = {
  id: string;
  field: FieldId;
  operator: Operator;
  values: string[];
  amount: string;
  from?: string;
  to?: string;
};

export type Join = 'and' | 'or';
export type Filter = { join: Join; conditions: Condition[] };

let made = 0;
/** A new condition on a field: its first test, no value yet. */
export const blank = (field: FieldId): Condition => ({
  id: `condition-${++made}`,
  field,
  operator: OPERATORS[FIELDS[field].kind][0].value,
  values: [],
  amount: '',
});

const amountOf = (condition: Condition) => Number(condition.amount.replace(/[^\d.]/g, '') || NaN);

/** Whether a condition has its value; one without it narrows nothing and is not applied. */
export function isComplete(condition: Condition) {
  const { kind } = FIELDS[condition.field];
  if (kind === 'option') return condition.values.length > 0;
  if (kind === 'amount') return Number.isFinite(amountOf(condition));
  return Boolean(condition.from && (condition.operator !== 'between' || condition.to));
}

function matches(deal: Deal, condition: Condition) {
  const { field, operator, values, from = '', to = '' } = condition;
  if (field === 'amount') {
    return operator === 'gt'
      ? deal.amount > amountOf(condition)
      : deal.amount < amountOf(condition);
  }
  if (field === 'closeDate') {
    if (operator === 'before') return deal.closeDate < from;
    if (operator === 'after') return deal.closeDate > from;
    return deal.closeDate >= from && deal.closeDate <= to;
  }
  const value = deal[field];
  if (operator === 'is') return value === values[0];
  if (operator === 'isNot') return value !== values[0];
  return values.includes(value);
}

/** The deals the filter keeps: every complete condition (and), or any one of them (or). */
export function applyFilter(deals: Deal[], { join, conditions }: Filter) {
  const complete = conditions.filter(isComplete);
  if (complete.length === 0) return deals;
  return deals.filter((deal) =>
    join === 'and'
      ? complete.every((condition) => matches(deal, condition))
      : complete.some((condition) => matches(deal, condition)),
  );
}

/** A condition in words, for its chip: `Stage is Proposal or Negotiation`, `Amount over $10,000`. */
export function describe(condition: Condition) {
  const { field, operator, values, from = '', to = '' } = condition;
  const { label, options = [] } = FIELDS[field];
  if (field === 'amount') {
    return `${label} ${operator === 'gt' ? 'over' : 'under'} ${formatUsd(amountOf(condition))}`;
  }
  if (field === 'closeDate') {
    if (operator === 'between') return `Closes ${formatMonthDay(from)} – ${formatMonthDay(to)}`;
    return `Closes ${operator} ${formatMonthDay(from)}`;
  }
  const names = values.map((value) => options.find((o) => o.value === value)?.label ?? value);
  return `${label} ${operator === 'isNot' ? 'is not' : 'is'} ${formatEither(names)}`;
}

// The filter the list opens with, and the two conditions being added to it in the popover.
const stages: Condition = {
  ...blank('stage'),
  operator: 'anyOf',
  values: ['Proposal', 'Negotiation'],
};
export const APPLIED: Filter = { join: 'and', conditions: [stages] };
export const DRAFT: Filter = {
  join: 'and',
  conditions: [
    stages,
    { ...blank('amount'), amount: '10,000' },
    { ...blank('closeDate'), operator: 'between', from: '2026-11-01', to: '2026-12-31' },
  ],
};

export type SortKey = 'closeDate' | 'amount' | 'name' | 'customer' | 'stage';
export type Sort = { key: SortKey; direction: 'asc' | 'desc' };

/** What each sort's two directions are called, in the words of what is sorted. */
export const SORTS: Record<SortKey, { label: string; asc: string; desc: string }> = {
  closeDate: { label: 'Close date', asc: 'Earliest first', desc: 'Latest first' },
  amount: { label: 'Amount', asc: 'Smallest first', desc: 'Largest first' },
  name: { label: 'Deal', asc: 'A to Z', desc: 'Z to A' },
  customer: { label: 'Customer', asc: 'A to Z', desc: 'Z to A' },
  stage: { label: 'Stage', asc: 'Earliest stage first', desc: 'Latest stage first' },
};

export const compare =
  ({ key, direction }: Sort) =>
  (a: Deal, b: Deal) => {
    const order =
      key === 'amount'
        ? a.amount - b.amount
        : key === 'stage'
          ? STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage)
          : a[key].localeCompare(b[key]);
    return direction === 'asc' ? order : -order;
  };
