"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ManufacturerActions({ manufacturerId }: { manufacturerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"link" | "refresh" | null>(null);

  async function handleOnboardingLink() {
    setLoading("link");
    const res = await fetch(`/api/admin/manufacturers/${manufacturerId}/onboarding-link`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setLoading(null);
    if (!res.ok) {
      alert(data.error ?? "Fehler beim Erstellen des Onboarding-Links");
      return;
    }
    window.open(data.url, "_blank");
  }

  async function handleRefresh() {
    setLoading("refresh");
    await fetch(`/api/admin/manufacturers/${manufacturerId}/refresh-status`, { method: "POST" });
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleOnboardingLink}
        disabled={loading !== null}
        className="rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold hover:bg-zinc-100 disabled:opacity-50"
      >
        {loading === "link" ? "…" : "Onboarding-Link"}
      </button>
      <button
        onClick={handleRefresh}
        disabled={loading !== null}
        className="rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold hover:bg-zinc-100 disabled:opacity-50"
      >
        {loading === "refresh" ? "…" : "Status aktualisieren"}
      </button>
    </div>
  );
}
