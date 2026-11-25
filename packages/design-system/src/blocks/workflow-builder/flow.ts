import { type Field, type Step, STEP_TYPES, type StepKind } from './data';

/**
 * Where a step sits: `root` is the main line, `<conditionId>:yes` and `<conditionId>:no` a
 * condition's branches.
 */
export type SequenceKey = 'root' | `${string}:${'yes' | 'no'}`;

/** Every step in reading order: down the line, the Yes branch before the No branch. */
export function allSteps(flow: Step[]): Step[] {
  return flow.flatMap((step) => [step, ...allSteps(step.yes ?? []), ...allSteps(step.no ?? [])]);
}

/** Whether a field holds what the step needs: anything for an optional field, else usable text. */
export const isFilled = (field: Field, value = '') =>
  !field.missing || (value.trim() !== '' && (field.valid?.(value) ?? true));

/** A step cannot run while a field it needs is empty or unusable ("abc" for an amount). */
export const isComplete = (step: Step) =>
  STEP_TYPES[step.kind].fields.every((field) => isFilled(field, step.fields[field.name]));

/** Applies `edit` to one sequence of the tree and returns the new tree. */
function editSequence(
  sequence: Step[],
  key: SequenceKey,
  edit: (sequence: Step[]) => Step[],
  own: SequenceKey = 'root',
): Step[] {
  const here = own === key ? edit(sequence) : sequence;
  return here.map((step) =>
    step.kind === 'condition'
      ? {
          ...step,
          yes: editSequence(step.yes ?? [], key, edit, `${step.id}:yes`),
          no: editSequence(step.no ?? [], key, edit, `${step.id}:no`),
        }
      : step,
  );
}

let created = 0;

/** A new step of a kind, with its defaults. */
export function newStep(kind: StepKind): Step {
  created += 1;
  const step: Step = { id: `${kind}-${created}`, kind, fields: { ...STEP_TYPES[kind].defaults } };
  return kind === 'condition' ? { ...step, yes: [], no: [] } : step;
}

/**
 * Puts a step at `index` of a sequence. A condition ends its sequence, so the steps after it move
 * onto its Yes branch.
 */
export const insertStep = (flow: Step[], key: SequenceKey, index: number, step: Step) =>
  editSequence(flow, key, (sequence) =>
    step.kind === 'condition'
      ? [...sequence.slice(0, index), { ...step, yes: sequence.slice(index), no: [] }]
      : [...sequence.slice(0, index), step, ...sequence.slice(index)],
  );

/** Where a step sits: its sequence and its index there. */
export function locate(
  flow: Step[],
  id: string,
  key: SequenceKey = 'root',
): { key: SequenceKey; index: number } | undefined {
  for (const [index, step] of flow.entries()) {
    if (step.id === id) return { key, index };
    const found =
      locate(step.yes ?? [], id, `${step.id}:yes`) ?? locate(step.no ?? [], id, `${step.id}:no`);
    if (found) return found;
  }
  return undefined;
}

/** The steps of one sequence, if it still exists. */
function sequenceOf(flow: Step[], key: SequenceKey, own: SequenceKey = 'root'): Step[] | undefined {
  if (own === key) return flow;
  for (const step of flow) {
    if (step.kind !== 'condition') continue;
    const found =
      sequenceOf(step.yes ?? [], key, `${step.id}:yes`) ??
      sequenceOf(step.no ?? [], key, `${step.id}:no`);
    if (found) return found;
  }
  return undefined;
}

const endsInCondition = (sequence: Step[]) => sequence.at(-1)?.kind === 'condition';

/**
 * Where `step` can go back into `sequence`, near `index`, keeping a condition last: a step lands
 * before a condition that now ends the sequence; a condition lands at the end, or nowhere when
 * another condition ends it.
 */
function slotIn(sequence: Step[], index: number, step: Step): number | undefined {
  if (step.kind === 'condition') return endsInCondition(sequence) ? undefined : sequence.length;
  const at = Math.min(index, sequence.length);
  return endsInCondition(sequence) ? Math.min(at, sequence.length - 1) : at;
}

/**
 * Puts a removed step back as it was, branches and all, near `index` of its sequence, against the
 * tree as it is now. When that sequence is gone (its condition was deleted since) or cannot take
 * it, the step goes to the end of the main line; a condition follows the Yes branches down to the
 * first line that does not already end in one.
 */
export function restoreStep(flow: Step[], key: SequenceKey, index: number, step: Step): Step[] {
  const put = (into: SequenceKey, at: number) =>
    editSequence(flow, into, (sequence) => [...sequence.slice(0, at), step, ...sequence.slice(at)]);

  const own = sequenceOf(flow, key);
  const there = own && slotIn(own, index, step);
  if (there !== undefined) return put(key, there);

  let line: SequenceKey = 'root';
  let sequence = flow;
  while (step.kind === 'condition' && endsInCondition(sequence)) {
    const last = sequence[sequence.length - 1];
    line = `${last.id}:yes`;
    sequence = last.yes ?? [];
  }
  return put(line, slotIn(sequence, sequence.length, step) ?? sequence.length);
}

/** Takes a step out, with everything on its branches when it is a condition. */
export function removeStep(flow: Step[], id: string): Step[] {
  return flow
    .filter((step) => step.id !== id)
    .map((step) =>
      step.kind === 'condition'
        ? { ...step, yes: removeStep(step.yes ?? [], id), no: removeStep(step.no ?? [], id) }
        : step,
    );
}

export function updateFields(flow: Step[], id: string, fields: Record<string, string>): Step[] {
  return flow.map((step) =>
    step.id === id
      ? { ...step, fields }
      : step.kind === 'condition'
        ? {
            ...step,
            yes: updateFields(step.yes ?? [], id, fields),
            no: updateFields(step.no ?? [], id, fields),
          }
        : step,
  );
}

/** The step to select once `id` is gone: the one above it on its line, or its condition. */
export function stepAbove(flow: Step[], id: string, parent?: Step): Step | undefined {
  for (const [index, step] of flow.entries()) {
    if (step.id === id) return flow[index - 1] ?? parent;
    const found = stepAbove(step.yes ?? [], id, step) ?? stepAbove(step.no ?? [], id, step);
    if (found) return found;
  }
  return undefined;
}
