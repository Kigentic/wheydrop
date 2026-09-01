"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConfirmActions({ token }: { token: string }) {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState<"confirm" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "confirm" | "decline") {
    setSubmitting(action);
    setError(null);
    try {
      const res = await fetch(`/api/supplier-confirm/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte nochmal versuchen.");
      setSubmitting(null);
    }
  }

  return (
    <div className="mt-8 rounded-lg border-2 border-black p-6">
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Ich bestätige die oben genannte Menge und den Preis verbindlich gemäß den Bedingungen
          unseres Liefervertrags mit Wheydrop (Textform gem. § 126b BGB).
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={!agree || submitting !== null}
          onClick={() => act("confirm")}
          className="rounded-full bg-black px-6 py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
        >
          {submitting === "confirm" ? "Wird bestätigt…" : "Zusage verbindlich bestätigen"}
        </button>
        <button
          type="button"
          disabled={submitting !== null}
          onClick={() => act("decline")}
          className="rounded-full border-2 border-black px-6 py-3 font-bold hover:bg-zinc-100 disabled:opacity-50"
        >
          {submitting === "decline" ? "…" : "Ablehnen"}
        </button>
      </div>
    </div>
  );
}
