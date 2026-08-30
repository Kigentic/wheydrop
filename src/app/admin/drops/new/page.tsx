"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Tier {
  min_units: string;
  max_units: string;
  price: string;
}

export default function NewDrop() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxUnits, setMaxUnits] = useState("5000");
  const [flavors, setFlavors] = useState("Vanilla, Chocolate, Strawberry");
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
      flavors: flavors.split(",").map((f) => f.trim()).filter(Boolean),
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
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Neuer Drop</span>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Titel
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Brand
              <input value={brand} onChange={(e) => setBrand(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Start
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Ende
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Max. Kontingent
              <input type="number" value={maxUnits} onChange={(e) => setMaxUnits(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Flavors (Komma-getrennt)
              <input value={flavors} onChange={(e) => setFlavors(e.target.value)} required className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2" />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300">Preisstufen</h2>
              <button type="button" onClick={addTier} className="text-sm text-lime-400 hover:underline">
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
                    className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="max (leer = ∞)"
                    value={t.max_units}
                    onChange={(e) => updateTier(i, "max_units", e.target.value)}
                    className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Preis"
                    value={t.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                    required
                    className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeTier(i)} className="text-zinc-500 hover:text-red-400">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-lime-400 py-3 font-bold text-black hover:bg-lime-300 disabled:opacity-50"
          >
            {submitting ? "Wird angelegt…" : "Drop anlegen"}
          </button>
        </form>
      </main>
    </div>
  );
}
