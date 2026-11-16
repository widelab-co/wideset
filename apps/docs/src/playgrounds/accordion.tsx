import {
  RiArrowGoBackLine,
  RiQuestionLine,
  RiShieldCheckLine,
  RiTruckLine,
} from '@remixicon/react';
import { Accordion } from '@wideset/react';

import { playground, type Values } from '../lib/playground-kit';

const ITEMS = [
  {
    value: 'shipping',
    title: 'Shipping',
    caption: '2–4 business days',
    icon: RiTruckLine,
    iconName: 'RiTruckLine',
    body: 'Orders leave the warehouse within two business days.',
  },
  {
    value: 'returns',
    title: 'Returns',
    caption: 'Free within 30 days',
    icon: RiArrowGoBackLine,
    iconName: 'RiArrowGoBackLine',
    body: 'Send anything back within 30 days of delivery, free of charge.',
  },
  {
    value: 'warranty',
    title: 'Warranty',
    caption: 'Two years',
    icon: RiShieldCheckLine,
    iconName: 'RiShieldCheckLine',
    body: 'Every device we sell is covered for two years.',
  },
];

const triggerCode = (v: Values, item: (typeof ITEMS)[number]) => {
  if (v.trigger === 'caption')
    return [
      '    <Accordion.Trigger>',
      '      <div className="flex flex-col">',
      `        <Accordion.Title>${item.title}</Accordion.Title>`,
      `        <Accordion.Caption>${item.caption}</Accordion.Caption>`,
      '      </div>',
      '    </Accordion.Trigger>',
    ];
  if (v.trigger === 'icon')
    return [
      '    <Accordion.Trigger>',
      `      <Accordion.Icon icon={${item.iconName}} />`,
      `      ${item.title}`,
      '    </Accordion.Trigger>',
    ];
  return [`    <Accordion.Trigger>${item.title}</Accordion.Trigger>`];
};

/**
 * `contained` comes from `AccordionProps`. How many sections open at once (`type`) and
 * `disabled` belong to the Radix root, so they are written here, with the trigger content.
 */
export default playground({
  from: 'AccordionProps',
  content: [
    {
      key: 'trigger',
      label: 'Trigger',
      type: 'select',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'With icon', value: 'icon' },
        { label: 'With caption', value: 'caption' },
      ],
      default: 'text',
    },
    {
      key: 'type',
      label: 'Open at once',
      type: 'select',
      options: [
        { label: 'One', value: 'single' },
        { label: 'Several', value: 'multiple' },
      ],
      default: 'single',
      group: 'Behavior',
    },
    { key: 'disabled', label: 'Disabled', type: 'switch', default: false, group: 'State' },
  ],
  render: (v, { props }) => {
    const items = ITEMS.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Trigger>
          {v.trigger === 'caption' ? (
            <div className="flex flex-col">
              <Accordion.Title>{item.title}</Accordion.Title>
              <Accordion.Caption>{item.caption}</Accordion.Caption>
            </div>
          ) : (
            <>
              {v.trigger === 'icon' && <Accordion.Icon icon={item.icon} />}
              {item.title}
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content>{item.body}</Accordion.Content>
      </Accordion.Item>
    ));
    const common = { ...props(), disabled: Boolean(v.disabled) };
    return (
      <div className="w-[22rem] max-w-full">
        {v.type === 'multiple' ? (
          <Accordion key="multiple" type="multiple" defaultValue={['shipping']} {...common}>
            {items}
          </Accordion>
        ) : (
          <Accordion key="single" type="single" collapsible defaultValue="shipping" {...common}>
            {items}
          </Accordion>
        )}
      </div>
    );
  },
  code: (v, { attrs }) => {
    const type =
      v.type === 'multiple'
        ? `type="multiple" defaultValue={['shipping']}`
        : 'type="single" collapsible defaultValue="shipping"';
    return [
      `<Accordion ${type}${attrs()}${v.disabled ? ' disabled' : ''}>`,
      ...ITEMS.flatMap((item) => [
        `  <Accordion.Item value="${item.value}">`,
        ...triggerCode(v, item),
        `    <Accordion.Content>${item.body}</Accordion.Content>`,
        '  </Accordion.Item>',
      ]),
      '</Accordion>',
    ].join('\n');
  },
  // One open section carries every part; the closed one below shows the divider.
  anatomy: () => (
    <div className="w-[20rem] max-w-full">
      <Accordion type="single" defaultValue="help">
        <Accordion.Item value="help">
          <Accordion.Trigger>
            <Accordion.Icon icon={RiQuestionLine} />
            <div className="flex flex-col">
              <Accordion.Title>Help centre</Accordion.Title>
              <Accordion.Caption>Answers in minutes</Accordion.Caption>
            </div>
          </Accordion.Trigger>
          <Accordion.Content>
            Search the guides or write to us; we reply within a day.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="billing">
          <Accordion.Trigger>Billing</Accordion.Trigger>
          <Accordion.Content>Invoices are sent on the first of every month.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
});
