"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewManufacturerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/manufacturers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact_name: contactName, contact_email: contactEmail }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Fehler beim Anlegen");
      setLoading(false);
      return;
    }

    setName("");
    setContactName("");
    setContactEmail("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border-2 border-black p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span>Name *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Ansprechpartner</span>
        <input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>E-Mail</span>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-black px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
      >
        {loading ? "Wird angelegt…" : "Hersteller anlegen"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
