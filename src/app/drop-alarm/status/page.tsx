import Link from "next/link";

export default async function DropAlarmStatus({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const success = ok === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <div className="max-w-md text-center">
        {success ? (
          <>
            <h1 className="text-2xl font-bold">
              Drop Alarm <span className="bg-yellow-400 px-2">aktiviert!</span>
            </h1>
            <p className="mt-4 text-zinc-600">
              Du bekommst ab jetzt automatisch Bescheid, sobald ein neuer Drop startet.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Link ungültig</h1>
            <p className="mt-4 text-zinc-600">
              Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 font-bold text-yellow-400 hover:bg-zinc-900"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
