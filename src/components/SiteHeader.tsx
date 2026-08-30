import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    // never let an auth hiccup take down the whole layout
    return null;
  }
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex items-center justify-between bg-black px-6 py-3">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wheydrop_logo.png" alt="Wheydrop" className="h-9 w-auto rounded" />
      </Link>

      <nav className="flex items-center gap-6 text-sm font-semibold">
        <Link href="/" className="text-white hover:text-yellow-400">
          Drops
        </Link>
        <Link href="/admin" className="text-white hover:text-yellow-400">
          Admin
        </Link>
        {user ? (
          <Link
            href="/account"
            className="rounded-full bg-yellow-400 px-4 py-1.5 text-black hover:bg-yellow-300"
          >
            Mein Konto
          </Link>
        ) : (
          <Link
            href="/account/login"
            className="rounded-full bg-yellow-400 px-4 py-1.5 text-black hover:bg-yellow-300"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
