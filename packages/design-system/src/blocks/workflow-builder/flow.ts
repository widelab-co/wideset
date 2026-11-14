import { type Step, STEP_TYPES, type StepKind } from './data';

/**
 * Where a step sits: `root` is the main line, `<conditionId>:yes` and `<conditionId>:no` a
 * condition's branches.
 */
export type SequenceKey = 'root' | `${string}:${'yes' | 'no'}`;

/** Every step in reading order: down the line, the Yes branch before the No branch. */
export function allSteps(flow: Step[]): Step[] {
  return flow.flatMap((step) => [step, ...allSteps(step.yes ?? []), ...allSteps(step.no ?? [])]);
}

/** A step cannot run while a field it needs is empty. */
export const isComplete = (step: Step) =>
  STEP_TYPES[step.kind].fields.every((field) => !field.missing || step.fields[field.name]?.trim());

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
