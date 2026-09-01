import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-yellow-400 bg-black px-6 py-10 text-sm text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <span>© {new Date().getFullYear()} Wheydrop. Alle Preise inkl. MwSt.</span>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/impressum" className="hover:text-white hover:underline">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-white hover:underline">
            Datenschutz
          </Link>
          <Link href="/agb" className="hover:text-white hover:underline">
            AGB
          </Link>
          <Link href="/agb-b2b" className="hover:text-white hover:underline">
            AGB (B2B)
          </Link>
          <Link href="/widerrufsrecht" className="hover:text-white hover:underline">
            Widerrufsrecht
          </Link>
        </nav>
      </div>
    </footer>
  );
}
