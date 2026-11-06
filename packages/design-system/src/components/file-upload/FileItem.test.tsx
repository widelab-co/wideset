import { RiMusic2Fill } from '@remixicon/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FileItem } from './FileItem';

const Basic = (props: React.ComponentProps<typeof FileItem>) => (
  <FileItem {...props}>
    <FileItem.Thumbnail name="document.pdf" />
    <FileItem.Title>document.pdf</FileItem.Title>
    <FileItem.Description>1.2MB</FileItem.Description>
  </FileItem>
);

describe('FileItem', () => {
  it('renders the title and the description', () => {
    render(<Basic />);

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.2MB')).toBeInTheDocument();
  });

  describe('FileItem.Description', () => {
    it('separates several children with a rule', () => {
      const { container } = render(
        <FileItem>
          <FileItem.Description>1.2MB{'2 seconds left'}</FileItem.Description>
        </FileItem>,
      );

      expect(screen.getByText('1.2MB')).toBeInTheDocument();
      expect(screen.getByText('2 seconds left')).toBeInTheDocument();
      expect(container.querySelectorAll('.border-l')).toHaveLength(1);
    });

    it('draws no rule for a single child, and skips falsy ones', () => {
      const { container } = render(
        <FileItem>
          <FileItem.Description>
            1.2MB{false}
            {null}
          </FileItem.Description>
        </FileItem>,
      );

      expect(container.querySelector('.border-l')).not.toBeInTheDocument();
    });
  });

  describe('loading', () => {
    it('shows the spinner and hides the remove button with isLoading', () => {
      const { container } = render(<Basic isLoading onRemove={() => {}} />);

      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('treats a placed FileItem.Loading the same way', () => {
      const { container } = render(
        <FileItem onRemove={() => {}} data-testid="row">
          <FileItem.Title>a.pdf</FileItem.Title>
          <FileItem.Loading />
        </FileItem>,
      );

      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
      expect(screen.getByTestId('row').firstChild).toHaveClass('gap-ws-9');
    });

    it('drops a placed FileItem.Loading in the error state', () => {
      const { container } = render(
        <FileItem error="Upload failed" onRemove={() => {}} data-testid="row">
          <FileItem.Title>a.pdf</FileItem.Title>
          <FileItem.Loading />
        </FileItem>,
      );

      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(container.querySelector('.text-ws-semantic-negative')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('tints the row and shows the icon with hasError', () => {
      const { container } = render(<Basic hasError data-testid="row" />);

      expect(screen.getByTestId('row')).toHaveClass('bg-ws-dynamic-danger-alpha-strong-default');
      expect(container.querySelector('.text-ws-semantic-negative')).toBeInTheDocument();
    });

    it('renders the error headline and implies hasError', () => {
      render(<Basic error="File exceeds size limit" data-testid="row" />);

      expect(screen.getByText('File exceeds size limit')).toHaveClass('text-ws-semantic-negative');
      expect(screen.getByTestId('row')).toHaveClass('bg-ws-dynamic-danger-alpha-strong-default');
    });

    it('renders anything that is not a part under the row', () => {
      render(
        <FileItem error="File too large" data-testid="row">
          <FileItem.Title>a.zip</FileItem.Title>
          <span data-testid="extra">Maximum file size is 10 MB.</span>
        </FileItem>,
      );

      const message = screen.getByText('File too large').parentElement;
      expect(message).toContainElement(screen.getByTestId('extra'));
      expect(message).toHaveClass('gap-ws-3');
    });

    it('wins over isLoading — the remove button stays', () => {
      const { container } = render(<Basic isLoading error="Failed" onRemove={() => {}} />);

      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });
  });

  describe('remove', () => {
    it('calls onRemove and labels the button from the title', () => {
      const onRemove = vi.fn();
      render(<Basic onRemove={onRemove} />);

      fireEvent.click(screen.getByRole('button', { name: 'Remove document.pdf' }));
      expect(onRemove).toHaveBeenCalledOnce();
    });

    it('takes a custom removeLabel', () => {
      render(<Basic onRemove={() => {}} removeLabel="Delete file" />);

      expect(screen.getByRole('button', { name: 'Delete file' })).toBeInTheDocument();
    });

    it('falls back to a generic label without a plain-text title', () => {
      render(
        <FileItem onRemove={() => {}}>
          <FileItem.Title>
            <em>styled.pdf</em>
          </FileItem.Title>
        </FileItem>,
      );

      expect(screen.getByRole('button', { name: 'Remove file' })).toBeInTheDocument();
    });
  });

  describe('FileItem.Thumbnail', () => {
    it('infers the kind from the file name', () => {
      const { container } = render(
        <FileItem>
          <FileItem.Thumbnail name="budget.xlsx" />
        </FileItem>,
      );

      expect(container.querySelector('.bg-ws-non-semantic-green-strong')).toBeInTheDocument();
    });

    it('prefers mimeType over the name', () => {
      const { container } = render(
        <FileItem>
          <FileItem.Thumbnail name="blob" mimeType="video/mp4" />
        </FileItem>,
      );

      expect(container.querySelector('.bg-ws-non-semantic-indigo-strong')).toBeInTheDocument();
    });

    it('lets an explicit type, src or Icon win over the name', () => {
      const { container, rerender } = render(
        <FileItem>
          <FileItem.Thumbnail name="budget.xlsx" type="pdf" />
        </FileItem>,
      );
      expect(container.querySelector('.bg-ws-non-semantic-red-strong')).toBeInTheDocument();

      rerender(
        <FileItem>
          <FileItem.Thumbnail name="budget.xlsx" src="https://example.com/p.jpg" alt="" />
        </FileItem>,
      );
      expect(screen.getByRole('presentation')).toHaveAttribute('src', 'https://example.com/p.jpg');

      rerender(
        <FileItem>
          <FileItem.Thumbnail name="budget.xlsx" icon={RiMusic2Fill} />
        </FileItem>,
      );
      expect(container.querySelector('.bg-ws-non-semantic-purple-strong')).toBeInTheDocument();
    });

    it('is 32px by default and accepts another size', () => {
      const { container, rerender } = render(
        <FileItem>
          <FileItem.Thumbnail name="a.pdf" />
        </FileItem>,
      );
      expect(container.querySelector('.size-ws-14')).toBeInTheDocument();

      rerender(
        <FileItem>
          <FileItem.Thumbnail name="a.pdf" size="md" />
        </FileItem>,
      );
      expect(container.querySelector('.size-ws-12')).toBeInTheDocument();
    });
  });

  it.each(['contained', 'uncontained'] as const)('applies the %s variant', (variant) => {
    render(<Basic variant={variant} data-testid="row" />);

    const row = screen.getByTestId('row');
    if (variant === 'contained') expect(row).toHaveClass('rounded-ws-container-md', 'pl-ws-9');
    else expect(row).not.toHaveClass('pl-ws-9');
  });

  it('passes additional props', () => {
    render(<Basic className="custom" data-testid="row" />);

    expect(screen.getByTestId('row')).toHaveClass('custom');
  });

  describe('data-slot', () => {
    it('marks each part with data-slot', () => {
      const { container } = render(
        <FileItem isLoading>
          <FileItem.Thumbnail name="q3-report.pdf" />
          <FileItem.Title>q3-report.pdf</FileItem.Title>
          <FileItem.Description>1.2 MB</FileItem.Description>
          <FileItem.Loading />
        </FileItem>,
      );
      const slot = (name: string) => container.querySelectorAll(`[data-slot="${name}"]`);
      expect(container.firstChild).toHaveAttribute('data-slot', 'file-item');
      expect(slot('file-item-thumbnail')).toHaveLength(1);
      expect(screen.getByText('q3-report.pdf')).toHaveAttribute('data-slot', 'file-item-title');
      expect(slot('file-item-description')).toHaveLength(1);
      expect(slot('file-item-loading')).toHaveLength(1);
    });
  });

  describe('snapshots', () => {
    it('matches snapshot for default', () => {
      const { container } = render(<Basic onRemove={() => {}} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot while loading', () => {
      const { container } = render(
        <FileItem isLoading>
          <FileItem.Thumbnail name="document.pdf" />
          <FileItem.Title>document.pdf</FileItem.Title>
          <FileItem.Description>1.2MB{'2 seconds left'}</FileItem.Description>
        </FileItem>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with an error', () => {
      const { container } = render(
        <FileItem error="Error" onRemove={() => {}}>
          <FileItem.Thumbnail name="document.pdf" />
          <FileItem.Title>document.pdf</FileItem.Title>
          <FileItem.Description>1.2MB</FileItem.Description>
          <span>Description</span>
        </FileItem>,
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for uncontained', () => {
      const { container } = render(<Basic variant="uncontained" />);
      expect(container).toMatchSnapshot();
    });
  });
});
