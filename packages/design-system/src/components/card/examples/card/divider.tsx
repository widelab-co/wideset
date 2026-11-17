/**
 * Cards separate the header from the content by space alone, so a small card reads as one piece.
 * Set `divider` when the content below the header is heavy, such as a table, a list or a form
 * with a footer of actions: a line then runs under the header and above the footer.
 */
import { Button, Card, FormField, TextInput } from '@wideset/react';

export default function CardDivider() {
  return (
    <div className="gap-ws-11 grid w-full grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] items-start">
      <Card>
        <Card.Header>
          <Card.Title>Payment method</Card.Title>
          <Card.Description>Charged on the 1st of every month.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="typography-body-md text-ws-static-strong">Visa ending in 4242</p>
          <p className="typography-body-sm text-ws-static-subtle">Expires 08/2028</p>
        </Card.Content>
      </Card>
      <Card divider>
        <Card.Header>
          <Card.Title>Billing contact</Card.Title>
          <Card.Description>Invoices and receipts go to this person.</Card.Description>
        </Card.Header>
        <Card.Content>
          <form
            id="card-billing-form"
            className="gap-ws-11 flex flex-col"
            onSubmit={(event) => event.preventDefault()}
          >
            <FormField label="Full name" htmlFor="card-billing-name">
              <TextInput
                id="card-billing-name"
                placeholder="e.g. Anna Kowalska"
                autoComplete="name"
              />
            </FormField>
            <FormField label="Email address" htmlFor="card-billing-email">
              <TextInput
                id="card-billing-email"
                type="email"
                placeholder="e.g. billing@northwind.co"
                autoComplete="email"
              />
            </FormField>
          </form>
        </Card.Content>
        <Card.Footer className="gap-ws-5 justify-end">
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
          <Button type="submit" form="card-billing-form">
            Save
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
