// Shared URL-slug helper for routes derived from a human-readable name
// (e.g. an inventory item's name) rather than a fixed, hand-picked slug.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
