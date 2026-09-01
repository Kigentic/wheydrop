"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewSupplierConfirmationPage() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [flavors, setFlavors] = useState([{ flavor: "", quantity: "" }]);
  const [unitPrice, setUnitPrice] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch("/api/admin/supplier-confirmations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_name: supplierName,
          supplier_email: supplierEmail,
          product_title: productTitle,
          flavors: flavors
            .filter((f) => f.flavor && f.quantity)
            .map((f) => ({ flavor: f.flavor, quantity: Number(f.quantity) })),
          unit_price: Number(unitPrice),
          delivery_note: deliveryNote,
        }),
      });

      if (!res.ok) throw new Error("failed");
      router.push("/admin/supplier-confirmations");
      router.refresh();
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte nochmal versuchen.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/supplier-confirmations" className="text-sm text-zinc-500 hover:underline">
          ← Zurück
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Neue Zusage anfragen</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Für bereits telefonisch/persönlich abgestimmte Konditionen: Der Hersteller erhält
          direkt den Link zur finalen Bestätigung (Grundlage: Liefervertrag/Rahmenvertrag).
          Reicht der Hersteller sein Angebot lieber selbst ein, nutzt er stattdessen{" "}
          <a href="/supplier-offer" target="_blank" className="underline">
            /supplier-offer
          </a>
          .
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Hersteller / Firma
              <input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              E-Mail des Herstellers
              <input
                type="email"
                value={supplierEmail}
                onChange={(e) => setSupplierEmail(e.target.value)}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Produktbezeichnung
            <input
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              required
              placeholder="z. B. Brand X Whey Protein, 1 kg"
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          <div>
            <div className="text-sm font-medium">Geschmacksrichtungen &amp; Menge</div>
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
            Preis pro Einheit (netto/brutto wie vereinbart, in €)
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
            Lieferzeit / Lieferbedingungen
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              required
              placeholder="z. B. Lieferung innerhalb 5 Werktagen nach Drop-Ende an unser Lager"
              rows={3}
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
          >
            {submitting ? "Wird gesendet…" : "Anfrage an Hersteller senden"}
          </button>
        </form>
      </main>
    </div>
  );
}
