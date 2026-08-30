"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/PasswordInput";

export function AdminLoginForm() {
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
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Passwort"
          required
          autoFocus
          className="mt-6"
        />
        {error && <p className="mt-2 text-sm text-red-600">Falsches Passwort.</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Admin-Konto?{" "}
          <Link href="/account/login" className="font-semibold text-black hover:underline">
            Mit Kundenkonto einloggen
          </Link>
        </p>
      </form>
    </div>
  );
}
