import { RiMoreLine } from '@remixicon/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';

describe('Toast', () => {
  it('renders children', () => {
    render(<Toast>Hello</Toast>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('forwards HTML attributes', () => {
    render(
      <Toast data-testid="test-toast" aria-describedby="toast-description" id="custom-toast">
        Neutral
      </Toast>,
    );

    const toast = screen.getByTestId('test-toast');
    expect(toast).toHaveAttribute('aria-describedby', 'toast-description');
    expect(toast).toHaveAttribute('id', 'custom-toast');
  });

  it('applies custom className', () => {
    const { container } = render(<Toast className="my-extra-class">Content</Toast>);
    expect(container.firstChild).toHaveClass('my-extra-class');
  });

  it('sets role based on status', () => {
    const { rerender } = render(<Toast status="error">Error</Toast>);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(<Toast status="success">Success</Toast>);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Toast status="info">Info</Toast>);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Toast status="neutral">Neutral</Toast>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows an icon for error/success/info and none for neutral', () => {
    const { container, rerender } = render(<Toast status="error">Error</Toast>);

    const getIcon = () => container.querySelector('svg');
    expect(getIcon()).toBeInTheDocument();

    rerender(<Toast status="success">Success</Toast>);
    expect(getIcon()).toBeInTheDocument();

    rerender(<Toast status="info">Info</Toast>);
    expect(getIcon()).toBeInTheDocument();

    rerender(<Toast status="neutral">Neutral</Toast>);
    expect(getIcon()).not.toBeInTheDocument();
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<Toast>Non-dismissible toast</Toast>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('renders dismiss IconButton when onDismiss is provided and calls it', () => {
    const onDismiss = vi.fn();
    render(
      <Toast status="info" onDismiss={onDismiss}>
        Dismiss me
      </Toast>,
    );
    const btn = screen.getByLabelText('Dismiss');
    expect(btn.tagName).toBe('BUTTON');

    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('forwards HTML attributes to the root element', () => {
    render(
      <Toast status="neutral" data-testid="test-toast" aria-label="status message" id="toast-id">
        Content
      </Toast>,
    );
    const el = screen.getByTestId('test-toast');
    expect(el).toHaveAttribute('aria-label', 'status message');
    expect(el).toHaveAttribute('id', 'toast-id');
    expect(el).toHaveAttribute('role', 'status');
  });

  it('renders expanded variant with description, action, and progress', () => {
    render(
      <Toast variant="expanded" progress={40}>
        <Toast.Message>Expanded title</Toast.Message>
        <Toast.Description>More details</Toast.Description>
        <Toast.Action>Action</Toast.Action>
      </Toast>,
    );

    expect(screen.getByText('Expanded title')).toBeInTheDocument();
    expect(screen.getByText('More details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progress' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
  });
});

describe('Toast.Action', () => {
  it('renders an action button and forwards props', () => {
    const onClick = vi.fn();
    render(
      <Toast status="success">
        <Toast.Message>Saved</Toast.Message>
        <Toast.Action onClick={onClick}>Undo</Toast.Action>
      </Toast>,
    );
    const actionBtn = screen.getByRole('button', { name: 'Undo' });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders every action in order on an expanded toast', () => {
    render(
      <Toast variant="expanded">
        <Toast.Message>Export finished</Toast.Message>
        <Toast.Action>Open folder</Toast.Action>
        <Toast.Action>Undo</Toast.Action>
      </Toast>,
    );
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Open folder',
      'Undo',
    ]);
  });

  it('renders only the first action on a basic toast, with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Toast>
        <Toast.Message>Export finished</Toast.Message>
        <Toast.Action>Open folder</Toast.Action>
        <Toast.Action>Undo</Toast.Action>
      </Toast>,
    );
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Open folder',
    ]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('basic toast shows one'));
    warn.mockRestore();
  });
});

describe('ToastContainer', () => {
  it('makes overflow toasts inert', () => {
    const toasts = [1, 2, 3, 4].map((number) => ({
      id: String(number),
      content: `Toast ${number}`,
      createdAt: 0,
      duration: 0,
    }));

    render(<ToastContainer toasts={toasts} onDismiss={vi.fn()} position="bottom-right" now={0} />);

    expect(screen.getByText('Toast 1').closest('[role="status"]')?.parentElement).toHaveAttribute(
      'inert',
    );
    expect(
      screen.getByText('Toast 4').closest('[role="status"]')?.parentElement,
    ).not.toHaveAttribute('inert');
  });
});

// Snapshot Tests
describe('Toast Snapshots', () => {
  it('matches snapshot for each status (no action, no dismiss)', () => {
    (['error', 'success', 'info', 'neutral'] as const).forEach((status) => {
      const { container } = render(<Toast status={status}>A {status} message</Toast>);
      expect(container.firstChild).toMatchSnapshot(`Toast ${status}`);
    });
  });

  it('matches snapshot with dismiss button', () => {
    const { container } = render(
      <Toast status="info" onDismiss={() => {}}>
        Info with dismiss
      </Toast>,
    );
    expect(container.firstChild).toMatchSnapshot('Toast with dismiss');
  });

  it('matches snapshot with action', () => {
    const { container } = render(
      <Toast status="success">
        <Toast.Message>Saved successfully</Toast.Message>
        <Toast.Action>Undo</Toast.Action>
      </Toast>,
    );
    expect(container.firstChild).toMatchSnapshot('Toast with action');
  });

  it('matches snapshot with action + dismiss + custom class', () => {
    const { container } = render(
      <Toast status="error" onDismiss={() => {}} className="extra">
        <Toast.Message>Something went wrong</Toast.Message>
        <Toast.Action>Retry</Toast.Action>
      </Toast>,
    );
    expect(container.firstChild).toMatchSnapshot('Toast full');
  });

  it('matches snapshot for expanded variant', () => {
    const { container } = render(
      <Toast status="info" variant="expanded">
        <Toast.Message>Expanded toast</Toast.Message>
        <Toast.Description>Extra context</Toast.Description>
        <Toast.Action>View</Toast.Action>
      </Toast>,
    );
    expect(container.firstChild).toMatchSnapshot('Toast expanded');
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    render(
      <Toast variant="expanded" status="info" onDismiss={vi.fn()}>
        <Toast.Message>Message</Toast.Message>
        <Toast.Description>Description</Toast.Description>
        <Toast.IconAction icon={RiMoreLine} aria-label="More" />
        <Toast.Action>Reload</Toast.Action>
      </Toast>,
    );
    expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'toast');
    expect(screen.getByText('Message')).toHaveAttribute('data-slot', 'toast-message');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'toast-description');
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute(
      'data-slot',
      'toast-icon-action',
    );
    expect(screen.getByRole('button', { name: 'Reload' })).toHaveAttribute(
      'data-slot',
      'toast-action',
    );
  });

  it('marks the message line of a basic toast and the container', () => {
    render(
      <ToastContainer
        toasts={[{ id: '1', content: 'Saved', createdAt: 0, duration: 0 }]}
        onDismiss={vi.fn()}
        position="bottom-right"
        now={0}
      />,
    );
    expect(screen.getByText('Saved')).toHaveAttribute('data-slot', 'toast-message');
    expect(document.querySelector('[data-slot="toast-container"]')).toContainElement(
      screen.getByRole('status'),
    );
  });
});
