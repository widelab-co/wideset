import { RiDownloadLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ListItem } from './ListItem';

describe('ListItem', () => {
  describe('Basic rendering', () => {
    it('renders list item with label', () => {
      render(
        <ListItem>
          <ListItem.Label>Test Label</ListItem.Label>
        </ListItem>,
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ListItem className="custom-class">
          <ListItem.Label>Test Label</ListItem.Label>
        </ListItem>,
      );
      const listItem = container.firstChild as HTMLElement;
      expect(listItem).toHaveClass('custom-class');
    });

    it('forwards ref to the root element', () => {
      const ref = vi.fn();
      render(
        <ListItem ref={ref}>
          <ListItem.Label>Test Label</ListItem.Label>
        </ListItem>,
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Event handlers', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <ListItem onClick={handleClick}>
          <ListItem.Label>Clickable Item</ListItem.Label>
        </ListItem>,
      );

      const item = screen.getByText('Clickable Item');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('ListItem Snapshots', () => {
  describe('Variants', () => {
    it('matches snapshot for primary variant', () => {
      const { container } = render(
        <ListItem variant="primary">
          <ListItem.Label>Primary Item</ListItem.Label>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for danger variant', () => {
      const { container } = render(
        <ListItem variant="danger">
          <ListItem.Label>Danger Item</ListItem.Label>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Selected state', () => {
    it('matches snapshot for selected primary item', () => {
      const { container } = render(
        <ListItem variant="primary" data-state="checked">
          <ListItem.Content>
            <ListItem.Label>Selected Primary Item</ListItem.Label>
            <ListItem.Description>Description</ListItem.Description>
          </ListItem.Content>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for selected danger item', () => {
      const { container } = render(
        <ListItem variant="danger" data-state="checked">
          <ListItem.Content>
            <ListItem.Label>Selected Danger Item</ListItem.Label>
            <ListItem.Description>Description</ListItem.Description>
          </ListItem.Content>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Disabled state', () => {
    it('matches snapshot for disabled item', () => {
      const { container } = render(
        <ListItem data-disabled>
          <ListItem.Label>Disabled Item</ListItem.Label>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Sub-components', () => {
    it('matches snapshot with content (label and description)', () => {
      const { container } = render(
        <ListItem>
          <ListItem.Content>
            <ListItem.Label>Label</ListItem.Label>
            <ListItem.Description>Description</ListItem.Description>
          </ListItem.Content>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with prefix and suffix', () => {
      const { container } = render(
        <ListItem>
          <ListItem.Prefix>
            <RiDownloadLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Label>Label with Prefix</ListItem.Label>
          <ListItem.Suffix>Suffix</ListItem.Suffix>
        </ListItem>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('ListItem data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <ListItem>
        <ListItem.Prefix>
          <RiDownloadLine />
        </ListItem.Prefix>
        <ListItem.Content>
          <ListItem.Label>Download</ListItem.Label>
          <ListItem.Description>2.4 MB</ListItem.Description>
        </ListItem.Content>
        <ListItem.Suffix>PDF</ListItem.Suffix>
      </ListItem>,
    );
    expect(container.querySelector('[data-slot="list-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-item-prefix"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-item-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-item-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-item-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-item-suffix"]')).toBeInTheDocument();
  });

  it("lets a caller's data-slot win", () => {
    const { container } = render(<ListItem data-slot="dropdown-menu-item">Download</ListItem>);
    expect(container.querySelector('[data-slot="dropdown-menu-item"]')).toBeInTheDocument();
  });
});
