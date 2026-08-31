"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

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
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Mein Konto
          </span>
          <h1 className="mt-4 text-3xl font-black text-white">Willkommen zurück</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Logg dich ein und verfolge deine laufenden Drops.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#FFD600]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              E-Mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="rounded border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-black"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Passwort
              <PasswordInput value={password} onChange={setPassword} required />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
            >
              {loading ? "Wird geprüft…" : "Login"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Noch kein Konto?{" "}
          <Link href="/account/signup" className="font-semibold text-yellow-400 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
