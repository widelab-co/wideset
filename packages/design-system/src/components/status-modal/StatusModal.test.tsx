import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { StatusModal } from './StatusModal';

describe('StatusModal', () => {
  it('renders trigger and content', () => {
    const { getByText } = render(
      <StatusModal>
        <StatusModal.Trigger>Open StatusModal</StatusModal.Trigger>
        <StatusModal.Content>
          <StatusModal.Title>Test StatusModal</StatusModal.Title>
        </StatusModal.Content>
      </StatusModal>,
    );

    expect(getByText('Open StatusModal')).toBeInTheDocument();
    expect(() => getByText('Test StatusModal')).toThrow();
  });

  it('opens status modal when trigger is clicked', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <StatusModal status="positive" orientation="horizontal">
        <StatusModal.Trigger>Open StatusModal</StatusModal.Trigger>
        <StatusModal.Content>
          <StatusModal.Title>Status Title</StatusModal.Title>
          <StatusModal.Body>Status Content</StatusModal.Body>
        </StatusModal.Content>
      </StatusModal>,
    );

    expect(queryByText('Status Title')).not.toBeInTheDocument();

    await user.click(getByText('Open StatusModal'));

    await waitFor(() => {
      expect(getByText('Status Title')).toBeInTheDocument();
      expect(getByText('Status Content')).toBeInTheDocument();
    });
  });

  it('uses fixed max width 600px', async () => {
    render(
      <StatusModal defaultOpen>
        <StatusModal.Content>
          <StatusModal.Title>Fixed Width</StatusModal.Title>
        </StatusModal.Content>
      </StatusModal>,
    );

    await waitFor(() => {
      const container = document.querySelector('[role="dialog"]');
      expect(container).toHaveClass('max-w-[600px]');
    });
  });

  it('renders status icon for error status', async () => {
    render(
      <StatusModal defaultOpen status="error">
        <StatusModal.Content>
          <StatusModal.Title>Error Title</StatusModal.Title>
        </StatusModal.Content>
      </StatusModal>,
    );

    await waitFor(() => {
      const statusIcon = Array.from(
        document.querySelectorAll('[role="dialog"] svg[aria-hidden="true"]'),
      ).find((svg) => !svg.closest('button'));
      expect(statusIcon).toBeInTheDocument();
    });
  });

  it('does not render icon for neutral status', async () => {
    render(
      <StatusModal defaultOpen status="neutral">
        <StatusModal.Content>
          <StatusModal.Title>Neutral Title</StatusModal.Title>
        </StatusModal.Content>
      </StatusModal>,
    );

    await waitFor(() => {
      const statusIcon = Array.from(
        document.querySelectorAll('[role="dialog"] svg[aria-hidden="true"]'),
      ).find((svg) => !svg.closest('button'));
      expect(statusIcon).toBeUndefined();
    });
  });
});

describe('StatusModal snapshots', () => {
  it('matches snapshot for default status modal', () => {
    const { baseElement } = render(
      <StatusModal defaultOpen status="neutral" orientation="horizontal">
        <StatusModal.Content>
          <StatusModal.Title>Snapshot Title</StatusModal.Title>
          <StatusModal.Body>Snapshot Content</StatusModal.Body>
        </StatusModal.Content>
      </StatusModal>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('matches snapshot for positive vertical status modal', () => {
    const { baseElement } = render(
      <StatusModal defaultOpen status="positive" orientation="vertical">
        <StatusModal.Content>
          <StatusModal.Title>Positive</StatusModal.Title>
          <StatusModal.Body>Positive content</StatusModal.Body>
        </StatusModal.Content>
      </StatusModal>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('matches snapshot for error status modal', () => {
    const { baseElement } = render(
      <StatusModal defaultOpen status="error" orientation="horizontal">
        <StatusModal.Content>
          <StatusModal.Title>Error</StatusModal.Title>
          <StatusModal.Body>Error content</StatusModal.Body>
        </StatusModal.Content>
      </StatusModal>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    const { getByText } = render(
      <StatusModal defaultOpen status="error">
        <StatusModal.Trigger>Open</StatusModal.Trigger>
        <StatusModal.Content>
          <StatusModal.Title>Title</StatusModal.Title>
          <StatusModal.Body>Body</StatusModal.Body>
          <StatusModal.Footer>
            <StatusModal.Close>Cancel</StatusModal.Close>
          </StatusModal.Footer>
        </StatusModal.Content>
      </StatusModal>,
    );
    await waitFor(() => expect(getByText('Title')).toBeInTheDocument());
    const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
    expect(getByText('Open')).toHaveAttribute('data-slot', 'status-modal-trigger');
    expect(slot('status-modal-overlay')).toBeInTheDocument();
    expect(slot('status-modal-content')).toHaveAttribute('role', 'dialog');
    expect(slot('status-modal-icon')).toBeInTheDocument();
    expect(getByText('Title')).toHaveAttribute('data-slot', 'status-modal-title');
    expect(getByText('Body')).toHaveAttribute('data-slot', 'status-modal-body');
    expect(slot('status-modal-footer')).toContainElement(getByText('Cancel'));
    expect(getByText('Cancel')).toHaveAttribute('data-slot', 'status-modal-close');
    expect(document.querySelector('[aria-label="Close status modal"]')).toHaveAttribute(
      'data-slot',
      'status-modal-close',
    );
  });
});
