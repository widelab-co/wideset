import { Button, Modal, ProgressStepper } from '@wideset/react';
import { useId, useState } from 'react';

import { PAYMENT_STEP, STEPS } from './data';
import { KeyboardHints } from './keyboard-hints';
import { PaymentForm } from './payment-form';

type SetupAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Figma's Modal `Type=Stepper`: a setup done in order. The steps run down the left with their
 * state (done, current, still ahead) and lead back to a finished one; the current step's heading,
 * form and actions sit beside them, and the keyboard hints run under both. Each step is a form
 * the footer's button submits by id, so a step moves on only once it is valid. Only the payment
 * step has its form here; the others are yours to fill.
 */
export function SetupAccountModal({ open, onOpenChange }: SetupAccountModalProps) {
  const id = useId();
  const [step, setStep] = useState(PAYMENT_STEP);
  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : onOpenChange(false));

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        className="max-w-[60rem]"
        onOpenAutoFocus={(event) => {
          // Start in the step's first field when it has one; otherwise the Modal picks.
          const field = document.getElementById(`${id}-number`);
          if (!field) return;
          event.preventDefault();
          field.focus();
        }}
      >
        <div className="flex min-h-0 flex-1">
          <nav
            aria-labelledby={`${id}-setup`}
            className="border-ws-static-base gap-ws-11 p-ws-11 flex w-[16.25rem] shrink-0 flex-col border-r"
          >
            <p id={`${id}-setup`} className="typography-subtitle-xs text-ws-static-strong h-ws-13">
              Setup Account
            </p>
            {/*
              Composed, so each step can fill its row as in Figma (`w-full`: the array form sizes a
              step to its title). A step ahead stays closed until the ones before it are done.
            */}
            <ProgressStepper orientation="vertical" activeStep={step} onStepChange={setStep}>
              {STEPS.map(({ title }, index) => (
                <ProgressStepper.Step
                  key={title}
                  step={index}
                  title={title}
                  orientation="vertical"
                  status={index < step ? 'completed' : index === step ? 'active' : 'incomplete'}
                  disabled={index > step}
                  className="w-full"
                />
              ))}
            </ProgressStepper>
          </nav>
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Figma's Header with Divider off: the form follows its heading without a line. */}
            <Modal.Header className="border-b-0">
              <Modal.Title>{STEPS[step].title}</Modal.Title>
              <Modal.Description>{STEPS[step].description}</Modal.Description>
            </Modal.Header>
            <Modal.Body>
              {step === PAYMENT_STEP ? (
                <PaymentForm id={id} onSubmit={next} />
              ) : (
                <form
                  id={id}
                  onSubmit={(event) => {
                    event.preventDefault();
                    next();
                  }}
                >
                  <p className="typography-body-md text-ws-static-subtle">Nothing here yet.</p>
                </form>
              )}
            </Modal.Body>
            <Modal.Footer className="items-center">
              <p className="typography-body-md text-ws-static-subtle mr-ws-9 min-w-0 flex-1 tabular-nums">
                Step {step + 1} of {STEPS.length}
              </p>
              <Modal.Close asChild>
                <Button variant="secondary" preset="border">
                  Cancel
                </Button>
              </Modal.Close>
              <Button type="submit" form={id}>
                Continue
              </Button>
            </Modal.Footer>
          </div>
        </div>
        <Modal.Footer variant="extension" className="items-center">
          <KeyboardHints />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
