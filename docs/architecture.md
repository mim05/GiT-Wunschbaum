# Sternenanhänger Weihnachtswunschbaum – Technisches Konzept

## Architekturüberblick
- **Frontend**: Angular (Standalone-Komponenten, Angular 17+), Responsive Layout (Material Design), PWA (Web App Manifest + Angular Service Worker), Routing für Besucher-Ansicht, Reservierungs-Flow, Admin-Ansicht.
- **Backend**: Node.js + Express (TypeScript), SQLite für lokale Persistenz (austauschbar gegen PostgreSQL/MySQL), REST-API `/api/wishes` mit klaren Status-Transitionen.
- **Deployment**: Containerisierbar (Docker), getrennte Builds für Frontend (statisches Bundle) und Backend (API + statische Auslieferung). Environment-Variablen zur DB-Konfiguration und CORS.

## Datenmodell
### Entität `Wish`
| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `id` | Integer (PK) | fortlaufende ID |
| `title` | Text | Klartexttitel des Wunsches (statische Startliste) |
| `status` | Enum (`free`, `reserved`, `fulfilled`) | aktueller Status |
| `reservedAt` | DateTime, nullable | Zeitpunkt der Reservierung |
| `reservedBy` | Text, nullable | Name des Mitarbeiters |
| `reservedEmail` | Text, nullable | optionale E-Mail |
| `fulfilledAt` | DateTime, nullable | Zeitpunkt der Abgabe |

## Statuslogik
- **free → reserved**: nur wenn aktuell `free`. Speichert `reservedAt`, `reservedBy`, `reservedEmail`.
- **reserved → fulfilled**: nur wenn aktuell `reserved`. Speichert `fulfilledAt`.
- **reset**: immer erlaubt. Setzt Status auf `free`, leert alle Metadaten.

## REST-API
- `GET /api/wishes`: Liste aller Wünsche.
- `POST /api/wishes/:id/reserve`: Body `{ name: string; email?: string; }`. Validiert Status `free`.
- `POST /api/wishes/:id/fulfill`: Body leer. Validiert Status `reserved`.
- `POST /api/wishes/:id/reset`: Admin-Aktion, setzt Wunsch zurück.
- Fehlercodes: `400` (ungültiger Statusübergang), `404` (nicht gefunden), `500` (Serverfehler).

## Frontend-Architektur
- **Module/Struktur**: Standalone-Komponenten + Feature-Verzeichnisse.
  - `app/core`: Services (HTTP, Toast), Interceptor (API-Basis-URL), Models.
  - `app/features/wishes`: Listen- und Detail-Komponenten, Filter/Badges für Status.
  - `app/features/admin`: Reset-Aktion mit Bestätigungsdialog.
- **State-Management**: Services + Signals/Observables (HttpClient), einfache Filter per Pipe.
- **PWA**: `manifest.webmanifest`, `ngsw-config.json` für Asset- und API-Fallback (Stale-While-Revalidate für `/api/wishes`). Offline-Cache der Wunschliste, Reserve/Fulfill im Offline-Modus optional per Background Sync (später erweiterbar).
- **UI-Patterns**: Cards/Chips für Status, Dialog/Bottom-Sheet für Reservierung, Toasts für Feedback, Loading-Spinner.

## Datenbank
- **Schema**: siehe `backend/src/schema.sql`.
- **Seed**: initiale Wunschliste in `backend/src/seed-wishes.ts` (ersetzen durch vollständige Liste). Beim ersten Start wird automatisch seeding durchgeführt, falls DB leer ist.

## Deployment
1. **Frontend-Build**: `cd frontend && npm install && npm run build` erzeugt `dist/frontend`.
2. **Backend**: `cd backend && npm install && npm run build && npm start`. Backend kann statische Frontend-Dateien aus `../frontend/dist/frontend/browser` ausliefern (siehe `STATIC_FRONTEND_PATH`).
3. **Docker**: Multi-stage: Node-Builder (Frontend + Backend) → schlanker Node- oder nginx/Node-Image. Env-Variablen: `PORT`, `DATABASE_URL` (z. B. `file:./data/wishes.db`), `CORS_ORIGIN`.
4. **PWA**: Für HTTPS bereitstellen; Service Worker benötigt sichere Herkunft. Optional `nginx`/`Caddy` vor das Backend.

## Erweiterbarkeit
- **Auth**: Admin-Reset per einfacher Shared-Secret-Header oder später OIDC.
- **Auditing**: Tabelle `wish_events` mit History (Reservierung/Reset/Abgabe).
- **E-Mail-Benachrichtigungen**: Webhook/SMTP bei Reservierung.
- **Import/Export**: CSV-Upload neuer Wunschlisten; derzeit statisch.
