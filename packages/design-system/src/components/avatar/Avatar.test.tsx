import { RiBugLine } from '@remixicon/react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Avatar } from './Avatar';
import { avatarRoundedOrb, avatarSquareOrb } from './Avatar.assets';
import { AVATAR_COLORS, getAvatarColor } from './Avatar.colors';
import { avatarVariants, moreVariants, selectionRingVariants } from './Avatar.variants';

describe('Avatar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render single avatar', () => {
      render(<Avatar initials="WD" />);

      expect(screen.getByText('WD')).toBeInTheDocument();
    });

    it('should show one letter at xs and sm, where two crowd the circle', () => {
      const { rerender } = render(<Avatar initials="AS" size="xs" />);
      expect(screen.getByText('A')).toBeInTheDocument();
      rerender(<Avatar initials="AS" size="sm" />);
      expect(screen.getByText('A')).toBeInTheDocument();
      rerender(<Avatar initials="AS" size="md" />);
      expect(screen.getByText('AS')).toBeInTheDocument();
    });

    it('should take the one-letter size from its group and keep a letter whole', () => {
      render(
        <Avatar.Group size="sm">
          <Avatar initials="ŁK" />
        </Avatar.Group>,
      );
      expect(screen.getByText('Ł')).toBeInTheDocument();
    });

    it('should keep the first character whole when it is made of several code points', () => {
      const { rerender } = render(<Avatar initials="कि" size="xs" />);
      expect(screen.getByText('कि')).toBeInTheDocument();
      rerender(<Avatar initials="👩🏽‍💻A" size="xs" />);
      expect(screen.getByText('👩🏽‍💻')).toBeInTheDocument();
    });

    it('should show one letter in an image fallback at xs and sm', () => {
      // jsdom never loads the image, so the fallback renders.
      const { rerender } = render(<Avatar src="/photo.jpg" alt="" initials="AS" size="sm" />);
      expect(screen.getByText('A')).toBeInTheDocument();
      rerender(<Avatar src="/photo.jpg" alt="" initials="AS" size="md" />);
      expect(screen.getByText('AS')).toBeInTheDocument();
    });

    it('should render avatars in group', () => {
      render(
        <Avatar.Group data-testid="avatar-group">
          <Avatar initials="WD" />
          <Avatar initials="WD1" />
        </Avatar.Group>,
      );

      const avatarGroup = screen.getByTestId('avatar-group');

      expect(avatarGroup.children).toHaveLength(2);
      expect(avatarGroup).toHaveTextContent('WD');
      expect(avatarGroup).toHaveTextContent('WD1');
    });

    it('should render an overflow badge', () => {
      render(
        <Avatar.Group data-testid="avatar-group">
          <Avatar initials="WD" />
          <Avatar initials="WD1" />
          <Avatar.More>+1</Avatar.More>
        </Avatar.Group>,
      );

      const avatarGroup = screen.getByTestId('avatar-group');

      expect(avatarGroup.children).toHaveLength(3);
      expect(avatarGroup).toHaveTextContent('WD');
      expect(avatarGroup).toHaveTextContent('WD1');
      expect(avatarGroup).not.toHaveTextContent('WD2');
      expect(avatarGroup).toHaveTextContent('+1');
    });
  });

  describe('Interaction', () => {
    it('should call onClick when the avatar is clicked', async () => {
      const handleClick = vi.fn();
      render(<Avatar initials="WD" onClick={handleClick} />);

      await userEvent.click(screen.getByText('WD'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when the +N button is clicked', async () => {
      const handleMoreClick = vi.fn();
      render(
        <Avatar.Group>
          <Avatar initials="WD" />
          <Avatar initials="WD1" />
          <Avatar.More onClick={handleMoreClick}>+2</Avatar.More>
        </Avatar.Group>,
      );

      await userEvent.click(screen.getByRole('button', { name: '+2' }));

      expect(handleMoreClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Image fallback', () => {
    it('should render fallback when second image fails to load', async () => {
      const OriginalImage = window.Image;

      window.Image = class MockImage extends EventTarget {
        complete = false;
        naturalWidth = 0;
        crossOrigin: string | null = null;
        referrerPolicy = '';
        private _src = '';

        get src() {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          setTimeout(() => {
            if (value.includes('photo-1')) {
              this.complete = true;
              this.naturalWidth = 100;
              this.dispatchEvent(new Event('load'));
            } else {
              this.complete = true;
              this.naturalWidth = 0;
              this.dispatchEvent(new Event('error'));
            }
          }, 0);
        }
      } as unknown as typeof Image;

      render(
        <Avatar.Group>
          <Avatar src="https://images.com/photo-1.jpg" alt="User 1" fallback="WD1" />
          <Avatar src="https://images.com/photo-2.jpg" alt="User 2" fallback="WD2" />
        </Avatar.Group>,
      );

      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      window.Image = OriginalImage;

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'https://images.com/photo-1.jpg');
      expect(screen.getByText('WD2')).toBeInTheDocument();
    });
  });

  describe('More button', () => {
    const more = () => screen.getByText('+1');

    const renderGroup = (onClick?: () => void) =>
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar.More onClick={onClick}>+1</Avatar.More>
        </Avatar.Group>,
      );

    it('should use its own alpha ramp rather than fading the whole button', () => {
      renderGroup(() => {});

      const cls = more().className;

      expect(cls).toContain('bg-ws-dynamic-secondary-alpha-strong-default');
      expect(cls).toContain('hover:bg-ws-dynamic-secondary-alpha-strong-hover');
      expect(cls).toContain('active:bg-ws-dynamic-secondary-alpha-strong-pressed');
      expect(cls).not.toContain('opacity-70');
    });

    it('should let the badge label exceed what the group renders', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar initials="CD" />
          <Avatar.More>+196</Avatar.More>
        </Avatar.Group>,
      );

      // The whole point of placing the badge by hand: 198 people, 2 elements.
      expect(screen.getByText('+196')).toBeInTheDocument();
    });

    it('should take an icon in the same slot as a label', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar.More aria-label="Add member">
            <svg data-testid="add-icon" />
          </Avatar.More>
        </Avatar.Group>,
      );

      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });

    it('should size an icon child to match the avatars beside it', () => {
      render(
        <Avatar.Group size="xl">
          <Avatar initials="AB" />
          <Avatar.More aria-label="Add member">
            <svg />
          </Avatar.More>
        </Avatar.Group>,
      );

      expect(screen.getByLabelText('Add member').className).toContain('[&_svg]:size-ws-12');
    });

    it('should render nothing when given no children', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar.More aria-label="Empty" />
        </Avatar.Group>,
      );

      expect(screen.getByLabelText('Empty').textContent).toBe('');
    });

    it('should inherit size from the group', () => {
      render(
        <Avatar.Group size="2xl">
          <Avatar initials="AB" />
          <Avatar.More>+3</Avatar.More>
        </Avatar.Group>,
      );

      expect(screen.getByText('+3').className).toContain('h-ws-22');
    });

    it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const)(
      'should share the avatar box at %s so it lines up in a row',
      (size) => {
        const boxOf = (classes: string) =>
          classes.match(/[hw]-ws-\d+|rounded-\S+|\[&_svg\]:size-ws-\d+/g);

        for (const shape of ['round', 'square'] as const) {
          expect(boxOf(moreVariants({ size, shape }))?.sort()).toEqual(
            boxOf(avatarVariants({ size, shape }))?.sort(),
          );
        }
      },
    );

    it('should stay inert without an onClick', () => {
      renderGroup();

      const cls = more().className;

      expect(cls).toContain('cursor-default');
      expect(cls).not.toContain('cursor-pointer');
    });

    it('should set its type so it cannot submit a surrounding form', () => {
      renderGroup(() => {});

      expect(more()).toHaveAttribute('type', 'button');
    });
  });

  describe('Cursor', () => {
    it('should not look clickable without an onClick', () => {
      const { container } = render(<Avatar initials="WD" />);

      expect((container.firstElementChild as HTMLElement).className).not.toContain(
        'cursor-pointer',
      );
    });

    it('should look clickable once an onClick is passed', () => {
      const { container } = render(<Avatar initials="WD" onClick={() => {}} />);

      expect((container.firstElementChild as HTMLElement).className).toContain('cursor-pointer');
    });

    it('should let a caller override the cursor through className', () => {
      render(<Avatar className="cursor-help" initials="WD" />);

      expect(screen.getByText('WD').className).toContain('cursor-help');
    });
  });

  describe('Focus ring', () => {
    // A bare `wds-focus-visible` draws the outline all the time; the
    // `focus-visible:` variant keeps it to keyboard focus.
    const ringClasses = (element: Element) =>
      element.className
        .split(/\s+/)
        .filter((name) => name.includes('wds-focus-visible') || name.includes('outline-ws-'));
    const keyboardOnly = [
      'focus-visible:wds-focus-visible',
      'focus-visible:outline-ws-dynamic-primary-strong-default',
    ];

    it('should draw the ring of a clickable avatar only on keyboard focus', () => {
      const { container } = render(<Avatar initials="WD" onClick={() => {}} />);

      expect(ringClasses(container.firstElementChild as HTMLElement)).toEqual(keyboardOnly);
    });

    it('should draw the ring of a clickable +N only on keyboard focus', () => {
      render(
        <Avatar.Group>
          <Avatar initials="WD" />
          <Avatar.More onClick={() => {}}>+2</Avatar.More>
        </Avatar.Group>,
      );

      expect(ringClasses(screen.getByRole('button', { name: '+2' }))).toEqual(keyboardOnly);
    });
  });

  describe('Selection', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    const radiusOf = (classes: string) => classes.match(/rounded-\S+/)?.[0] ?? null;
    const ringOf = (container: HTMLElement) =>
      container.querySelector('span[aria-hidden="true"]') as HTMLElement | null;

    it('should draw no ring by default', () => {
      const { container } = render(<Avatar initials="WD" />);

      expect(ringOf(container)).toBeNull();
    });

    it('should draw the brand ring when selected', () => {
      const { container } = render(<Avatar initials="WD" selected />);

      const cls = ringOf(container)?.className ?? '';

      expect(cls).toContain('outline-ws-dynamic-primary-strong-default');
      expect(cls).toContain('outline-2');
      expect(cls).toContain('outline-offset-2');
    });

    it('should keep the ring off the masked avatar box', () => {
      // The avatar box is masked whenever a status dot is present, and a mask
      // clips the element's outline too — the ring computed correctly there but
      // never painted.
      const { container } = render(<Avatar initials="WD" selected status="online" />);

      expect(screen.getByText('WD').className).not.toContain('outline-2');
      expect(ringOf(container)?.className).toContain('outline-2');
    });

    it('should notch the ring where the status dot sits', () => {
      const { container } = render(<Avatar initials="WD" selected status="online" />);

      const cls = ringOf(container)?.className ?? '';

      expect(cls).toContain('mask-[radial-gradient');
      // Without `no-clip` the mask clips to the border box and takes the
      // outline — which sits outside it — away entirely.
      expect(cls).toContain('[mask-clip:no-clip]');
    });

    it('should not mask the ring when there is no status dot', () => {
      const { container } = render(<Avatar initials="WD" selected />);

      expect(ringOf(container)?.className).not.toContain('mask-[radial-gradient');
    });

    it('should leave the status dot outside the ring mask', () => {
      const { container } = render(<Avatar initials="WD" selected status="online" />);

      // The dot is a sibling of the ring, not a descendant, so the notch cannot
      // erase it.
      const ring = ringOf(container) as HTMLElement;

      expect(ring.contains(screen.getByText('online'))).toBe(false);
      expect(screen.getByText('online')).toBeInTheDocument();
    });

    it.each(sizes)(
      'should mirror the avatar radius at %s so the ring follows the shape',
      (size) => {
        for (const shape of ['round', 'square'] as const) {
          expect(radiusOf(selectionRingVariants({ size, shape }))).toBe(
            radiusOf(avatarVariants({ size, shape })),
          );
        }
      },
    );

    it('should ring every content mode', () => {
      const { container, rerender } = render(<Avatar agent selected />);
      expect(ringOf(container)).not.toBeNull();

      rerender(<Avatar selected />);
      expect(ringOf(container)).not.toBeNull();
    });
  });

  describe('Review regressions', () => {
    const hueOf = (el: HTMLElement | null) =>
      el?.className.match(/bg-ws-non-semantic-([a-z]+)-subtle/)?.[1] ?? null;
    const ringOf = (c: HTMLElement) => c.querySelector('span[aria-hidden="true"]') as HTMLElement;

    it('should take the ring geometry from the group, not the cva defaults', () => {
      const { container } = render(
        <Avatar.Group shape="square" size="2xl">
          <Avatar initials="AB" selected />
        </Avatar.Group>,
      );

      const cls = ringOf(container).className;

      expect(cls).toContain('rounded-ws-container-lg');
      expect(cls).toContain('[--mask-radius:11px]');
    });

    it('should honour a group-level color instead of hashing over it', () => {
      render(
        <Avatar.Group color="teal">
          <Avatar initials="AB" />
          <Avatar initials="CD" />
        </Avatar.Group>,
      );

      expect(hueOf(screen.getByText('AB'))).toBe('teal');
      expect(hueOf(screen.getByText('CD'))).toBe('teal');
    });

    it('should not reserve a hue for an avatar that renders an image', () => {
      // An image avatar paints no hue, so reserving one for its `initials`
      // fallback pushes a real sibling off the colour it hashed to.
      render(
        <Avatar.Group>
          <Avatar alt="" initials="AB" src="https://example.com/a.png" />
          <Avatar initials="AB" />
        </Avatar.Group>,
      );

      const [imageFallback, initialsAvatar] = screen.getAllByText('AB');

      expect(hueOf(imageFallback)).toBeNull();
      expect(hueOf(initialsAvatar)).toBe(getAvatarColor('AB'));
    });
  });

  describe('Agent', () => {
    it('should render the orb when agent is set', () => {
      render(<Avatar agent />);

      const orb = screen.getByRole('img', { name: 'Agent' });

      expect(orb).toBeInTheDocument();
      expect(orb.getAttribute('src')).toBe(avatarRoundedOrb);
    });

    it('should swap the asset for the square shape', () => {
      render(<Avatar agent shape="square" />);

      expect(screen.getByRole('img', { name: 'Agent' }).getAttribute('src')).toBe(avatarSquareOrb);
    });

    it('should take its shape from the group when unset', () => {
      render(
        <Avatar.Group shape="square">
          <Avatar agent />
        </Avatar.Group>,
      );

      expect(screen.getByRole('img', { name: 'Agent' }).getAttribute('src')).toBe(avatarSquareOrb);
    });

    it('should size like every other content mode', () => {
      render(<Avatar agent size="2xl" />);

      expect(screen.getByRole('img', { name: 'Agent' }).className).toContain('h-ws-22');
    });

    it('should still render a status dot', () => {
      render(<Avatar agent status="online" />);

      expect(screen.getByText('online')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should expose a clickable avatar as a keyboard-operable button', () => {
      render(<Avatar initials="WD" onClick={() => {}} />);

      const avatar = screen.getByRole('button');

      expect(avatar).toHaveAttribute('tabindex', '0');
    });

    it.each(['Enter', ' '])('should fire onClick on %s', async (key) => {
      const onClick = vi.fn();
      render(<Avatar initials="WD" onClick={onClick} />);

      screen.getByRole('button').focus();
      await userEvent.keyboard(key === ' ' ? '{ }' : '{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not be a button without an onClick', () => {
      render(<Avatar initials="WD" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not make an inert overflow badge focusable', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar.More>+1</Avatar.More>
        </Avatar.Group>,
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText('+1').tagName).toBe('SPAN');
    });

    it('should keep an interactive overflow badge a button', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar.More onClick={() => {}}>+1</Avatar.More>
        </Avatar.Group>,
      );

      expect(screen.getByRole('button', { name: '+1' })).toBeInTheDocument();
    });

    it('should let the agent orb take a custom alt', () => {
      render(<Avatar agent alt="Research assistant" />);

      expect(screen.getByAltText('Research assistant')).toBeInTheDocument();
    });

    it.each([
      ['the default icon', <Avatar key="default" />],
      ['a custom icon', <Avatar key="custom" icon={<RiBugLine />} />],
    ])('should keep %s decorative', (_, avatar) => {
      render(avatar);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should take an icon avatar name from aria-label on the root', () => {
      render(<Avatar aria-label="Bug tracker" icon={<RiBugLine />} />);

      expect(screen.getByRole('img', { name: 'Bug tracker' })).toHaveAttribute(
        'data-slot',
        'avatar',
      );
    });

    it('should stay a button when a clickable avatar carries aria-label', () => {
      render(<Avatar aria-label="Open profile" onClick={() => {}} />);

      expect(screen.getByRole('button', { name: 'Open profile' })).toBeInTheDocument();
    });
  });
  describe('Colour', () => {
    const hueOf = (el: HTMLElement | null) =>
      el?.className.match(/bg-ws-non-semantic-([a-z]+)-subtle/)?.[1] ?? null;

    it('should derive a hue from the initials with no prop set', () => {
      render(<Avatar initials="WD" />);

      expect(hueOf(screen.getByText('WD'))).toBe(getAvatarColor('WD'));
    });

    it('should give the same initials the same hue when standalone', () => {
      render(
        <>
          <Avatar initials="WD" />
          <Avatar initials="WD" />
        </>,
      );

      const [first, second] = screen.getAllByText('WD');

      expect(hueOf(first)).toBe(hueOf(second));
    });

    it('should apply a pinned hue', () => {
      render(<Avatar initials="WD" color="teal" />);

      expect(hueOf(screen.getByText('WD'))).toBe('teal');
    });

    it('should not map stepped initials onto stepped hues', () => {
      // Guards the hash, not the palette. `h * 31 + c` is linear once reduced
      // mod 13, so `AA..AG` came out 0,1,2,3,4,5,6 and a row of avatars walked
      // neighbouring colours. No palette order can fix that — only avalanche can.
      const stepped = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG'];
      const indices = stepped.map((value) => AVATAR_COLORS.indexOf(getAvatarColor(value)));
      const deltas = indices.slice(1).map((value, i) => value - indices[i]);

      expect(new Set(deltas).size).toBeGreaterThan(1);
    });

    it('should spread initials across the whole palette', () => {
      const counts = new Map<string, number>();
      for (let first = 65; first < 91; first += 1) {
        for (let second = 65; second < 91; second += 1) {
          const hue = getAvatarColor(String.fromCharCode(first, second));
          counts.set(hue, (counts.get(hue) ?? 0) + 1);
        }
      }

      expect(counts.size).toBe(AVATAR_COLORS.length);
      // 676 initials over 13 hues; a linear hash lands exactly on 52 every time,
      // so the bound is deliberately loose — this asks for no starved hue.
      expect(Math.min(...counts.values())).toBeGreaterThan(20);
    });

    it('should give matching initials different hues inside a group', () => {
      render(
        <Avatar.Group>
          <Avatar initials="DS" />
          <Avatar initials="DS" />
          <Avatar initials="DS" />
          <Avatar initials="DS" />
        </Avatar.Group>,
      );

      const hues = screen.getAllByText('DS').map(hueOf);

      expect(new Set(hues).size).toBe(hues.length);
    });

    it('should not reuse a hue already visible in the group', () => {
      const initials = ['AB', 'CD', 'EF', 'GH', 'IJ'];

      render(
        <Avatar.Group>
          {initials.map((value) => (
            <Avatar key={value} initials={value} />
          ))}
        </Avatar.Group>,
      );

      const hues = initials.map((value) => hueOf(screen.getByText(value)));

      expect(new Set(hues).size).toBe(hues.length);
    });

    it('should not collide with a hue a sibling pinned explicitly', () => {
      const pinned = getAvatarColor('AB');

      render(
        <Avatar.Group>
          <Avatar initials="ZZ" color={pinned} />
          <Avatar initials="AB" />
        </Avatar.Group>,
      );

      expect(hueOf(screen.getByText('ZZ'))).toBe(pinned);
      expect(hueOf(screen.getByText('AB'))).not.toBe(pinned);
    });

    it('should keep every avatar coloured once the group outruns the palette', () => {
      const initials = Array.from({ length: AVATAR_COLORS.length + 2 }, (_, i) => `A${i}`);

      render(
        <Avatar.Group>
          {initials.map((value) => (
            <Avatar key={value} initials={value} />
          ))}
        </Avatar.Group>,
      );

      const hues = initials.map((value) => hueOf(screen.getByText(value)));

      expect(hues.every(Boolean)).toBe(true);
      expect(new Set(hues).size).toBe(AVATAR_COLORS.length);
    });

    it('should only colour avatars, never the overflow badge', () => {
      render(
        <Avatar.Group>
          <Avatar initials="AB" />
          <Avatar initials="CD" />
          <Avatar.More>+1</Avatar.More>
        </Avatar.Group>,
      );

      expect(hueOf(screen.getByText('AB'))).not.toBe(hueOf(screen.getByText('CD')));
      expect(screen.getByText('+1').className).not.toContain('bg-ws-non-semantic');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for default avatar', () => {
      const { container } = render(<Avatar initials="WD" />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for square avatar', () => {
      const { container } = render(<Avatar initials="WD" shape="square" />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for avatar with Icon', () => {
      const { container } = render(<Avatar icon={<RiBugLine />} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for avatar in group', () => {
      const { container } = render(
        <Avatar.Group>
          <Avatar initials="WD" />
          <Avatar initials="WD1" />
          <Avatar initials="WD2" />
        </Avatar.Group>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for avatar with status', () => {
      const { container } = render(
        <Avatar.Group size="xs">
          <Avatar status="online" />
          <Avatar status="offline" />
          <Avatar status="unavailable" />
        </Avatar.Group>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for a group with an overflow badge', () => {
      const { container } = render(
        <Avatar.Group>
          <Avatar initials="WD" />
          <Avatar initials="WD1" />
          <Avatar.More>+1</Avatar.More>
        </Avatar.Group>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for avatar in grid layout', () => {
      const { container } = render(
        <div className="max-w-ws-24">
          <Avatar.Group size="md" layout="grid">
            <Avatar initials="DS" />
            <Avatar initials="DS" />
            <Avatar initials="DS" />
            <Avatar initials="DS" />
            <Avatar initials="DS" />
          </Avatar.Group>
        </div>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

describe('Avatar data-slot', () => {
  it('marks each part with data-slot', () => {
    const { container } = render(
      <Avatar.Group>
        <Avatar initials="AK" status="online" />
        <Avatar icon={<RiBugLine />} />
        <Avatar agent />
        <Avatar.More>+3</Avatar.More>
      </Avatar.Group>,
    );
    expect(container.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-initials"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-status"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-agent"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar-more"]')).toBeInTheDocument();
  });
});
