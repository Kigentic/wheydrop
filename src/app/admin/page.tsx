"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border-2 border-black p-8">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          required
          autoFocus
          className="mt-6 w-full rounded border border-zinc-400 bg-white px-3 py-2"
        />
        {error && <p className="mt-2 text-sm text-red-600">Falsches Passwort.</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
}
