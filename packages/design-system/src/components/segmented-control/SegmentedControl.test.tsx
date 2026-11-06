import { RiCheckboxCircleFill, RiCloseLine } from '@remixicon/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  describe('Basic rendering', () => {
    it('should render segmented control with items', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render with default value selected', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
        </SegmentedControl>,
      );

      const item1 = screen.getByRole('radio', { name: 'Item 1' });
      const item2 = screen.getByRole('radio', { name: 'Item 2' });

      expect(item1).toHaveAttribute('data-state', 'on');
      expect(item2).toHaveAttribute('data-state', 'off');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <SegmentedControl className="custom-class" defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Disabled state', () => {
    it('should disable all items when disabled prop is true', () => {
      render(
        <SegmentedControl defaultValue="item-1" disabled>
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
        </SegmentedControl>,
      );

      const item1 = screen.getByRole('radio', { name: 'Item 1' });
      const item2 = screen.getByRole('radio', { name: 'Item 2' });

      expect(item1).toBeDisabled();
      expect(item2).toBeDisabled();
    });

    it('should disable individual item when disabled prop is on item', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2" disabled>
            Item 2
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      const item1 = screen.getByRole('radio', { name: 'Item 1' });
      const item2 = screen.getByRole('radio', { name: 'Item 2' });

      expect(item1).not.toBeDisabled();
      expect(item2).toBeDisabled();
    });
  });

  describe('Icon support', () => {
    it('should render item with icon prop', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
          <SegmentedControl.Item value="item-2" icon={RiCloseLine} aria-label="Close" />
        </SegmentedControl>,
      );

      const items = screen.getAllByRole('radio');
      expect(items).toHaveLength(2);
      expect(items[0].querySelector('svg')).toBeInTheDocument();
      expect(items[1].querySelector('svg')).toBeInTheDocument();
    });

    it('should expose the aria-label as the accessible name of an icon-only item and hide the icon from assistive technology', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
          <SegmentedControl.Item value="item-2" icon={RiCloseLine} aria-label="Close" />
        </SegmentedControl>,
      );

      const doneItem = screen.getByRole('radio', { name: 'Done' });
      const closeItem = screen.getByRole('radio', { name: 'Close' });

      expect(doneItem).toBeInTheDocument();
      expect(closeItem).toBeInTheDocument();
      expect(doneItem.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(closeItem.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should style item as icon-only when conditional children resolve to a falsy value', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
          <SegmentedControl.Item value="item-2" icon={RiCloseLine} aria-label="Close">
            {false}
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      const [iconOnlyItem, conditionalItem] = screen.getAllByRole('radio');
      expect(conditionalItem.className).toBe(iconOnlyItem.className);
    });

    describe('accessible name validation', () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should warn when conditional children resolve to false and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill}>
              {false && 'Map'}
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when children are an empty string and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill}>
              {''}
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when children are whitespace-only and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill}>
              {'   '}
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when an icon-only item has an empty aria-label', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label=" " />
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should not warn when an icon-only item has a non-empty aria-label or visible children', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
            <SegmentedControl.Item value="item-2" icon={RiCloseLine}>
              Close
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should warn when the only child is SegmentedControl.Icon and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should not warn when the only child is SegmentedControl.Icon and aria-label is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" aria-label="Done">
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should warn once across re-renders of an unnamed icon-only item', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const ui = (value: string) => (
          <SegmentedControl value={value}>
            <SegmentedControl.Item value="item-1">
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>
        );

        const { rerender } = render(ui('item-1'));
        rerender(ui('item-2'));
        rerender(ui('item-1'));

        expect(warnSpy).toHaveBeenCalledTimes(1);
      });

      it('should warn once under StrictMode', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <StrictMode>
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item value="item-1">
                <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
              </SegmentedControl.Item>
            </SegmentedControl>
          </StrictMode>,
        );

        expect(warnSpy).toHaveBeenCalledTimes(1);
      });

      it('should warn when SegmentedControl.Icon is inside a Fragment and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <>
                <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
              </>
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when a wrapper component renders only an icon and no accessible name is provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const DoneIcon = () => <SegmentedControl.Icon icon={RiCheckboxCircleFill} />;

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <DoneIcon />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should not warn when a wrapper component renders text or a named image', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const MapLabel = () => <span>Map</span>;

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <MapLabel />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">
              <img src="data:," alt="Satellite" />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should warn when aria-labelledby references no existing element', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item
              value="item-1"
              icon={RiCheckboxCircleFill}
              aria-labelledby="missing-id"
            />
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should not warn when at least one aria-labelledby reference resolves', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <>
            <span id="map-label">Map</span>
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item
                value="item-1"
                icon={RiCheckboxCircleFill}
                aria-labelledby="missing-id map-label"
              />
            </SegmentedControl>
          </>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should warn when aria-labelledby references an empty element', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <>
            <span id="map-label" />
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item
                value="item-1"
                icon={RiCheckboxCircleFill}
                aria-labelledby="map-label"
              />
            </SegmentedControl>
          </>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when aria-labelledby references an element whose text is hidden inside it', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <>
            <span id="map-label">
              <span aria-hidden="true">Map</span>
            </span>
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item
                value="item-1"
                icon={RiCheckboxCircleFill}
                aria-labelledby="map-label"
              />
            </SegmentedControl>
          </>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it.each([
        ['an aria-label', <span key="label" id="map-label" aria-label="Map" />],
        ['image alt text', <img key="label" id="map-label" alt="Map" />],
        [
          'aria-hidden text',
          <span key="label" id="map-label" aria-hidden="true">
            Map
          </span>,
        ],
      ])('should not warn when aria-labelledby references an element with %s', (_, label) => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <>
            {label}
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item
                value="item-1"
                icon={RiCheckboxCircleFill}
                aria-labelledby="map-label"
              />
            </SegmentedControl>
          </>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should warn when the only descendant aria-label is empty', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <span aria-label=" " />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when the only aria-label is on the hidden SegmentedControl.Icon', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} aria-label="Done" />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when the only text is inside an aria-hidden element', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <span aria-hidden="true">Map</span>
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should warn when the only text is inside an element with the hidden attribute', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill}>
              <span hidden>Map</span>
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
          expect.stringContaining('icon-only items require a non-empty `aria-label`'),
        );
      });

      it('should not warn when aria-labelledby references an element with the hidden attribute', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <>
            <span id="map-label" hidden>
              Map
            </span>
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item
                value="item-1"
                icon={RiCheckboxCircleFill}
                aria-labelledby="map-label"
              />
            </SegmentedControl>
          </>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should not warn when a visible descendant has an aria-label', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item value="item-1">
              <span aria-label="Map" />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });

      it('should not treat an aria-hidden ancestor outside the item as hiding its name', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(
          <div aria-hidden="true">
            <SegmentedControl defaultValue="item-1">
              <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            </SegmentedControl>
          </div>,
        );

        expect(warnSpy).not.toHaveBeenCalled();
      });
    });

    it('should expose the referenced element as the accessible name via aria-labelledby', () => {
      render(
        <>
          <span id="map-label">Map</span>
          <SegmentedControl defaultValue="item-1">
            <SegmentedControl.Item
              value="item-1"
              icon={RiCheckboxCircleFill}
              aria-labelledby="map-label"
            />
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>
        </>,
      );

      expect(screen.getByRole('radio', { name: 'Map' })).toBeInTheDocument();
    });

    it('should render item with Icon subcomponent', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" aria-label="Done">
            <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
          </SegmentedControl.Item>
          <SegmentedControl.Item value="item-2" aria-label="Close">
            <SegmentedControl.Icon icon={RiCloseLine} />
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      const items = screen.getAllByRole('radio');
      expect(items).toHaveLength(2);
      expect(items[0].querySelector('svg')).toBeInTheDocument();
      expect(items[1].querySelector('svg')).toBeInTheDocument();
    });

    it('should style an item whose only child is SegmentedControl.Icon as icon-only', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
          <SegmentedControl.Item value="item-2" aria-label="Close">
            <SegmentedControl.Icon icon={RiCloseLine} />
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      const [iconProp, iconChild] = screen.getAllByRole('radio');
      expect(iconChild).toHaveClass('p-ws-6');
      expect(iconChild.className).toBe(iconProp.className);
    });

    it('should style an item whose only child is SegmentedControl.Icon inside a Fragment as icon-only', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" aria-label="Done">
            <>
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            </>
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByRole('radio', { name: 'Done' })).toHaveClass('p-ws-6');
    });

    it('should keep an item with SegmentedControl.Icon and a label in a Fragment as a labelled item', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">
            <>
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
              Map
            </>
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByRole('radio', { name: 'Map' })).not.toHaveClass('p-ws-6');
    });

    it('should keep the label padding when a wrapper component renders the icon', () => {
      const DoneIcon = () => <SegmentedControl.Icon icon={RiCheckboxCircleFill} />;

      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1" aria-label="Done">
            <DoneIcon />
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByRole('radio', { name: 'Done' })).not.toHaveClass('p-ws-6');
    });

    it('should keep an item with SegmentedControl.Icon and a label as a labelled item', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">
            <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            Map
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByRole('radio', { name: 'Map' })).not.toHaveClass('p-ws-6');
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('Ref forwarding', () => {
    it('should be forwardRef components so ref works in React 18', () => {
      const forwardRef = Symbol.for('react.forward_ref');
      expect((SegmentedControl as unknown as { $$typeof: symbol }).$$typeof).toBe(forwardRef);
      expect((SegmentedControl.Item as unknown as { $$typeof: symbol }).$$typeof).toBe(forwardRef);
    });

    it('should forward ref on the root to the group element', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <SegmentedControl ref={ref} defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(ref.current).toBe(screen.getByRole('radiogroup'));
    });

    it('should forward ref on an item to its radio button', () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item ref={ref} value="item-1">
            Item 1
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(ref.current).toBe(screen.getByRole('radio', { name: 'Item 1' }));
    });

    it('should still render the selection pill when a ref is passed', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <SegmentedControl ref={ref} defaultValue="item-1" defaultMotion>
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(ref.current).toBe(screen.getByRole('radiogroup'));
      expect(ref.current?.querySelector(':scope > span[aria-hidden]')).toBeInTheDocument();
    });
  });

  // Values read from Figma's Segmented Control component set (557:61066, items 557:61311).
  describe('Figma', () => {
    const renderControl = () =>
      render(
        <SegmentedControl aria-label="Chart" defaultValue="bar" defaultMotion>
          <SegmentedControl.Item value="bar" icon={RiCheckboxCircleFill} aria-label="Bar" />
          <SegmentedControl.Item value="line" icon={RiCloseLine} aria-label="Line" />
        </SegmentedControl>,
      );

    it('should fill the sliding selection like a selected segment, with highlight-strong', () => {
      renderControl();

      const pill = screen.getByRole('radiogroup').querySelector(':scope > span[aria-hidden]');
      expect(pill).toHaveClass('bg-ws-static-highlight-strong');
      expect(pill).not.toHaveClass('bg-ws-static-highlight-base');
    });

    it('should draw the inner shadow of the track', () => {
      renderControl();

      expect(screen.getByRole('radiogroup')).toHaveClass(
        'inset-shadow-(--ws-elevation-forms-base)',
      );
    });

    it('should colour the icon of an unselected, enabled, unfocused segment Static/Text/Base', () => {
      renderControl();

      expect(screen.getByRole('radio', { name: 'Line' })).toHaveClass(
        '[&[data-state=off]:enabled:not(:focus-visible)>[data-slot=segmented-control-icon]]:text-ws-static-base',
      );
    });
  });

  describe('Group name', () => {
    it('should expose aria-label as the accessible name of the group', () => {
      render(
        <SegmentedControl aria-label="View mode" defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
        </SegmentedControl>,
      );

      expect(screen.getByRole('radiogroup', { name: 'View mode' })).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML attributes to item and merge custom classes', () => {
      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item
            value="item-1"
            data-testid="custom-item"
            aria-label="Custom Item"
            className="custom-class"
          >
            Item 1
          </SegmentedControl.Item>
        </SegmentedControl>,
      );

      const item = screen.getByTestId('custom-item');
      expect(item).toHaveAttribute('aria-label', 'Custom Item');
      expect(item).toHaveClass('custom-class');
    });
  });

  describe('Keyboard', () => {
    it('supports Tab/Shift + Tab to change focus when no items are checked', async () => {
      const user = userEvent.setup();

      render(
        <>
          <SegmentedControl>
            <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>
          <button type="button">After segmented control</button>
        </>,
      );

      const item1 = screen.getByRole('radio', { name: 'Item 1' });
      const item2 = screen.getByRole('radio', { name: 'Item 2' });

      expect(item1).not.toBeChecked();
      expect(item2).not.toBeChecked();
      expect(item1).not.toHaveFocus();

      await user.tab();
      expect(item1).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'After segmented control' })).toHaveFocus();

      await user.tab({ shift: true });
      expect(item1).toHaveFocus();
    });

    it('supports Tab/Shift + Tab to change focus when an item is checked', async () => {
      const user = userEvent.setup();

      render(
        <>
          <SegmentedControl defaultValue="item-2">
            <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>
          <button type="button">After segmented control</button>
        </>,
      );

      const item2 = screen.getByRole('radio', { name: 'Item 2' });

      expect(item2).toBeChecked();

      await user.tab();
      expect(item2).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'After segmented control' })).toHaveFocus();

      await user.tab({ shift: true });
      expect(item2).toHaveFocus();
    });

    it.each([
      { key: 'Enter', input: '{Enter}' },
      { key: 'Space', input: ' ' },
    ])(
      'supports $key to select an item without clearing it on repeated activation',
      async ({ input }) => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();

        render(
          <SegmentedControl defaultValue="item-1" onValueChange={onValueChange}>
            <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );

        const item1 = screen.getByRole('radio', { name: 'Item 1' });
        const item2 = screen.getByRole('radio', { name: 'Item 2' });

        expect(item1).toBeChecked();
        item2.focus();

        await user.keyboard(input);
        expect(item2).toBeChecked();
        expect(item1).not.toBeChecked();
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith('item-2');

        // Stay checked
        await user.keyboard(input);
        expect(item2).toBeChecked();
        expect(onValueChange).toHaveBeenCalledTimes(1);
      },
    );

    it('supports arrow key navigation', async () => {
      const user = userEvent.setup();

      render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          <SegmentedControl.Item value="item-3">Item 3</SegmentedControl.Item>
        </SegmentedControl>,
      );

      const item1 = screen.getByRole('radio', { name: 'Item 1' });
      const item2 = screen.getByRole('radio', { name: 'Item 2' });
      const item3 = screen.getByRole('radio', { name: 'Item 3' });

      await user.tab();
      expect(item1).toHaveFocus();

      const movements = [
        { key: 'ArrowRight', next: item2 },
        { key: 'ArrowLeft', next: item1 },
        { key: 'ArrowUp', next: item3 },
        { key: 'ArrowDown', next: item1 },
      ];

      for (const { key, next } of movements) {
        await user.keyboard(`{${key}}`);
        expect(next).toHaveFocus();
      }
    });

    it.todo(
      'selects the focused item and unchecks the previous item when navigating with arrow keys',
    );
  });
});

describe('SegmentedControl Snapshots', () => {
  const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
  const variants: Array<'regular' | 'fullWidth'> = ['regular', 'fullWidth'];

  describe('Size variants', () => {
    sizes.forEach((size) => {
      it(`matches snapshot for size ${size}`, () => {
        const { container } = render(
          <SegmentedControl size={size} defaultValue="item-1">
            <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Layout variants', () => {
    variants.forEach((variant) => {
      it(`matches snapshot for variant ${variant}`, () => {
        const { container } = render(
          <SegmentedControl variant={variant} defaultValue="item-1">
            <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
            <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
          </SegmentedControl>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe('Size and variant combinations', () => {
    sizes.forEach((size) => {
      variants.forEach((variant) => {
        it(`matches snapshot for size ${size} and variant ${variant}`, () => {
          const { container } = render(
            <SegmentedControl size={size} variant={variant} defaultValue="item-1">
              <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
              <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
              <SegmentedControl.Item value="item-3">Item 3</SegmentedControl.Item>
            </SegmentedControl>,
          );
          expect(container.firstChild).toMatchSnapshot();
        });
      });
    });
  });

  describe('Disabled state', () => {
    it('matches snapshot for disabled control', () => {
      const { container } = render(
        <SegmentedControl defaultValue="item-1" disabled>
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2">Item 2</SegmentedControl.Item>
        </SegmentedControl>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for disabled item', () => {
      const { container } = render(
        <SegmentedControl defaultValue="item-1">
          <SegmentedControl.Item value="item-1">Item 1</SegmentedControl.Item>
          <SegmentedControl.Item value="item-2" disabled>
            Item 2
          </SegmentedControl.Item>
        </SegmentedControl>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('With icons', () => {
    sizes.forEach((size) => {
      it(`matches snapshot for icon items with size ${size}`, () => {
        const { container } = render(
          <SegmentedControl size={size} defaultValue="item-1">
            <SegmentedControl.Item value="item-1" icon={RiCheckboxCircleFill} aria-label="Done" />
            <SegmentedControl.Item value="item-2" icon={RiCloseLine} aria-label="Close" />
          </SegmentedControl>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    sizes.forEach((size) => {
      it(`matches snapshot for Icon subcomponent with size ${size}`, () => {
        const { container } = render(
          <SegmentedControl size={size} defaultValue="item-1">
            <SegmentedControl.Item value="item-1" aria-label="Done">
              <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="item-2" aria-label="Close">
              <SegmentedControl.Icon icon={RiCloseLine} />
            </SegmentedControl.Item>
          </SegmentedControl>,
        );
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });
});

describe('data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <SegmentedControl defaultValue="list">
        <SegmentedControl.Item value="list">
          <SegmentedControl.Icon icon={RiCheckboxCircleFill} />
          List
        </SegmentedControl.Item>
        <SegmentedControl.Item value="close" icon={RiCloseLine} aria-label="Close" />
      </SegmentedControl>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-slot', 'segmented-control');
    screen
      .getAllByRole('radio')
      .forEach((item) => expect(item).toHaveAttribute('data-slot', 'segmented-control-item'));
    expect(container.querySelectorAll('[data-slot="segmented-control-icon"]')).toHaveLength(2);
  });
});
