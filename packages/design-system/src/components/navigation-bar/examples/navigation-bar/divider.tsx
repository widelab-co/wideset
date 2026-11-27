/**
 * The line under the bar is on by default. Keep it when the page starts right below with a compact
 * header, a toolbar or a table. Turn it off with `divider={false}` when the page opens with a
 * large title, which sets the bar apart on its own, or when the bar sits on a grey page above
 * white cards.
 */
import { RiBarChartLine, RiBox3Line, RiHome5Line } from '@remixicon/react';
import { Button, NavigationBar } from '@wideset/react';

export default function NavigationBarDivider() {
  return (
    <div className="gap-ws-12 flex w-[40rem] flex-col">
      <div className="rounded-ws-container-md border-ws-static-base bg-ws-static-foreground overflow-hidden border">
        <NavigationBar>
          <Pages current="Products" />
        </NavigationBar>
        <div className="px-ws-12 py-ws-9 flex items-center justify-between">
          <p className="typography-subtitle-sm text-ws-static-strong">Products</p>
          <Button size="sm">New product</Button>
        </div>
      </div>
      <div className="rounded-ws-container-md border-ws-static-base bg-ws-static-foreground overflow-hidden border">
        <NavigationBar divider={false}>
          <Pages current="Dashboard" />
        </NavigationBar>
        <div className="gap-ws-3 px-ws-12 pb-ws-12 pt-ws-9 flex flex-col">
          <p className="typography-title-sm text-ws-static-strong">Good morning, Adam</p>
          <p className="typography-body-md text-ws-static-subtle">
            Revenue is up 12% on last week.
          </p>
        </div>
      </div>
    </div>
  );
}

function Pages({ current }: { current: string }) {
  return (
    <NavigationBar.Nav>
      <NavigationBar.Item href="#" active={current === 'Dashboard'}>
        <NavigationBar.Icon icon={RiHome5Line} />
        <NavigationBar.Label>Dashboard</NavigationBar.Label>
      </NavigationBar.Item>
      <NavigationBar.Item href="#" active={current === 'Analytics'}>
        <NavigationBar.Icon icon={RiBarChartLine} />
        <NavigationBar.Label>Analytics</NavigationBar.Label>
      </NavigationBar.Item>
      <NavigationBar.Item href="#" active={current === 'Products'}>
        <NavigationBar.Icon icon={RiBox3Line} />
        <NavigationBar.Label>Products</NavigationBar.Label>
      </NavigationBar.Item>
    </NavigationBar.Nav>
  );
}
