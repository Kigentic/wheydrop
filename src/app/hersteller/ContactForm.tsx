"use client";

import { useState } from "react";

export function ContactForm() {
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    "Wir wären an einem Test-Drop interessiert. Unser Produkt: "
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/hersteller-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, contactName, email, phone, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border-2 border-black bg-green-50 p-6 text-center">
        <p className="font-bold">Danke für eure Nachricht!</p>
        <p className="mt-1 text-sm text-zinc-600">
          Wir melden uns zeitnah bei euch, um die nächsten Schritte zu besprechen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border-2 border-black bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>Firma <span className="text-red-600">*</span></span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Ansprechpartner <span className="text-red-600">*</span></span>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>E-Mail <span className="text-red-600">*</span></span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Telefon
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span>Nachricht <span className="text-red-600">*</span></span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600">Etwas ist schiefgelaufen. Bitte nochmal versuchen.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
      >
        {status === "loading" ? "Wird gesendet…" : "Anfrage senden"}
      </button>
    </form>
  );
}
