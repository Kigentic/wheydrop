"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Manufacturer } from "@/lib/types";

export function ManufacturerAssign({
  dropId,
  manufacturers,
  currentManufacturerId,
}: {
  dropId: string;
  manufacturers: Manufacturer[];
  currentManufacturerId: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentManufacturerId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/admin/drops/${dropId}/manufacturer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manufacturer_id: value || null }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded border border-zinc-400 bg-white px-3 py-2 text-sm"
      >
        <option value="">– Hersteller wählen –</option>
        {manufacturers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={loading || value === (currentManufacturerId ?? "")}
        className="rounded-full border-2 border-black px-3 py-2 text-sm font-bold hover:bg-zinc-100 disabled:opacity-50"
      >
        {loading ? "…" : "Speichern"}
      </button>
    </div>
  );
}
