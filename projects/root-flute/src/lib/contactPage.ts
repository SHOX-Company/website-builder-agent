// Shared Contact-page types — safe to import from both server and client
// code.
//
// A single curated document, not a collection — three contact fields,
// mirroring the Materials Statement / About Page singleton pattern.

export interface ContactPageContent {
  email: string;
  phone: string;
  whatsapp: string;
  updatedAt: string;
}

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
  email: "RootFlute@gmail.com",
  phone: "715-584-6235",
  whatsapp: "1-970-333-0249",
  updatedAt: new Date(0).toISOString(),
};
