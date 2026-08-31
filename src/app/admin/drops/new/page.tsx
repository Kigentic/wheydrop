"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PriceCalculator from "./PriceCalculator";
import ImageUploader from "./ImageUploader";

interface Tier {
  min_units: string;
  max_units: string;
  price: string;
}

interface FlavorRow {
  flavor: string;
  units: string;
}

const inputClass = "rounded border border-zinc-400 bg-white px-3 py-2";

export default function NewDrop() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxUnits, setMaxUnits] = useState("5000");
  const [flavorRows, setFlavorRows] = useState<FlavorRow[]>([
    { flavor: "Vanilla", units: "" },
    { flavor: "Chocolate", units: "" },
    { flavor: "Strawberry", units: "" },
  ]);
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([
    { min_units: "0", max_units: "249", price: "32.90" },
    { min_units: "250", max_units: "499", price: "30.90" },
    { min_units: "500", max_units: "999", price: "28.90" },
    { min_units: "1000", max_units: "2499", price: "26.90" },
    { min_units: "2500", max_units: "", price: "24.90" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateTier(i: number, field: keyof Tier, value: string) {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }

  function addTier() {
    setTiers((prev) => [...prev, { min_units: "", max_units: "", price: "" }]);
  }

  function removeTier(i: number) {
    setTiers((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateFlavorRow(i: number, field: keyof FlavorRow, value: string) {
    setFlavorRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  function addFlavorRow() {
    setFlavorRows((prev) => [...prev, { flavor: "", units: "" }]);
  }

  function removeFlavorRow(i: number) {
    setFlavorRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  const flavorUnitsTotal = flavorRows.reduce((sum, r) => sum + (Number(r.units) || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title,
      brand_name: brand,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      max_units: Number(maxUnits),
      flavors: flavorRows
        .filter((r) => r.flavor.trim())
        .map((r) => ({ flavor: r.flavor.trim(), available_units: Number(r.units) || 0 })),
      description,
      image_urls: imageUrls,
      price_tiers: tiers.map((t) => ({
        min_units: Number(t.min_units),
        max_units: t.max_units === "" ? null : Number(t.max_units),
        price: Number(t.price),
      })),
    };

    const res = await fetch("/api/admin/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? "Fehler beim Anlegen");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/dashboard" className="text-sm font-semibold hover:underline">
          ← Alle Drops
        </Link>
        <h1 className="mb-6 mt-3 text-2xl font-bold">Neuer Drop</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Titel
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Brand
              <input value={brand} onChange={(e) => setBrand(e.target.value)} required className={inputClass} />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Produktbeschreibung
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </label>

            <div className="sm:col-span-2">
              <ImageUploader urls={imageUrls} onChange={setImageUrls} />
            </div>

            <label className="flex flex-col gap-1 text-sm">
              Start
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required className={inputClass} />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Ende
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required className={inputClass} />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Max. Kontingent (gesamt, für Preisstufen)
              <input type="number" value={maxUnits} onChange={(e) => setMaxUnits(e.target.value)} required className={inputClass} />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700">
                Flavors &amp; Menge je Flavor
              </h2>
              <button type="button" onClick={addFlavorRow} className="text-sm font-semibold hover:underline">
                + Flavor
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {flavorRows.map((row, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2">
                  <input
                    placeholder="Flavor, z.B. Vanilla"
                    value={row.flavor}
                    onChange={(e) => updateFlavorRow(i, "flavor", e.target.value)}
                    required
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    type="number"
                    placeholder="Menge"
                    value={row.units}
                    onChange={(e) => updateFlavorRow(i, "units", e.target.value)}
                    required
                    min="0"
                    className={`${inputClass} text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFlavorRow(i)}
                    className="text-zinc-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Summe Flavors: {flavorUnitsTotal} {flavorUnitsTotal !== Number(maxUnits) && maxUnits && (
                <span className="text-amber-600">
                  (weicht vom Max. Kontingent {maxUnits} ab — das ist ok, wenn gewollt)
                </span>
              )}
            </p>
          </div>

          <PriceCalculator
            onApply={(calculatedTiers, volume) => {
              setTiers(calculatedTiers);
              setMaxUnits(String(volume));
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700">Preisstufen</h2>
              <button type="button" onClick={addTier} className="text-sm font-semibold hover:underline">
                + Stufe
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {tiers.map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input
                    placeholder="min"
                    value={t.min_units}
                    onChange={(e) => updateTier(i, "min_units", e.target.value)}
                    required
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    placeholder="max (leer = ∞)"
                    value={t.max_units}
                    onChange={(e) => updateTier(i, "max_units", e.target.value)}
                    className={`${inputClass} text-sm`}
                  />
                  <input
                    placeholder="Preis"
                    value={t.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                    required
                    className={`${inputClass} text-sm`}
                  />
                  <button type="button" onClick={() => removeTier(i)} className="text-zinc-500 hover:text-red-600">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
          >
            {submitting ? "Wird angelegt…" : "Drop anlegen"}
          </button>
        </form>
      </main>
    </div>
  );
}
