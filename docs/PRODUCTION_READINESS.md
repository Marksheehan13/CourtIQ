# CourtIQ production-readiness checklist

## Verified in repository
- [x] Vite build configuration exists
- [x] Browser entrypoint is `app.js`
- [x] Fixture-scoped screenshot storage in the UI
- [x] Canonical game model
- [x] Verification gate before analytics/reporting
- [x] SWISH field normalization
- [x] SWISH screen classification
- [x] Advanced team/player analytics modules
- [x] Season and fixture isolation
- [x] Supabase relational schema
- [x] GitHub Actions install/test/build pipeline
- [x] Runtime smoke tests

## Required before real production use
- [ ] Connect a production OCR/vision API key
- [ ] Validate extraction against real Irish National League SWISH screenshots
- [ ] Move browser screenshot storage from localStorage to Supabase Storage
- [ ] Connect UI reads/writes to Supabase instead of seed/local fixture data
- [ ] Add authentication and row-level security before multi-user deployment
- [ ] Generate and visually inspect final PDF reports
- [ ] Run an end-to-end real-game acceptance test

## Acceptance flow
1. Create/select a fixture.
2. Upload multiple screenshots to that fixture.
3. Extract OCR candidates.
4. Review/edit uncertain fields.
5. Verify the game.
6. Confirm the game appears in historical team/player analytics.
7. Generate a scouting report using verified games only.
8. Confirm a second fixture remains completely independent.
