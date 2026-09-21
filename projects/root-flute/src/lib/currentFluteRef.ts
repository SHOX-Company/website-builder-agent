// Lets the Flutes page tell the globally-mounted StickyBar which item is the
// current checkout-eligible drop, without threading inventory data through
// layout.tsx. subscribe() always replays the latest known value immediately,
// so it works regardless of which component's effect runs first.
// `showcase` items are made-to-order examples: never checkout-eligible, and
// the sticky bar opens the flute inquiry modal (prefilled with `inquiryItem`)
// instead of starting checkout.
export type CurrentFluteRef =
  | { id: string; eligible: boolean; showcase?: boolean; inquiryItem?: string }
  | null;

let current: CurrentFluteRef = null;
const listeners = new Set<(value: CurrentFluteRef) => void>();

export function setCurrentFluteRef(value: CurrentFluteRef) {
  current = value;
  listeners.forEach((listener) => listener(value));
}

export function subscribeCurrentFluteRef(listener: (value: CurrentFluteRef) => void): () => void {
  listeners.add(listener);
  listener(current);
  return () => listeners.delete(listener);
}
