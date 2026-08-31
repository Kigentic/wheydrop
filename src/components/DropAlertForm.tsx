"use client";

import { useState } from "react";

export function DropAlertForm({ dark = false }: { dark?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/drop-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className={`text-center font-semibold ${dark ? "text-yellow-400" : "text-black"}`}>
        Danke! Du bekommst Bescheid, sobald der nächste Drop startet.
      </p>
    );
  }

  const inputClass = dark
    ? "rounded border-2 border-white bg-transparent px-3 py-2 text-white placeholder:text-zinc-400"
    : "rounded border-2 border-black bg-white px-3 py-2 text-black placeholder:text-zinc-400";

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          required
          className={`flex-1 ${inputClass}`}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Deine E-Mail"
          required
          className={`flex-1 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-full bg-yellow-400 px-6 py-2 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Drop Alarm aktivieren"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-center text-sm text-red-500">Etwas ist schiefgelaufen. Nochmal versuchen.</p>
      )}
    </div>
  );
}
