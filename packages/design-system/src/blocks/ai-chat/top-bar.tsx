import { Button, cn, DropdownMenu, ListItem } from '@wideset/react';
import { type AnchorHTMLAttributes, useState } from 'react';

import { BrandMark } from './brand-mark';
import { MODELS, NAV } from './data';

/** Figma "Navigation" on the white page, no line: brand and model, centred navigation, invite. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);
  const [model, setModel] = useState(MODELS[0]);

  return (
    <header className="h-ws-22 px-ws-12 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center">
      <div className="gap-ws-12 flex items-center">
        <BrandMark label="Wide AI" />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" preset="border" size="sm">
              {model}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {MODELS.map((item) => (
              <DropdownMenu.Item
                key={item}
                data-state={item === model ? 'checked' : 'unchecked'}
                onSelect={() => setModel(item)}
              >
                <ListItem.Content>
                  <ListItem.Label>{item}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

      <nav aria-label="Main" className="gap-ws-3 flex items-center">
        {NAV.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            active={item.href === current}
            onClick={() => setCurrent(item.href)}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>

      <Button variant="secondary" preset="border" size="sm" className="justify-self-end">
        Invite
      </Button>
    </header>
  );
}

type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & { active: boolean };

/** Figma ".Assets/Top Navigation/Navigation Item": a top-bar link, tinted while it is the page. */
function NavItem({ active, className, children, ...props }: NavItemProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={cn(
        'typography-label-strong-sm rounded-ws-control-lg px-ws-7 py-ws-3 min-h-ws-14 flex items-center',
        'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
        active
          ? 'bg-ws-static-alpha-base text-ws-dynamic-secondary-default'
          : 'text-ws-static-base hover:bg-ws-dynamic-secondary-alpha-hover active:bg-ws-dynamic-secondary-alpha-pressed',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
