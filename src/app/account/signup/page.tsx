"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/account");
      router.refresh();
    } else {
      // email confirmation required before a session exists
      setCheckEmail(true);
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="min-h-screen bg-white text-black">
        <main className="mx-auto max-w-sm px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Fast geschafft</h1>
          <p className="mt-4 text-zinc-600">
            Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Klick
            auf den Link darin, um dein Konto zu aktivieren.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto flex max-w-sm flex-col px-6 py-16">
        <h1 className="text-2xl font-bold">Konto erstellen</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded border border-zinc-400 bg-white px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Passwort
            <PasswordInput value={password} onChange={setPassword} required minLength={6} />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
          >
            {loading ? "Wird angelegt…" : "Konto erstellen"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600">
          Schon dabei?{" "}
          <Link href="/account/login" className="font-semibold text-black hover:underline">
            Zum Login
          </Link>
        </p>
      </main>
    </div>
  );
}
