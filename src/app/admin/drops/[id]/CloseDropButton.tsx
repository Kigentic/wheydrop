"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CloseDropButton({ dropId }: { dropId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClose() {
    if (!confirm("Drop jetzt manuell schließen? Alle offenen Bestellungen werden zum finalen Preis abgerechnet.")) {
      return;
    }
    setLoading(true);
    await fetch(`/api/admin/drops/${dropId}/close`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleClose}
      disabled={loading}
      className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400 disabled:opacity-50"
    >
      {loading ? "Wird geschlossen…" : "Drop schließen"}
    </button>
  );
}
