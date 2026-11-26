import { RiArrowDownSLine, RiArrowLeftLine } from '@remixicon/react';
import { AppShell, Button, cn, IconButton, ProgressTracker, Tabs } from '@wideset/react';
import { useId, useState } from 'react';

import { categories, steps } from './data';
import { ProcessSidebar } from './sidebar';
import { WorkspaceRail } from './workspace-rail';

/**
 * Process: the first step of a creation flow in the Flat direction, with a workspace rail beside
 * the sidebar. The header carries the draft's name, the progress and the publish actions.
 */
export default function Process() {
  const [type, setType] = useState<string>();
  const headingId = useId();

  return (
    <AppShell direction="flat">
      <WorkspaceRail />
      <ProcessSidebar />
      <AppShell.Main className="flex flex-col">
        <header className="border-ws-static-base h-ws-20 px-ws-14 gap-ws-14 flex shrink-0 items-center border-b">
          {/* A bar's icon buttons are sm, like the Sidebar trigger beside it; gap-ws-5 keeps the
              arrow 16px from the title, as before. */}
          <div className="gap-ws-5 flex min-w-0 flex-1 items-center">
            <IconButton
              icon={RiArrowLeftLine}
              size="sm"
              variant="secondary"
              preset="ghost"
              aria-label="Back to experiences"
            />
            <h1 className="typography-subtitle-xs text-ws-static-strong truncate">Untitled</h1>
          </div>
          <ProgressTracker
            steps={steps.map(() => ({}))}
            activeStep={0}
            aria-label={`Step 1 of ${steps.length}: ${steps[0]}`}
            className="w-[10rem] shrink-0"
          />
          <div className="gap-ws-5 flex flex-1 items-center justify-end">
            <Button variant="primary" preset="ghost" size="sm">
              Unsaved
            </Button>
            <Button variant="secondary" preset="border" size="sm">
              Preview
            </Button>
            <Button size="sm">
              Make it live
              <Button.Icon icon={RiArrowDownSLine} />
            </Button>
          </div>
        </header>

        {/* pb-ws-20 matches the header's height, so the step centres on the screen as in Figma. */}
        <div className="px-ws-14 pb-ws-20 flex flex-1 items-center justify-center">
          <section
            aria-labelledby={headingId}
            className="gap-ws-14 flex w-full max-w-[53.4375rem] flex-col"
          >
            <h2 id={headingId} className="typography-title-md text-ws-static-strong">
              Choose type of experience
            </h2>
            <Tabs type="ghost" defaultValue="training" className="gap-ws-14">
              <Tabs.List aria-label="Categories">
                {categories.map((category) => (
                  <Tabs.Item key={category.value} value={category.value}>
                    <Tabs.Icon icon={category.icon} />
                    <Tabs.Label>{category.label}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>
              {categories.map((category) => (
                <Tabs.Content
                  key={category.value}
                  value={category.value}
                  className="gap-ws-12 flex"
                >
                  {category.types.map(({ id, title, steps: count, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={type === id}
                      onClick={() => setType(id)}
                      className={cn(
                        'rounded-ws-container-md p-ws-9 focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex h-[12.5rem] min-w-0 flex-1 flex-col items-start justify-between text-left',
                        type === id
                          ? 'bg-ws-dynamic-primary-alpha-strong-default'
                          : 'bg-ws-static-alpha-subtle hover:bg-ws-static-alpha-base',
                      )}
                    >
                      <Icon aria-hidden="true" className="size-ws-12 text-ws-static-strong" />
                      <span className="gap-ws-3 flex flex-col">
                        <span className="typography-subtitle-xs text-ws-static-strong">
                          {title}
                        </span>
                        <span className="typography-caption-strong-md text-ws-static-subtle">
                          {count} {count === 1 ? 'step' : 'steps'}
                        </span>
                      </span>
                    </button>
                  ))}
                </Tabs.Content>
              ))}
            </Tabs>
          </section>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
