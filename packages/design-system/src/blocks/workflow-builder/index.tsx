import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton, Toast, ToastProvider, useToast } from '@wideset/react';
import { type ReactNode, useEffect, useId, useState } from 'react';

import {
  initialFlow,
  initialName,
  sampleDeal,
  STAGES,
  type Step,
  STEP_TYPES,
  type StepKind,
} from './data';
import {
  allSteps,
  insertStep,
  isComplete,
  newStep,
  removeStep,
  type SequenceKey,
  stepAbove,
  updateFields,
} from './flow';
import { WorkflowSidebar } from './sidebar';
import { StepPanel } from './step-panel';
import { TurnOnDialog } from './turn-on-dialog';
import { WorkflowCanvas } from './workflow-canvas';
import { WorkflowHeader, type WorkflowState } from './workflow-header';

/**
 * The editor inside the card, under the toasts. It holds the workflow: its name, its state, the
 * steps and which one is selected. Every edit is kept as it is made, so there is no Save: the
 * switch that turns the workflow on is the page's one primary control.
 */
function WorkflowEditor({ sidebarToggle }: { sidebarToggle: ReactNode }) {
  const { showToast, dismissToast } = useToast();
  const [name, setName] = useState(initialName);
  const [state, setState] = useState<WorkflowState>('draft');
  const [flow, setFlow] = useState(initialFlow);
  const [selectedId, setSelectedId] = useState('notify-manager');
  const [confirming, setConfirming] = useState(false);
  // A step to move the focus to once it is on screen (after a delete or its undo).
  const [focusId, setFocusId] = useState<string>();

  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`step-${focusId}`)?.focus();
    setFocusId(undefined);
  }, [focusId]);

  const steps = allSteps(flow);
  const selected = steps.find((step) => step.id === selectedId) ?? flow[0];
  const unfinished = steps.filter((step) => !isComplete(step));
  const stage = STAGES.find((option) => option.value === flow[0].fields.stage)?.label ?? '';

  const insert = (sequence: SequenceKey, index: number, kind: StepKind) => {
    const step = newStep(kind);
    setFlow(insertStep(flow, sequence, index, step));
    setSelectedId(step.id);
  };

  const remove = (step: Step) => {
    if (step.kind === 'trigger') return;
    const before = flow;
    const above = stepAbove(flow, step.id) ?? flow[0];
    setFlow(removeStep(flow, step.id));
    setSelectedId(above.id);
    setFocusId(above.id);

    const inside = allSteps([step]).length - 1;
    const id = showToast({
      content:
        step.kind === 'condition' && inside > 0
          ? `Condition deleted with its ${inside === 1 ? 'step' : `${inside} steps`}`
          : `${STEP_TYPES[step.kind].label} step deleted`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setFlow(before);
            setSelectedId(step.id);
            setFocusId(step.id);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const switchTo = (on: boolean) => {
    // The first time it goes on, it asks; after that the switch applies at once.
    if (on && state === 'draft') {
      setConfirming(true);
      return;
    }
    setState(on ? 'on' : 'off');
    showToast(
      on
        ? { status: 'success', content: 'Workflow on' }
        : { content: 'Workflow off. Deals that change stage no longer run it.' },
    );
  };

  const testRun = () => {
    const stuck = unfinished[0];
    if (stuck) {
      const field = STEP_TYPES[stuck.kind].fields.find(
        (option) => option.missing && !stuck.fields[option.name]?.trim(),
      );
      setSelectedId(stuck.id);
      showToast({
        status: 'error',
        content: `Test run stopped at ${STEP_TYPES[stuck.kind].label}. ${field?.missing ?? ''}`,
      });
      return;
    }
    showToast({
      status: 'success',
      content: `Test run passed with ${sampleDeal.name}. Nothing was sent.`,
    });
  };

  return (
    <>
      <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
        {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
            left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
        <div className="gap-ws-5 px-ws-11 flex w-full items-center">
          {sidebarToggle}
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href="#automations">Automations</a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>{name}</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
      </div>

      <WorkflowHeader
        name={name}
        onNameChange={setName}
        description={`Starts when a deal moves to ${stage}. Changes save as you go.`}
        state={state}
        unfinished={unfinished.length}
        onSwitch={switchTo}
        onTestRun={testRun}
      />

      {/* The canvas fills the card under the header; the panel runs beside it, full height. */}
      <div className="flex min-h-0 flex-1">
        <WorkflowCanvas
          flow={flow}
          selectedId={selected.id}
          onSelect={setSelectedId}
          onInsert={insert}
          onDeleteKey={() => remove(selected)}
        />
        <StepPanel
          step={selected}
          onFieldsChange={(fields) => setFlow(updateFields(flow, selected.id, fields))}
          onDelete={() => remove(selected)}
        />
      </div>

      <TurnOnDialog
        stage={stage}
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={() => {
          setState('on');
          showToast({
            status: 'success',
            content: `Workflow on. It runs on the next deal that moves to ${stage}.`,
          });
        }}
      />
    </>
  );
}

/**
 * Workflow builder (Inset direction): an automation in Orbit on the raised page beside the
 * workspace sidebar, with Automations open. The header names the workflow and holds its state,
 * the switch that turns it on and Test run; under it the steps stand on a plain canvas, joined by
 * lines with a "+" on each to insert a step, and the selected step's settings fill a 22rem panel
 * beside it. Delete removes the selected step with Undo; the zoom controls sit in a corner.
 */
export default function WorkflowBuilder() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div className="bg-ws-static-background flex h-dvh">
        <WorkflowSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          <WorkflowEditor
            sidebarToggle={
              <IconButton
                icon={RiSideBarLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-subtle size-ws-9"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls={sidebarId}
                onClick={() => setCollapsed(!collapsed)}
                className="-ml-ws-5"
              />
            }
          />
        </main>
      </div>
    </ToastProvider>
  );
}
