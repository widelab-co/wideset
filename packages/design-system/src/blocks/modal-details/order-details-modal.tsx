import { RiArrowLeftLine, RiArrowRightLine, RiMoreFill } from '@remixicon/react';
import { Button, IconButton, Modal, Tabs } from '@wideset/react';

import type { Order } from './data';
import { OrderFacts } from './order-facts';
import { OrderThumbnail } from './order-thumbnail';
import { OrderTimeline } from './order-timeline';
import { RecordStep } from './record-step';

type OrderDetailsModalProps = {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Steps to the order before this one; left out on the first, which disables the step. */
  onPrevious?: () => void;
  /** Steps to the order after this one; left out on the last. */
  onNext?: () => void;
};

/** The tabs whose panel is a list of facts; Order History, the first tab, is the timeline. */
const FACT_TABS = [
  { value: 'item', label: 'Item Details' },
  { value: 'courier', label: 'Courier' },
  { value: 'receiver', label: 'Receiver' },
] as const;

/**
 * Figma's Modal `Type=Details`: a record read over the page. Everything above the footer scrolls
 * as one, so the modal never outgrows a short window; the footer stays put and steps to the
 * neighbouring record, swapping the content without closing.
 */
export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
  onPrevious,
  onNext,
}: OrderDetailsModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* Figma's close button sits 20px from the top, over the content: it is placed below. */}
      <Modal.Content
        showCloseButton={false}
        // The dialog takes the focus, not its first button: a record is read from the top. It is
        // not a control, so it shows no ring (Popup's content does the same).
        className="outline-hidden"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus();
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="gap-ws-12 p-ws-11 relative flex flex-col items-start">
            <OrderThumbnail icon={order.icon} />
            <div className="flex w-full flex-col">
              {/* Modal.Title is 20px; Figma's title here is 24/32 in Static/Text/Base. */}
              <Modal.Title className="-mt-ws-2">
                <span className="typography-subtitle-md text-ws-static-base block">
                  Order #{order.id}
                </span>
              </Modal.Title>
              <Modal.Description className="mt-ws-7 pb-ws-0">{order.description}</Modal.Description>
              <div className="mt-ws-7 py-ws-5">
                <OrderFacts facts={order.facts} />
              </div>
            </div>
            <div className="gap-ws-5 flex">
              <Button size="sm">Print Details</Button>
              <Button size="sm" variant="secondary" preset="border">
                Confirmation
              </Button>
              <IconButton
                size="sm"
                variant="secondary"
                preset="border"
                icon={RiMoreFill}
                aria-label="More actions"
              />
            </div>
            {/* Last in its block, so the keyboard reaches the record's actions first. */}
            <Modal.Close className="top-ws-11 right-ws-11 absolute" />
          </div>

          <Tabs defaultValue="history" size="sm" divider={false}>
            {/* The line under the tabs runs edge to edge: Static/Stroke/Base, on the row. */}
            <div className="border-ws-static-base px-ws-11 pt-ws-1 border-b">
              <Tabs.List aria-label="Order sections">
                <Tabs.Item value="history">
                  <Tabs.Label>Order History</Tabs.Label>
                </Tabs.Item>
                {FACT_TABS.map((tab) => (
                  <Tabs.Item key={tab.value} value={tab.value}>
                    <Tabs.Label>{tab.label}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>
            </div>
            <div className="px-ws-11 py-ws-12">
              <Tabs.Content value="history">
                <OrderTimeline events={order.history} />
              </Tabs.Content>
              {FACT_TABS.map((tab) => (
                <Tabs.Content key={tab.value} value={tab.value}>
                  <OrderFacts facts={order[tab.value]} />
                </Tabs.Content>
              ))}
            </div>
          </Tabs>
        </div>

        <Modal.Footer variant="extension">
          <RecordStep label="Previous order" icon={RiArrowLeftLine} onClick={onPrevious} />
          <RecordStep label="Next order" icon={RiArrowRightLine} iconLast onClick={onNext} />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
