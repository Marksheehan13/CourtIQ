# CourtIQ

CourtIQ is a basketball scouting and analytics platform designed around fixture-scoped Swish screenshots.

## Workflow

`Fixture → Screenshots → OCR → Review → Validation → Reconciliation → Verification → Analytics → Report`

Every game is isolated by fixture and season. Unverified OCR candidates are not intended to enter trusted analytics.

## Run locally

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Test and build

```bash
npm test
npm run build
```

GitHub Actions runs both checks on pushes to `main`/`scouting-mvp` and pull requests into `main`.

## Current architecture

- `app.js` / `index.html` — current browser application shell
- `src/data` — fixture, season, game, roster and validation models
- `src/ocr` — preprocessing, provider adapters and basketball parsing
- `src/analytics` — trends, possessions, efficiency and lineups
- `src/ui` — fixture workspace, dashboard/opponent models and OCR review
- `src/reports` — verified-game selection, report context and printable reports
- `supabase/schema.sql` — relational production database schema

## OCR providers

OCR is deliberately provider-neutral. Configure an HTTP OCR endpoint through the provider adapter when a production OCR service is selected. The application treats OCR output as candidate data until it passes review and verification.
