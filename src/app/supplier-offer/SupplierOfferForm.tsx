"use client";

import { useState } from "react";
import { RahmenvertragAccordion } from "@/components/RahmenvertragAccordion";

export function SupplierOfferForm() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [flavors, setFlavors] = useState([{ flavor: "", quantity: "" }]);
  const [unitPrice, setUnitPrice] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function updateFlavor(index: number, field: "flavor" | "quantity", value: string) {
    setFlavors((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  }

  function addFlavor() {
    setFlavors((prev) => [...prev, { flavor: "", quantity: "" }]);
  }

  function removeFlavor(index: number) {
    setFlavors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/supplier-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_name: companyName,
          contact_name: contactName,
          supplier_email: email,
          phone,
          product_title: productTitle,
          flavors: flavors
            .filter((f) => f.flavor && f.quantity)
            .map((f) => ({ flavor: f.flavor, quantity: Number(f.quantity) })),
          unit_price: Number(unitPrice),
          delivery_note: deliveryNote,
          message,
        }),
      });

      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte nochmal versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-lg border-2 border-black bg-green-50 p-6 text-center">
        <p className="font-bold">Danke für dein Angebot!</p>
        <p className="mt-1 text-sm text-zinc-600">
          Wir prüfen die Konditionen und melden uns per E-Mail bei dir.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <RahmenvertragAccordion supplierName={companyName} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Firma <span className="text-red-600">*</span>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Ansprechpartner <span className="text-red-600">*</span>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          E-Mail <span className="text-red-600">*</span>
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
        Produktbezeichnung <span className="text-red-600">*</span>
        <input
          value={productTitle}
          onChange={(e) => setProductTitle(e.target.value)}
          required
          placeholder="z. B. Whey Protein, 1 kg"
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <div>
        <div className="text-sm font-medium">
          Geschmacksrichtungen &amp; angebotene Menge <span className="text-red-600">*</span>
        </div>
        <div className="mt-2 space-y-2">
          {flavors.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={f.flavor}
                onChange={(e) => updateFlavor(i, "flavor", e.target.value)}
                placeholder="Flavor"
                className="flex-1 rounded border border-zinc-400 bg-white px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={1}
                value={f.quantity}
                onChange={(e) => updateFlavor(i, "quantity", e.target.value)}
                placeholder="Menge"
                className="w-28 rounded border border-zinc-400 bg-white px-3 py-2 text-sm"
              />
              {flavors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFlavor(i)}
                  className="rounded border border-zinc-400 px-3 text-sm text-zinc-600 hover:bg-zinc-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFlavor}
          className="mt-2 text-sm font-semibold text-black hover:underline"
        >
          + Flavor hinzufügen
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Euer verbindlicher niedrigster Preis pro Einheit (in €){" "}
        <span className="text-red-600">*</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Lieferzeit / Lieferbedingungen <span className="text-red-600">*</span>
        <textarea
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          required
          rows={3}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Nachricht (optional)
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
          className="mt-0.5"
        />
        <span>
          Ich habe den Rahmenvertrag gelesen und biete die oben genannte Menge zu den
          genannten Konditionen verbindlich an. <span className="text-red-600">*</span>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
      >
        {submitting ? "Wird gesendet…" : "Angebot verbindlich absenden"}
      </button>
    </form>
  );
}
