import { CUSTOMERS, ITEMS, type Order, STATUS, totalOf } from './data';

/**
 * The orders as a CSV file, the way a spreadsheet opens it: one row an order, every cell quoted
 * because item names hold commas, the total in dollars.
 */
export function exportCsv(orders: Order[]) {
  const lines = [
    ['Order', 'Customer', 'Date', 'Items', 'Status', 'Total (USD)'],
    ...orders.map((order) => [
      `#${order.id}`,
      CUSTOMERS[order.customer].name,
      order.placed,
      order.lines.map(([item, quantity]) => `${quantity} x ${ITEMS[item].name}`).join('; '),
      STATUS[order.status].label,
      (totalOf(order) / 100).toFixed(2),
    ]),
  ];
  const csv = lines.map((line) => line.map((cell) => `"${cell}"`).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'orders.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}
