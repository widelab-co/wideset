import { Button, Card, StatusBadge } from '@wideset/react';

import { playground } from '../lib/playground-kit';

const TITLE = 'Weekly report';
const DESCRIPTION = 'Sent to the team every Monday.';
const BODY = 'Covers sign-ups, churn and revenue for the last seven days.';

const PHOTO =
  'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=320&h=107&fit=crop&dpr=2&q=80';

/** The variant comes from `CardProps`; which parts are present is content. */
export default playground({
  from: 'CardProps',
  content: [
    { key: 'action', label: 'Header action', type: 'switch', default: true },
    { key: 'content', label: 'Body', type: 'switch', default: true },
    { key: 'footer', label: 'Footer', type: 'switch', default: false },
  ],
  render: (v, { props }) => {
    const heading = (
      <>
        <Card.Title>{TITLE}</Card.Title>
        <Card.Description>{DESCRIPTION}</Card.Description>
      </>
    );
    return (
      <Card {...props()} className="w-[20rem] max-w-full">
        <Card.Header>
          {v.action ? (
            <div className="flex items-start justify-between gap-ws-9">
              <div className="flex min-w-0 flex-1 flex-col">{heading}</div>
              <Card.Action>
                <StatusBadge color="positive">Active</StatusBadge>
              </Card.Action>
            </div>
          ) : (
            heading
          )}
        </Card.Header>
        {v.content && (
          <Card.Content>
            <p className="typography-body-md text-ws-static-subtle">{BODY}</p>
          </Card.Content>
        )}
        {v.footer && (
          <Card.Footer className="justify-end gap-ws-5">
            <Button variant="secondary" preset="border" size="sm">
              Pause
            </Button>
            <Button size="sm">Edit schedule</Button>
          </Card.Footer>
        )}
      </Card>
    );
  },
  code: (v, { attrs }) => {
    const heading = v.action
      ? [
          '    <div className="flex items-start justify-between gap-ws-9">',
          '      <div className="flex min-w-0 flex-1 flex-col">',
          `        <Card.Title>${TITLE}</Card.Title>`,
          `        <Card.Description>${DESCRIPTION}</Card.Description>`,
          '      </div>',
          '      <Card.Action>',
          '        <StatusBadge color="positive">Active</StatusBadge>',
          '      </Card.Action>',
          '    </div>',
        ]
      : [
          `    <Card.Title>${TITLE}</Card.Title>`,
          `    <Card.Description>${DESCRIPTION}</Card.Description>`,
        ];
    return [
      `<Card${attrs()}>`,
      '  <Card.Header>',
      ...heading,
      '  </Card.Header>',
      ...(v.content
        ? [
            '  <Card.Content>',
            `    <p className="typography-body-md text-ws-static-subtle">${BODY}</p>`,
            '  </Card.Content>',
          ]
        : []),
      ...(v.footer
        ? [
            '  <Card.Footer className="justify-end gap-ws-5">',
            '    <Button variant="secondary" preset="border" size="sm">',
            '      Pause',
            '    </Button>',
            '    <Button size="sm">Edit schedule</Button>',
            '  </Card.Footer>',
          ]
        : []),
      '</Card>',
    ].join('\n');
  },
  // Every part at once, the media included: the stage has no Card.Media. The photo is the
  // Media example's, cropped to the 3:1 frame.
  anatomy: () => (
    <Card className="w-[20rem] max-w-full">
      <Card.Media ratio="3/1">
        <img src={PHOTO} alt="" className="size-full object-cover" />
      </Card.Media>
      <Card.Header>
        <div className="flex items-start justify-between gap-ws-9">
          <div className="flex min-w-0 flex-1 flex-col">
            <Card.Title>{TITLE}</Card.Title>
            <Card.Description>{DESCRIPTION}</Card.Description>
          </div>
          <Card.Action>
            <StatusBadge color="positive">Active</StatusBadge>
          </Card.Action>
        </div>
      </Card.Header>
      <Card.Content>
        <p className="typography-body-md text-ws-static-subtle">{BODY}</p>
      </Card.Content>
      <Card.Footer className="justify-end gap-ws-5">
        <Button variant="secondary" preset="border" size="sm">
          Pause
        </Button>
        <Button size="sm">Edit schedule</Button>
      </Card.Footer>
    </Card>
  ),
});
