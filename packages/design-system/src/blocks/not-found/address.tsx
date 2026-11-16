// TODO(custom): an address shown as data on a quiet fill; Wideset has no code or snippet component.

/** The address that led nowhere, as typed: on its own line, wrapping anywhere, never cut short. */
export function Address({ url }: { url: string }) {
  return (
    <p className="bg-ws-static-alpha-subtle rounded-ws-control-lg px-ws-7 py-ws-5 typography-body-md text-ws-static-base w-full break-all">
      {url}
    </p>
  );
}
