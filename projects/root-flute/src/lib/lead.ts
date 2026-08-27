// Shared Lead types — safe to import from both server and client code.
//
// A durable record of every inquiry-form submission, written before the
// notification email is attempted — so a Resend outage or misconfiguration
// never silently loses a lead. A flat, ordered-by-insertion list, same as
// testimonials — no sub-collections, no reordering.

export interface Lead {
  id: string;
  formType: string;
  product: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  message: string;
  source: string;
  extraFields: Record<string, string> | null;
  /** Whether the notification email actually sent successfully. */
  emailDelivered: boolean;
  createdAt: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt">;
