"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  initial,
}: {
  initial: {
    name: string;
    street: string;
    zip: string;
    city: string;
    country: string;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: form });

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4 rounded-lg border-2 border-black p-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Straße + Hausnummer
        <input
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          PLZ
          <input
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Stadt
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="rounded border border-zinc-400 bg-white px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Land
        <input
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Gespeichert.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-black px-6 py-2 text-sm font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
      >
        {saving ? "Wird gespeichert…" : "Speichern"}
      </button>
    </form>
  );
}
