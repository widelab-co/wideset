import {
  type RemixiconComponentType,
  RiHeadphoneLine,
  RiLightbulbLine,
  RiShoppingBag3Line,
} from '@remixicon/react';

/*
  Three orders from Lumen Studio's shop, as Orbit lists them. The modal opens on the middle one,
  so there is an order to step to on both sides.
*/

/** A fact about the order: its label and its value. */
export type Fact = { label: string; value: string };

/** One step in the order's history. */
export type OrderEvent = {
  id: string;
  title: string;
  /** When it happened, as shown. */
  at: string;
  text: string;
  /** Facts that came with the step, under the text. */
  details?: Fact[];
};

export type Order = {
  /** The order number, shown as "Order #5913". */
  id: string;
  /** The line under the title. */
  description: string;
  /** Stands in for the product's photo. */
  icon: RemixiconComponentType;
  /** The key facts under the title, two to a row. */
  facts: Fact[];
  /** Newest first. */
  history: OrderEvent[];
  item: Fact[];
  courier: Fact[];
  receiver: Fact[];
};

export const orders: Order[] = [
  {
    id: '5912',
    description: '1 item, $129.00, paid by card',
    icon: RiLightbulbLine,
    facts: [
      { label: 'Item', value: 'Halo Desk Lamp, Sand' },
      { label: 'Courier', value: 'Northline, I. Sorensen' },
      { label: 'Start time', value: '11 Sep 2026, 09:12:48' },
      { label: 'Address', value: '208 Juniper Row, Alderbrook, Oregon 97035' },
    ],
    history: [
      {
        id: 'delivered',
        title: 'Order Delivered',
        at: '12/09/2026 2:41 pm',
        text: 'The parcel was handed to the receiver and signed for.',
        details: [{ label: 'Signed by', value: 'Dana Whitfield' }],
      },
      {
        id: 'shipped',
        title: 'Product Shipped',
        at: '11/09/2026 4:05 pm',
        text: 'The product was handed over to the courier for delivery.',
        details: [
          { label: 'Courier Service', value: 'Northline, I. Sorensen' },
          { label: 'Estimated Delivery Date', value: '12/09/2026' },
        ],
      },
      {
        id: 'placed',
        title: 'Order Placed',
        at: '11/09/2026 9:12 am',
        text: 'Customer placed an order for a Halo Desk Lamp.',
        details: [
          { label: 'Product', value: 'Halo Desk Lamp, Sand' },
          { label: 'Price', value: '$129' },
        ],
      },
    ],
    item: [
      { label: 'Product', value: 'Halo Desk Lamp, Sand' },
      { label: 'SKU', value: 'HL-DL-0112' },
      { label: 'Quantity', value: '1' },
      { label: 'Price', value: '$129.00' },
    ],
    courier: [
      { label: 'Service', value: 'Northline Standard' },
      { label: 'Courier', value: 'I. Sorensen' },
      { label: 'Tracking number', value: '3409-4934-4198' },
      { label: 'Delivered', value: '12/09/2026' },
    ],
    receiver: [
      { label: 'Name', value: 'Dana Whitfield' },
      { label: 'Phone', value: '(503) 555-0142' },
      { label: 'Address', value: '208 Juniper Row, Alderbrook, Oregon 97035' },
      { label: 'Delivery note', value: 'Leave with the front desk' },
    ],
  },
  {
    id: '5913',
    description: '1 item, $399.00, paid by card',
    icon: RiHeadphoneLine,
    facts: [
      { label: 'Item', value: 'Aria Wireless Headphones' },
      { label: 'Courier', value: 'Northline, R. Tanaka' },
      { label: 'Start time', value: '13 Sep 2026, 15:43:23' },
      { label: 'Address', value: '4517 Larkspur Avenue, Maplewood, Kentucky 39495' },
    ],
    history: [
      {
        id: 'shipped',
        title: 'Product Shipped',
        at: '13/09/2026 5:23 pm',
        text: 'The product was handed over to the courier for delivery.',
        details: [
          { label: 'Courier Service', value: 'Northline, R. Tanaka' },
          { label: 'Estimated Delivery Date', value: '15/09/2026' },
        ],
      },
      {
        id: 'packaging',
        title: 'Product Packaging',
        at: '13/09/2026 4:13 pm',
        text: 'The Aria headphones were carefully packaged and prepared for shipment.',
        details: [
          { label: 'Tracking number', value: '3409-4934-4253' },
          { label: 'Warehouse', value: 'Maplewood Dock 13b' },
        ],
      },
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        at: '13/09/2026 3:53 pm',
        text: 'The order was confirmed and the payment was processed at 3:51 pm.',
      },
      {
        id: 'placed',
        title: 'Order Placed',
        at: '13/09/2026 3:43 pm',
        text: 'Customer placed an order for Aria Wireless Headphones.',
        details: [
          { label: 'Product', value: 'Aria Wireless Headphones' },
          { label: 'Price', value: '$399' },
        ],
      },
    ],
    item: [
      { label: 'Product', value: 'Aria Wireless Headphones' },
      { label: 'SKU', value: 'AR-WH-0408' },
      { label: 'Quantity', value: '1' },
      { label: 'Price', value: '$399.00' },
    ],
    courier: [
      { label: 'Service', value: 'Northline Express' },
      { label: 'Courier', value: 'R. Tanaka' },
      { label: 'Tracking number', value: '3409-4934-4253' },
      { label: 'Estimated delivery', value: '15/09/2026' },
    ],
    receiver: [
      { label: 'Name', value: 'Jonah Reyes' },
      { label: 'Phone', value: '(606) 555-0187' },
      { label: 'Address', value: '4517 Larkspur Avenue, Maplewood, Kentucky 39495' },
      { label: 'Delivery note', value: 'Ring the bell twice' },
    ],
  },
  {
    id: '5914',
    description: '2 items, $58.00, paid by card',
    icon: RiShoppingBag3Line,
    facts: [
      { label: 'Item', value: 'Canvas Tote Bag, Ink' },
      { label: 'Courier', value: 'Not assigned yet' },
      { label: 'Start time', value: '13 Sep 2026, 18:02:10' },
      { label: 'Address', value: '77 Quarry Street, Fernhill, Vermont 05488' },
    ],
    history: [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        at: '13/09/2026 6:04 pm',
        text: 'The order was confirmed and the payment was processed at 6:03 pm.',
      },
      {
        id: 'placed',
        title: 'Order Placed',
        at: '13/09/2026 6:02 pm',
        text: 'Customer placed an order for two Canvas Tote Bags.',
        details: [
          { label: 'Product', value: 'Canvas Tote Bag, Ink' },
          { label: 'Price', value: '$58' },
        ],
      },
    ],
    item: [
      { label: 'Product', value: 'Canvas Tote Bag, Ink' },
      { label: 'SKU', value: 'CT-TB-0231' },
      { label: 'Quantity', value: '2' },
      { label: 'Price', value: '$58.00' },
    ],
    courier: [
      { label: 'Service', value: 'Northline Standard' },
      { label: 'Courier', value: 'Not assigned yet' },
      { label: 'Tracking number', value: 'Not issued yet' },
      { label: 'Estimated delivery', value: '16/09/2026' },
    ],
    receiver: [
      { label: 'Name', value: 'Priya Lindqvist' },
      { label: 'Phone', value: '(802) 555-0119' },
      { label: 'Address', value: '77 Quarry Street, Fernhill, Vermont 05488' },
      { label: 'Delivery note', value: 'None' },
    ],
  },
];
