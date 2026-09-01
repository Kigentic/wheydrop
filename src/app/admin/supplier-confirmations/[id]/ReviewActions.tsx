"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    setSubmitting("approve");
    setError(null);
    try {
      const res = await fetch(`/api/admin/supplier-confirmations/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setError("Etwas ist schiefgelaufen.");
      setSubmitting(null);
    }
  }

  async function reject() {
    setSubmitting("reject");
    setError(null);
    try {
      const res = await fetch(`/api/admin/supplier-confirmations/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setError("Etwas ist schiefgelaufen.");
      setSubmitting(null);
    }
  }

  return (
    <div className="mt-6 rounded-lg border-2 border-black p-6">
      <p className="text-sm text-zinc-600">
        Passt das Angebot? Bei Freigabe erhält der Hersteller automatisch den Link zur
        finalen, verbindlichen Bestätigung.
      </p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {showReject && (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Grund (optional, wird dem Hersteller mitgeteilt)"
          rows={2}
          className="mt-3 w-full rounded border border-zinc-400 bg-white px-3 py-2 text-sm"
        />
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={submitting !== null}
          onClick={approve}
          className="rounded-full bg-black px-6 py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
        >
          {submitting === "approve" ? "Wird freigegeben…" : "Freigeben"}
        </button>
        <button
          type="button"
          disabled={submitting !== null}
          onClick={() => (showReject ? reject() : setShowReject(true))}
          className="rounded-full border-2 border-black px-6 py-3 font-bold hover:bg-zinc-100 disabled:opacity-50"
        >
          {submitting === "reject" ? "…" : showReject ? "Ablehnung bestätigen" : "Ablehnen"}
        </button>
      </div>
    </div>
  );
}
