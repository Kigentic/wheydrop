"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Drop, Variant } from "@/lib/types";
import { Gallery } from "./Gallery";

function nextTier(drop: Drop) {
  const sorted = [...drop.price_tiers].sort((a, b) => a.min_units - b.min_units);
  return sorted.find((t) => t.min_units > drop.total_ordered) ?? null;
}

function useCountdown(endsAt: string) {
  // starts null so server and first client render match; real value fills in after mount
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(Date.parse(endsAt) - Date.now());
    const interval = setInterval(() => {
      setRemaining(Date.parse(endsAt) - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (remaining === null) {
    return { ready: false, done: false, h: 0, m: 0, s: 0 };
  }

  const done = remaining <= 0;
  const h = Math.max(0, Math.floor(remaining / 3_600_000));
  const m = Math.max(0, Math.floor((remaining % 3_600_000) / 60_000));
  const s = Math.max(0, Math.floor((remaining % 60_000) / 1000));

  return { ready: true, done, h, m, s };
}

export function DropView({
  drop: initialDrop,
  initialVariants,
}: {
  drop: Drop;
  initialVariants: Variant[];
}) {
  const [drop, setDrop] = useState(initialDrop);
  const [variants, setVariants] = useState(initialVariants);
  const [selectedVariant, setSelectedVariant] = useState(initialVariants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    street: "",
    zip: "",
    city: "",
    country: "Deutschland",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "ok" | "error">("idle");

  const countdown = useCountdown(drop.ends_at);
  const tier = nextTier(drop);
  const unitsToNextTier = tier ? tier.min_units - drop.total_ordered : 0;
  const progressPct = tier
    ? Math.min(100, (drop.total_ordered / tier.min_units) * 100)
    : 100;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setForm((prev) => ({
        ...prev,
        name: prev.name || (user.user_metadata?.name as string | undefined) || "",
        email: prev.email || user.email || "",
      }));
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`drop-${drop.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "drops", filter: `id=eq.${drop.id}` },
        (payload) => setDrop(payload.new as Drop)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "variants", filter: `drop_id=eq.${drop.id}` },
        (payload) => {
          const updated = payload.new as Variant;
          setVariants((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [drop.id]);

  const maxAmount = useMemo(
    () => (drop.price_tiers[0]?.price ?? drop.current_price) * quantity,
    [drop, quantity]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult("idle");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drop_id: drop.id,
          variant_id: selectedVariant,
          quantity,
          customer_name: form.name,
          customer_email: form.email,
          customer_address: {
            street: form.street,
            zip: form.zip,
            city: form.city,
            country: form.country,
          },
        }),
      });

      if (!res.ok) throw new Error("failed");
      setResult("ok");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (result === "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Du bist <span className="bg-yellow-400 px-2">dabei!</span>
          </h1>
          <p className="mt-4 text-zinc-600">
            Aktueller Preis: <strong>{drop.current_price.toFixed(2)} €</strong>. Möglicher
            Endpreis bei nächster Stufe: {tier ? `${tier.price.toFixed(2)} €` : "bereits erreicht"}.
            Wir schicken dir eine E-Mail sobald der Drop endet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <span className="inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
          {drop.status === "active" ? "Live" : drop.status}
        </span>
        <h1 className="mt-2 text-3xl font-bold">{drop.title}</h1>
        <p className="text-zinc-600">{drop.brand_name}</p>

        {drop.image_urls.length > 0 && (
          <div className="mt-8">
            <Gallery images={drop.image_urls} alt={drop.title} />
          </div>
        )}

        {drop.description && (
          <p className="mt-6 max-w-2xl leading-relaxed text-zinc-700">{drop.description}</p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border-2 border-black p-6">
            <div className="text-sm text-zinc-600">Bestellte Einheiten</div>
            <div className="mt-1 text-5xl font-bold tabular-nums">
              {drop.total_ordered}
            </div>
            <div className="mt-4 text-sm text-zinc-600">Aktueller Preis</div>
            <div className="text-3xl font-bold tabular-nums">
              <span className="bg-yellow-400 px-1">{drop.current_price.toFixed(2)} €</span>
            </div>
          </div>

          <div className="rounded-lg border-2 border-black p-6">
            <div className="text-sm text-zinc-600">Drop endet in</div>
            <div className="mt-1 text-4xl font-bold tabular-nums">
              {!countdown.ready
                ? "--:--:--"
                : countdown.done
                ? "Beendet"
                : `${String(countdown.h).padStart(2, "0")}:${String(countdown.m).padStart(2, "0")}:${String(countdown.s).padStart(2, "0")}`}
            </div>

            {tier && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Nächste Stufe: {tier.price.toFixed(2)} €</span>
                  <span>noch {unitsToNextTier} Einheiten</span>
                </div>
                <div className="mt-2 h-2 rounded-full border border-black bg-white">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 rounded-lg border-2 border-black p-6">
          <h2 className="text-lg font-bold">Jetzt dabei sein</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Flavor
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              >
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.flavor}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Menge
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              E-Mail
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              Straße + Hausnummer
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              PLZ
              <input
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Stadt
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="rounded border border-zinc-400 bg-white px-3 py-2"
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              Autorisiert wird der Maximalpreis: <strong>{maxAmount.toFixed(2)} €</strong>.
              Belastet wird nur der tatsächlich erreichte Endpreis.
            </div>
          </div>

          {result === "error" && (
            <p className="mt-4 text-sm text-red-600">
              Etwas ist schiefgelaufen. Bitte nochmal versuchen.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || countdown.done}
            className="mt-6 w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
          >
            {countdown.done ? "Drop beendet" : submitting ? "Wird verarbeitet…" : "Jetzt dabei sein"}
          </button>
        </form>
      </main>
    </div>
  );
}
