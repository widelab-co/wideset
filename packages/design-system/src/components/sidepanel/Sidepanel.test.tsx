import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';
import { Sidepanel } from './Sidepanel';

describe('Sidepanel', () => {
  describe('Rendering', () => {
    it('renders the trigger', () => {
      render(
        <Sidepanel>
          <Sidepanel.Trigger>Open Sidepanel</Sidepanel.Trigger>
          <Sidepanel.Panel>
            <Sidepanel.Header>
              <Sidepanel.Title>Test Sidepanel</Sidepanel.Title>
            </Sidepanel.Header>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      expect(screen.getByRole('button', { name: 'Open Sidepanel' })).toBeInTheDocument();
    });

    it('does not render panel content before opening', () => {
      render(
        <Sidepanel>
          <Sidepanel.Trigger>Open Sidepanel</Sidepanel.Trigger>
          <Sidepanel.Panel>
            <Sidepanel.Header>
              <Sidepanel.Title>Test Sidepanel</Sidepanel.Title>
            </Sidepanel.Header>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders panel content when defaultOpen', async () => {
      render(
        <Sidepanel defaultOpen>
          <Sidepanel.Panel>
            <Sidepanel.Header>
              <Sidepanel.Title>Sidepanel Title</Sidepanel.Title>
            </Sidepanel.Header>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('applies custom className to the panel', async () => {
      render(
        <Sidepanel defaultOpen>
          <Sidepanel.Trigger>Open</Sidepanel.Trigger>
          <Sidepanel.Panel className="custom-panel">
            <Sidepanel.Title>Sidepanel</Sidepanel.Title>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      await waitFor(() => {
        expect(document.querySelector('.custom-panel')).toBeInTheDocument();
      });
    });
  });

  describe('Interaction', () => {
    it('opens panel when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Sidepanel>
          <Sidepanel.Trigger>Open Sidepanel</Sidepanel.Trigger>
          <Sidepanel.Panel>
            <Sidepanel.Header>
              <Sidepanel.Title>Sidepanel Title</Sidepanel.Title>
            </Sidepanel.Header>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Open Sidepanel' }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('closes panel when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Sidepanel defaultOpen>
          <Sidepanel.Trigger>Open</Sidepanel.Trigger>
          <Sidepanel.Panel>
            <Sidepanel.Header>
              <Sidepanel.Title>Sidepanel Title</Sidepanel.Title>
            </Sidepanel.Header>
            <Sidepanel.Footer>
              <Sidepanel.Close asChild>
                <Button aria-label="Close sidepanel" />
              </Sidepanel.Close>
            </Sidepanel.Footer>
          </Sidepanel.Panel>
        </Sidepanel>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Close sidepanel' }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});

describe('Sidepanel Snapshots', () => {
  it('matches snapshot for default sidepanel', () => {
    const { asFragment } = render(
      <Sidepanel defaultOpen>
        <Sidepanel.Panel>
          <Sidepanel.Header>
            <Sidepanel.Title>Snapshot Title</Sidepanel.Title>
            <Sidepanel.Description>Snapshot Description</Sidepanel.Description>
          </Sidepanel.Header>
          <Sidepanel.Content>Snapshot Content</Sidepanel.Content>
          <Sidepanel.Footer>
            <Button preset="filled">Save</Button>
            <Sidepanel.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Sidepanel.Close>
          </Sidepanel.Footer>
        </Sidepanel.Panel>
      </Sidepanel>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot for left sidepanel', () => {
    const { asFragment } = render(
      <Sidepanel defaultOpen>
        <Sidepanel.Panel side="left" size="sm">
          <Sidepanel.Header>
            <Sidepanel.Title>Left Panel</Sidepanel.Title>
          </Sidepanel.Header>
          <Sidepanel.Content>Content</Sidepanel.Content>
        </Sidepanel.Panel>
      </Sidepanel>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', async () => {
    render(
      <Sidepanel defaultOpen>
        <Sidepanel.Trigger>Open</Sidepanel.Trigger>
        <Sidepanel.Panel>
          <Sidepanel.Actions>
            <Sidepanel.Close>Close</Sidepanel.Close>
          </Sidepanel.Actions>
          <Sidepanel.Header>
            <Sidepanel.Title>Title</Sidepanel.Title>
            <Sidepanel.Description>Description</Sidepanel.Description>
          </Sidepanel.Header>
          <Sidepanel.Content>Content</Sidepanel.Content>
          <Sidepanel.Footer>Footer</Sidepanel.Footer>
        </Sidepanel.Panel>
      </Sidepanel>,
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);
    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'sidepanel-trigger');
    expect(slot('sidepanel-overlay')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-slot', 'sidepanel-panel');
    expect(slot('sidepanel-actions')).toContainElement(screen.getByText('Close'));
    expect(screen.getByText('Close')).toHaveAttribute('data-slot', 'sidepanel-close');
    expect(slot('sidepanel-header')).toContainElement(screen.getByText('Title'));
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'sidepanel-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'sidepanel-description');
    expect(screen.getByText('Content')).toHaveAttribute('data-slot', 'sidepanel-content');
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'sidepanel-footer');
  });
});

describe('Focus', () => {
  it('focuses the dialog itself, without a browser outline, when nothing inside can take focus', async () => {
    render(
      <Sidepanel defaultOpen>
        <Sidepanel.Panel>
          <Sidepanel.Title>Title</Sidepanel.Title>
        </Sidepanel.Panel>
      </Sidepanel>,
    );
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveFocus());
    expect(dialog).toHaveClass('outline-hidden');
  });
});
