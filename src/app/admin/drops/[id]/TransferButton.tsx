"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TransferButton({
  dropId,
  suggestedAmount,
  disabled,
  disabledReason,
}: {
  dropId: string;
  suggestedAmount: number;
  disabled: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(suggestedAmount.toFixed(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTransfer() {
    const parsed = Number(amount.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Ungültiger Betrag");
      return;
    }
    if (!confirm(`${parsed.toFixed(2)} € jetzt an den Hersteller transferieren?`)) return;

    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/drops/${dropId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parsed }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Transfer fehlgeschlagen");
      return;
    }
    router.refresh();
  }

  if (disabled) {
    return <p className="text-sm text-zinc-500">{disabledReason}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex flex-col gap-1 text-sm">
        <span>Betrag an Hersteller</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded border border-zinc-400 bg-white px-3 py-2"
        />
      </label>
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="rounded-full bg-black px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
      >
        {loading ? "Wird überwiesen…" : "An Hersteller transferieren"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}
