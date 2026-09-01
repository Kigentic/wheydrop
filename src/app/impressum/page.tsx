export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-bold">Impressum</h1>

        <h2 className="mt-8 text-lg font-bold">Angaben gemäß § 5 TMG</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Christian Guzien
          <br />
          Fitnessstudio-Inhaber
          <br />
          Köttlingerweg 11
          <br />
          44793 Bochum
        </p>

        <h2 className="mt-8 text-lg font-bold">Kontakt</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Telefon: 0151/46300001
          <br />
          E-Mail: wheydrop@fitskins.de
        </p>
      </main>
    </div>
  );
}
