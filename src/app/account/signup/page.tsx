"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      options: { data: { first_name: firstName, last_name: lastName } },
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
      <div className="flex min-h-screen items-center justify-center bg-black px-6 py-16">
        <div className="w-full max-w-sm text-center">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Fast geschafft
          </span>
          <div className="mt-8 rounded-2xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#FFD600]">
            <h1 className="text-2xl font-black">Check dein Postfach</h1>
            <p className="mt-4 text-sm text-zinc-600">
              Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Klick
              auf den Link darin, um dein Konto zu aktivieren.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
            Community beitreten
          </span>
          <h1 className="mt-4 text-3xl font-black text-white">Konto erstellen</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Bestpreise sichern, Bestellungen verfolgen — in 30 Sekunden dabei.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#FFD600]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Vorname
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoFocus
                  className="rounded border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-black"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold">
                Nachname
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="rounded border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-black"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              E-Mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded border border-zinc-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-black"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Passwort
              <PasswordInput value={password} onChange={setPassword} required minLength={6} />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 transition hover:bg-zinc-900 disabled:opacity-50"
            >
              {loading ? "Wird angelegt…" : "Konto erstellen"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Schon dabei?{" "}
          <Link href="/account/login" className="font-semibold text-yellow-400 hover:underline">
            Zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
