# Sternenanhänger Weihnachtswunschbaum

Dieses Repository enthält einen vollständigen Vorschlag für eine digitale Wunschlisten-Anwendung mit Angular-Frontend, Express/SQLite-Backend und PWA-Funktionalität.

## Struktur
- `docs/architecture.md` – technisches Konzept, Datenmodell, API, Deployment.
- `backend/` – Express + SQLite API mit Seed-Skript.
- `frontend/` – Angular-Standalone-App mit PWA-Konfiguration.

## Kurzanleitung
1. **Backend**
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
3. Optional: Backend kann den gebauten Frontend-Ordner über `STATIC_FRONTEND_PATH` ausliefern.
