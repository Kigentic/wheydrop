import { SupplierOfferForm } from "./SupplierOfferForm";

export default function SupplierOfferPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="inline-block bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
          Für Hersteller &amp; Lieferanten
        </span>
        <h1 className="mt-4 text-2xl font-bold">Angebot für einen Wheydrop-Drop einreichen</h1>
        <p className="mt-3 leading-relaxed text-zinc-600">
          Ihr wollt bei Wheydrop dabei sein? Lest euch den Rahmenvertrag unten durch, füllt
          das Formular mit eurer angebotenen Menge und eurem verbindlichen Preis aus und
          schickt es ab. Wir prüfen euer Angebot und melden uns zeitnah zurück.
        </p>

        <SupplierOfferForm />
      </main>
    </div>
  );
}
