import { RiDownloadLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';
import { IconButton } from '../button/IconButton';
import { Tag } from '../tag/Tag';
import { Card } from './Card';

const variants = ['bordered', 'flat'] as const;
const mediaRatios = ['16/9', '21/9', '1/1'] as const;

describe('Card', () => {
  it.each(variants)('should match snapshot for variant="%s"', (variant) => {
    const { container } = render(
      <Card variant={variant}>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>Content here</Card.Content>
        <Card.Footer>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
          <Button preset="filled">Accept</Button>
        </Card.Footer>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with header only', () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with content only', () => {
    const { container } = render(
      <Card>
        <Card.Content>Only content, no header or footer.</Card.Content>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with content and footer only', () => {
    const { container } = render(
      <Card>
        <Card.Content>Card content.</Card.Content>
        <Card.Footer>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Card.Footer>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with header and footer only', () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Card.Footer>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with header action containing icon button', () => {
    const { container } = render(
      <Card variant="bordered" className="w-[350px]">
        <Card.Header>
          <div className="gap-ws-6 flex items-start justify-between">
            <div>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>Card Description</Card.Description>
            </div>
            <Card.Action>
              <IconButton icon={RiDownloadLine} preset="ghost" size="md" variant="secondary" />
            </Card.Action>
          </div>
        </Card.Header>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with header action containing tag', () => {
    const { container } = render(
      <Card variant="bordered" className="w-[350px]">
        <Card.Header>
          <div className="gap-ws-6 flex items-start justify-between">
            <div>
              <Card.Title>Card Title</Card.Title>
              <Card.Description>Card Description</Card.Description>
            </div>
            <Card.Action>
              <Tag color="red" preset="filled" size="md">
                important
              </Tag>
            </Card.Action>
          </div>
        </Card.Header>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  describe('Card.Media', () => {
    it.each(mediaRatios)('should match snapshot for ratio="%s"', (ratio) => {
      const { container } = render(
        <Card variant="bordered" className="w-[300px]">
          <Card.Media ratio={ratio}>
            <img src="https://example.com/image.jpg" alt="Test" width="200" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Media Card {ratio}</Card.Title>
            <Card.Description>Media Card Description</Card.Description>
          </Card.Header>
        </Card>,
      );
      expect(container).toMatchSnapshot();
    });

    it.each(variants)('should match snapshot for media with variant="%s"', (variant) => {
      const { container } = render(
        <Card variant={variant} className="w-[300px]">
          <Card.Media ratio="16/9">
            <img src="https://example.com/image.jpg" alt="Test" width="200" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Media Card</Card.Title>
            <Card.Description>Media Card Description</Card.Description>
          </Card.Header>
        </Card>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

describe('Card data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <Card>
        <Card.Media>
          <img src="cover.png" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Weekly report</Card.Title>
          <Card.Description>Sent every Monday.</Card.Description>
          <Card.Action>
            <Tag>New</Tag>
          </Card.Action>
        </Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-media"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
  });
});

describe('Card divider', () => {
  const renderCard = (divider?: boolean) =>
    render(
      <Card divider={divider}>
        <Card.Header aria-label="Header">
          <Card.Title>Weekly report</Card.Title>
        </Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer aria-label="Footer">Footer</Card.Footer>
      </Card>,
    );

  it('draws no header or footer line by default', () => {
    renderCard();
    expect(screen.getByLabelText('Header')).not.toHaveClass('[&:not(:last-child)]:border-b');
    expect(screen.getByLabelText('Footer')).not.toHaveClass('[&:not(:first-child)]:border-t');
  });

  it('closes the gap padding by default so the content padding is the whole gap', () => {
    renderCard();
    expect(screen.getByLabelText('Header')).toHaveClass('[&:has(+[data-slot=card-content])]:pb-0');
    expect(screen.getByLabelText('Footer')).toHaveClass('[[data-slot=card-content]+&]:pt-0');
  });

  it('draws a line under the header and above the footer with divider', () => {
    renderCard(true);
    expect(screen.getByLabelText('Header')).toHaveClass('[&:not(:last-child)]:border-b');
    expect(screen.getByLabelText('Footer')).toHaveClass('[&:not(:first-child)]:border-t');
  });

  it('does not pass divider to the DOM', () => {
    const { container } = renderCard(true);
    expect(container.querySelector('[data-slot="card"]')).not.toHaveAttribute('divider');
  });
});

describe('Card.Title', () => {
  it('renders an h3 by default', () => {
    render(<Card.Title>Weekly report</Card.Title>);
    expect(screen.getByRole('heading', { name: 'Weekly report', level: 3 })).toBeInTheDocument();
  });

  it('renders the child heading with asChild', () => {
    render(
      <Card.Title asChild className="custom">
        <h2>Weekly report</h2>
      </Card.Title>,
    );
    const heading = screen.getByRole('heading', { name: 'Weekly report', level: 2 });
    expect(heading).toHaveAttribute('data-slot', 'card-title');
    expect(heading).toHaveClass('typography-subtitle-sm', 'custom');
  });
});

describe('Card styling hooks', () => {
  it('keeps the header marker when the caller overrides data-slot', () => {
    render(
      <Card>
        <Card.Header data-slot="report-header" aria-label="Header">
          <Card.Title>Weekly report</Card.Title>
        </Card.Header>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    const header = screen.getByLabelText('Header');
    expect(header).toHaveAttribute('data-slot', 'report-header');
    expect(header).toHaveClass('ws-card-header');
  });
});
