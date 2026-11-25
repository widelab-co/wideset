import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button/Button';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders trigger and content', () => {
    const { getByText } = render(
      <Modal>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Test Modal</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    expect(getByText('Open Modal')).toBeInTheDocument();
    expect(() => getByText('Test Modal')).toThrow();
  });

  it('opens modal when trigger is clicked', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <Modal>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    expect(queryByText('Modal Title')).not.toBeInTheDocument();

    await user.click(getByText('Open Modal'));

    await waitFor(() => {
      expect(getByText('Modal Title')).toBeInTheDocument();
    });
  });

  it('renders a close button by default', async () => {
    const { getByLabelText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  it('hides the close button when showCloseButton is false', async () => {
    const { queryByLabelText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content showCloseButton={false}>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  it('renders the close button even without a header', async () => {
    const { getByLabelText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  it('keeps Modal.Close working as a pass-through with asChild', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content showCloseButton={false}>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button>Cancel</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>,
    );

    await user.click(getByText('Cancel'));

    await waitFor(() => {
      expect(queryByText('Modal Title')).not.toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByText, queryByText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(getByText('Modal Title')).toBeInTheDocument();
    });

    await user.click(getByLabelText('Close modal'));

    await waitFor(() => {
      expect(queryByText('Modal Title')).not.toBeInTheDocument();
    });
  });
});

describe('Modal.Content', () => {
  it('applies custom className', async () => {
    render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content className="custom-container">
          <Modal.Title>Modal</Modal.Title>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      const container = document.querySelector('.custom-container');
      expect(container).toBeInTheDocument();
    });
  });

  it('prevents close on outside click and Escape when enabled', async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content persistent>
          <Modal.Header>
            <Modal.Title>Persistent Modal</Modal.Title>
          </Modal.Header>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(getByText('Persistent Modal')).toBeInTheDocument();
    });

    const overlay = document.querySelector('.bg-black\\/48');
    if (overlay) {
      await user.click(overlay);
    }

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(getByText('Persistent Modal')).toBeInTheDocument();
    });
  });

  it('closes via explicit close action', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByText, queryByText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Modal Title</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button aria-label="Close modal via footer" />
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => {
      expect(getByText('Modal Title')).toBeInTheDocument();
    });

    await user.click(getByLabelText('Close modal via footer'));

    await waitFor(() => {
      expect(queryByText('Modal Title')).not.toBeInTheDocument();
    });
  });
});

describe('Modal Snapshots', () => {
  it('matches snapshot for default modal', () => {
    const { baseElement } = render(
      <Modal defaultOpen>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Snapshot Title</Modal.Title>
            <Modal.Description>Snapshot Description</Modal.Description>
          </Modal.Header>
          <Modal.Body>Snapshot Content</Modal.Body>
          <Modal.Footer>
            <Button preset="filled">Save</Button>
            <Modal.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('matches snapshot for persistent modal', () => {
    const { baseElement } = render(
      <Modal defaultOpen>
        <Modal.Content persistent>
          <Modal.Header>
            <Modal.Title>Persistent Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>Persistent content</Modal.Body>
        </Modal.Content>
      </Modal>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});

describe('Modal.Content handlers', () => {
  it('runs the caller onEscapeKeyDown and still honours persistent', async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn();
    const { getByText } = render(
      <Modal defaultOpen>
        <Modal.Content persistent onEscapeKeyDown={onEscapeKeyDown}>
          <Modal.Title>Persistent Modal</Modal.Title>
        </Modal.Content>
      </Modal>,
    );

    await user.keyboard('{Escape}');

    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    expect(getByText('Persistent Modal')).toBeInTheDocument();
  });

  it('runs the caller onOpenAutoFocus and still honours autoFocusOnOpen', async () => {
    const onOpenAutoFocus = vi.fn();
    render(
      <Modal defaultOpen>
        <Modal.Content autoFocusOnOpen={false} onOpenAutoFocus={onOpenAutoFocus}>
          <Modal.Title>Modal</Modal.Title>
          <Button>Inside</Button>
        </Modal.Content>
      </Modal>,
    );

    await waitFor(() => expect(onOpenAutoFocus).toHaveBeenCalledTimes(1));
    expect(onOpenAutoFocus.mock.calls[0][0].defaultPrevented).toBe(true);
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    const { getByText } = render(
      <Modal defaultOpen>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Title</Modal.Title>
            <Modal.Description>Description</Modal.Description>
          </Modal.Header>
          <Modal.Body>Body</Modal.Body>
          <Modal.Footer>Footer</Modal.Footer>
        </Modal.Content>
      </Modal>,
    );
    await waitFor(() => expect(getByText('Title')).toBeInTheDocument());
    const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
    expect(getByText('Open')).toHaveAttribute('data-slot', 'modal-trigger');
    expect(slot('modal-overlay')).toBeInTheDocument();
    expect(slot('modal-content')).toHaveAttribute('role', 'dialog');
    expect(slot('modal-header')).toContainElement(getByText('Title'));
    expect(getByText('Title')).toHaveAttribute('data-slot', 'modal-title');
    expect(getByText('Description')).toHaveAttribute('data-slot', 'modal-description');
    expect(getByText('Body')).toHaveAttribute('data-slot', 'modal-body');
    expect(getByText('Footer')).toHaveAttribute('data-slot', 'modal-footer');
    expect(slot('modal-close')).toHaveAttribute('aria-label', 'Close modal');
  });
});
