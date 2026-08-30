# Proteinbörse – Projektplan

## Übersicht
Group-Buying-Plattform für Whey Protein/Supplements, DACH-Markt. Nachfrage-Bündelung via zeitlich befristete Drops (48h). Mehr Bestellungen → niedrigerer Preis pro Stufe, für alle Teilnehmer gleichzeitig. Kein Lager, kein Versand — Streckengeschäft, Hersteller liefert direkt an Kunde.

## Tech Stack
| Schicht | Tech |
|---|---|
| Frontend + API | Next.js (App Router) |
| DB + Realtime | Supabase (Postgres + Realtime) |
| Payment | Stripe PaymentIntents (Authorize → Capture) |
| Hosting | Vercel |
| Automatisierung | n8n (Export Bestelldaten an Lieferant) |
| E-Mail | Resend oder Supabase Edge Functions + Postmark |

## Datenmodell

### drops
- id, title, brand_name, status (upcoming/active/closed)
- starts_at, ends_at
- price_tiers (jsonb: [{min_units, max_units, price}])
- max_units, total_ordered, current_price
- created_at

### variants
- id, drop_id (FK)
- flavor, available_units, ordered_units

### orders
- id, drop_id (FK), variant_id (FK)
- quantity, authorized_amount, final_amount
- stripe_payment_intent, status (authorized/captured/cancelled/refunded)
- customer_name, customer_email, customer_address (jsonb)
- created_at

## Drop-Mechanik
- Laufzeit: 48h fix
- Max 2 gleichzeitige Drops
- Typen: Brand Drop (Phase 1), Flavor Drop (Phase 2, Multi-Hersteller)
- Preisstufen vom Lieferanten vordefiniert; neue Stufe erreicht → gilt rückwirkend für alle Bestellungen im Drop
- Kunde sieht: Live-Zähler, aktueller Preis, nächste Stufe (Preis + fehlende Einheiten), Countdown

## Payment-Flow
1. Kunde autorisiert Maximalbetrag (höchste Preisstufe) via Stripe PaymentIntent (Authorize only)
2. Bei Drop-Ende: finaler Preis anhand `total_ordered` + `price_tiers` berechnet
3. Capture auf finalen (niedrigeren) Betrag
4. E-Mail an Kunde mit Endpreis

## Seiten-Struktur
```
/                       Startseite – aktive + kommende Drops
/drop/[id]              Drop-Detail (Zähler, Countdown, Bestellformular)
/drop/[id]/confirm      Bestellbestätigung
/admin                  Login
/admin/dashboard        Übersicht alle Drops
/admin/drops/new        Drop anlegen
/admin/drops/[id]       Drop bearbeiten + Bestellübersicht (CSV-Export)
```

## Realtime
- Supabase Realtime Subscription auf `drops.total_ordered` / `drops.current_price`
- Neue Order → Zähler inkrementiert, Preis neu berechnet, alle Clients live aktualisiert
- Kein Polling, echte Websockets

## E-Mail-Trigger
| Trigger | Empfänger | Inhalt |
|---|---|---|
| Order erstellt | Kunde | Bestätigung, autorisierter Betrag, aktueller Preis |
| Drop geschlossen | Kunde | Finaler Preis, Belastung |
| Drop geschlossen | Admin | Summary: Einheiten, Preis, Umsatz |
| Drop geschlossen | Lieferant | CSV: Name, Adresse, Flavor, Menge |

## Design
Börsen-Interface + Drop-Commerce (Supreme/SNKRS) + Community-Gefühl. Direkt, dynamisch, kein Lifestyle-Look. Dunkel, energetisch.

Kern-UI:
- Großer Live-Zähler (dominant)
- Preisstufen-Fortschrittsbalken
- Permanenter Countdown
- CTA „Jetzt dabei sein"

## MVP-Scope (Phase 1)
- [ ] 1 aktiver Drop gleichzeitig
- [ ] Brand Drop, bis zu 5 Flavors
- [ ] Bestellprozess mit Stripe Authorize
- [ ] Live-Zähler + Countdown (Supabase Realtime)
- [ ] Automatischer Drop-Abschluss + Capture
- [ ] CSV-Export für Lieferant
- [ ] E-Mail-Bestätigung Kunde
- [ ] Admin-Dashboard (passwortgeschützt, kein Public Signup)

## Phase 2+ (nicht im MVP)
- Mehrere parallele Drops
- Flavor Drops (Multi-Hersteller)
- Kundenkonten/Login
- Protein Index / Preisdaten
- Empfehlungslinks / virales Sharing-Tracking
- B2B-Bestellprozess (Fitnessstudios)

## Nächste Schritte
1. Next.js Projekt aufsetzen, Vercel verknüpfen
2. Supabase Projekt + Schema (drops, variants, orders) anlegen
3. Stripe Account + Test-Keys, PaymentIntent-Flow bauen
4. Drop-Detailseite mit Realtime-Zähler
5. Admin CRUD für Drops
6. n8n-Workflow für CSV-Export an Lieferant
7. E-Mail-Templates + Versand einrichten
