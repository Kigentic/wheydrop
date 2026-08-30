"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StaticHeader } from "@/components/StaticHeader";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <StaticHeader />

      <main className="mx-auto flex max-w-sm flex-col px-6 py-16">
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Passwort
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
          >
            {loading ? "Wird geprüft…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600">
          Noch kein Konto?{" "}
          <Link href="/account/signup" className="font-semibold text-black hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </main>
    </div>
  );
}
