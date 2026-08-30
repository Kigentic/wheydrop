"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StaticHeader } from "@/components/StaticHeader";
import { PasswordInput } from "@/components/PasswordInput";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setError("Nicht eingeloggt.");
      setLoading(false);
      return;
    }

    // verify current password before allowing the change
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      setError("Aktuelles Passwort ist falsch.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <StaticHeader />

      <main className="mx-auto flex max-w-sm flex-col px-6 py-16">
        <h1 className="text-2xl font-bold">Passwort ändern</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1 text-sm">
            Aktuelles Passwort
            <PasswordInput value={currentPassword} onChange={setCurrentPassword} required autoFocus />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Neues Passwort
            <PasswordInput value={newPassword} onChange={setNewPassword} required minLength={6} />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Neues Passwort bestätigen
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} required minLength={6} />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">Passwort geändert.</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 font-bold text-yellow-400 hover:bg-zinc-900 disabled:opacity-50"
          >
            {loading ? "Wird geändert…" : "Passwort ändern"}
          </button>
        </form>
      </main>
    </div>
  );
}
