import { RiImageLine, RiMusic2Fill } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Thumbnail } from './Thumbnail';
import { getThumbnailType } from './Thumbnail.logic';
import type { ThumbnailFileType, ThumbnailSize } from './Thumbnail.types';

const sizes: ThumbnailSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const fileTypes: ThumbnailFileType[] = ['pdf', 'spreadsheet', 'document', 'video', 'picture'];

describe('Thumbnail', () => {
  describe('content mode follows the prop', () => {
    it('renders the default bar-chart icon on the purple tile with nothing passed', () => {
      const { container } = render(<Thumbnail data-testid="thumb" />);

      expect(screen.getByTestId('thumb')).toHaveClass('bg-ws-non-semantic-purple-strong');
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a custom Icon', () => {
      const { container: custom } = render(<Thumbnail icon={RiMusic2Fill} />);
      const { container: fallback } = render(<Thumbnail />);

      expect(custom.querySelector('svg path')?.getAttribute('d')).not.toEqual(
        fallback.querySelector('svg path')?.getAttribute('d'),
      );
    });

    it('renders an image that fills the tile when src is passed', () => {
      render(<Thumbnail src="https://example.com/a.jpg" alt="A" data-testid="thumb" />);

      const img = screen.getByAltText('A');
      expect(img).toHaveAttribute('src', 'https://example.com/a.jpg');
      expect(img).toHaveClass('size-full', 'object-cover');
      expect(screen.getByTestId('thumb')).not.toHaveClass('bg-ws-non-semantic-purple-strong');
    });

    it('renders a logo at glyph size on a white bordered tile', () => {
      render(
        <Thumbnail type="logo" src="https://example.com/logo.svg" alt="Acme" data-testid="thumb" />,
      );

      expect(screen.getByTestId('thumb')).toHaveClass(
        'bg-ws-static-highlight-base',
        'border-ws-static-subtle',
        'border',
      );
      expect(screen.getByAltText('Acme')).toHaveClass('size-ws-9', 'object-contain');
    });

    it('renders text on the purple tile', () => {
      render(<Thumbnail text="W" data-testid="thumb" />);

      expect(screen.getByText('W')).toHaveClass('typography-caption-strong-sm');
      expect(screen.getByTestId('thumb')).toHaveClass('bg-ws-non-semantic-purple-strong');
    });

    it.each(fileTypes)('renders the fixed glyph and hue for type="%s"', (type) => {
      const { container } = render(<Thumbnail type={type} data-testid="thumb" />);

      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByTestId('thumb').className).toMatch(
        /bg-ws-non-semantic-[a-z]+-strong text-ws-non-semantic-[a-z]+-on-strong/,
      );
    });

    it('paints the PDF kind with the red token pair, never a raw colour', () => {
      render(<Thumbnail type="pdf" data-testid="thumb" />);

      const thumb = screen.getByTestId('thumb');
      expect(thumb).toHaveClass(
        'bg-ws-non-semantic-red-strong',
        'text-ws-non-semantic-red-on-strong',
      );
      expect(thumb.className).not.toMatch(/\[#/);
    });

    it('still renders explicit children as an escape hatch', () => {
      render(
        <Thumbnail>
          <Thumbnail.Icon icon={RiImageLine} className="custom-icon" />
        </Thumbnail>,
      );

      expect(document.querySelector('.custom-icon')).toBeInTheDocument();
    });

    it('gives a composed Thumbnail.Image the image tile, with no purple behind it', () => {
      render(
        <Thumbnail data-testid="thumb">
          <Thumbnail.Image src="https://example.com/a.jpg" alt="" loading="lazy" />
        </Thumbnail>,
      );

      expect(screen.getByTestId('thumb')).not.toHaveClass('bg-ws-non-semantic-purple-strong');
    });

    it('keeps the type you pass over the one children would imply', () => {
      render(
        <Thumbnail type="pdf" data-testid="thumb">
          <Thumbnail.Icon icon={RiImageLine} />
        </Thumbnail>,
      );

      expect(screen.getByTestId('thumb')).toHaveClass('bg-ws-non-semantic-red-strong');
    });
  });

  describe('root element', () => {
    it('forwards ref to the tile', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Thumbnail ref={ref} data-testid="thumb" />);

      expect(ref.current).toBe(screen.getByTestId('thumb'));
    });

    it('spreads rest props onto the tile', () => {
      render(<Thumbnail role="img" aria-label="Q3 board report" data-kind="report" type="pdf" />);

      expect(screen.getByRole('img', { name: 'Q3 board report' })).toHaveAttribute(
        'data-kind',
        'report',
      );
    });

    it('hides the glyph from screen readers', () => {
      const { container } = render(<Thumbnail type="video" />);

      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('size', () => {
    it('steps the text style with the size', () => {
      const { rerender } = render(<Thumbnail size="lg" text="W" />);
      expect(screen.getByText('W')).toHaveClass('typography-caption-strong-md');

      rerender(<Thumbnail size="xl" text="W" />);
      expect(screen.getByText('W')).toHaveClass('typography-label-strong-sm');
    });

    it('applies custom className', () => {
      render(<Thumbnail className="custom-class" data-testid="thumb" />);
      expect(screen.getByTestId('thumb')).toHaveClass('custom-class');
    });
  });

  describe('Thumbnail.Image', () => {
    it('applies custom className to image', () => {
      render(
        <Thumbnail>
          <Thumbnail.Image src="https://example.com/image.jpg" alt="Test" className="custom" />
        </Thumbnail>,
      );
      expect(screen.getByAltText('Test')).toHaveClass('custom');
    });

    it('forwards ref to the img element', () => {
      const ref = createRef<HTMLImageElement>();
      render(
        <Thumbnail>
          <Thumbnail.Image ref={ref} src="https://example.com/image.jpg" alt="Test" />
        </Thumbnail>,
      );
      expect(ref.current).toBe(screen.getByAltText('Test'));
    });
  });

  describe('Thumbnail.Icon', () => {
    it('forwards ref to the svg element', () => {
      const ref = createRef<SVGSVGElement>();
      const { container } = render(
        <Thumbnail>
          <Thumbnail.Icon ref={ref} icon={RiImageLine} />
        </Thumbnail>,
      );
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
      expect(ref.current).toBe(container.querySelector('[data-slot="thumbnail-icon"]'));
    });

    it('takes the size of the thumbnail it sits in', () => {
      const { container } = render(
        <Thumbnail size="xl">
          <Thumbnail.Icon icon={RiImageLine} />
        </Thumbnail>,
      );
      expect(container.querySelector('svg')).toHaveClass('size-ws-12');
    });

    it('lets its own size override the thumbnail one', () => {
      const { container } = render(
        <Thumbnail size="xl">
          <Thumbnail.Icon icon={RiImageLine} size="xs" />
        </Thumbnail>,
      );
      expect(container.querySelector('svg')).toHaveClass('size-ws-7');
    });

    it('throws outside a Thumbnail', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Thumbnail.Icon icon={RiImageLine} />)).toThrow(
        'useThumbnailContext must be used within a <Thumbnail>',
      );
      error.mockRestore();
    });
  });
});

describe('getThumbnailType', () => {
  it.each([
    ['report.pdf', 'pdf'],
    ['budget.xlsx', 'spreadsheet'],
    ['data.CSV', 'spreadsheet'],
    ['brief.docx', 'document'],
    ['notes.txt', 'document'],
    ['clip.mp4', 'video'],
    ['photo.HEIC', 'picture'],
    ['diagram.svg', 'picture'],
    ['archive.zip', 'document'],
    ['README', 'document'],
    [undefined, 'document'],
  ] as const)('%s → %s', (name, expected) => {
    expect(getThumbnailType(name)).toBe(expected);
  });

  it('prefers the MIME type over the extension', () => {
    expect(getThumbnailType('blob', 'image/png')).toBe('picture');
    expect(getThumbnailType('blob', 'video/quicktime')).toBe('video');
    expect(getThumbnailType('blob', 'application/pdf')).toBe('pdf');
    expect(getThumbnailType('blob', 'application/vnd.ms-excel')).toBe('spreadsheet');
    expect(getThumbnailType('x.pdf', 'image/jpeg')).toBe('picture');
  });

  it('falls through to the extension when the MIME type is unknown', () => {
    expect(getThumbnailType('x.pdf', 'application/octet-stream')).toBe('pdf');
  });
});

describe('Thumbnail Snapshots', () => {
  it.each(sizes)('matches snapshot for size %s', (size) => {
    const { container } = render(<Thumbnail size={size} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each(fileTypes)('matches snapshot for type %s', (type) => {
    const { container } = render(<Thumbnail size="lg" type={type} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with image', () => {
    const { container } = render(<Thumbnail src="https://example.com/image.jpg" alt="Test" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with logo', () => {
    const { container } = render(
      <Thumbnail type="logo" src="https://example.com/logo.svg" alt="Acme" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with text', () => {
    const { container } = render(<Thumbnail text="W" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('Thumbnail data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <>
        <Thumbnail icon={RiImageLine} />
        <Thumbnail src="cover.png" alt="" />
      </>,
    );
    expect(container.querySelector('[data-slot="thumbnail"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="thumbnail-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="thumbnail-image"]')).toBeInTheDocument();
  });
});
