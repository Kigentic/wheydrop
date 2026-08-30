import Link from "next/link";

export function StaticHeader() {
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
      </nav>
    </header>
  );
}
