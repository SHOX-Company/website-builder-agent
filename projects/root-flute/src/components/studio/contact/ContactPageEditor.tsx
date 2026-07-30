"use client";

import { useState } from "react";
import type { ContactPageContent } from "@/lib/contactPage";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import Input from "@/components/studio/ui/Input";
import EditorFooter from "@/components/studio/ui/EditorFooter";

export default function ContactPageEditor({ initialContent }: { initialContent: ContactPageContent }) {
  const [email, setEmail] = useState(initialContent.email);
  const [phone, setPhone] = useState(initialContent.phone);
  const [whatsapp, setWhatsapp] = useState(initialContent.whatsapp);
  const [saved, setSaved] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = email !== saved.email || phone !== saved.phone || whatsapp !== saved.whatsapp;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, whatsapp }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const content = data.content as ContactPageContent;
      setEmail(content.email);
      setPhone(content.phone);
      setWhatsapp(content.whatsapp);
      setSaved(content);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Contact"
        title="Contact"
        description="The contact details shown on the public Contact page. Editing here updates the live site immediately."
      />

      <Card className="flex flex-col gap-6 max-w-md">
        <Input id="contact-email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="contact-phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          id="contact-whatsapp"
          label="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </Card>

      <EditorFooter onSave={handleSave} saveLabel={saving ? "Saving…" : "Save Changes"} saveDisabled={!dirty || saving} error={error} />
    </div>
  );
}
