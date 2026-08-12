# CourtIQ Implementation Roadmap

## Phase 1 — Fixture foundation
- [x] Fixture-first architecture
- [x] Independent game pages
- [x] Upcoming and completed fixtures
- [x] Team history derived from fixtures
- [x] Fixture/scouting separation

## Phase 2 — Scouting ingestion
- [ ] Real screenshot file upload
- [ ] Fixture-scoped source storage
- [ ] Multiple screenshots per scouting session
- [ ] Screenshot thumbnails and deletion
- [ ] OCR provider interface
- [ ] OCR result persistence

## Phase 3 — Verification
- [ ] Candidate extraction mapping
- [ ] Basketball validation rules
- [ ] Confidence flags
- [ ] Side-by-side source/review UI
- [ ] Corrections and audit history
- [ ] Verified dataset lock/versioning

## Phase 4 — Analytics
- [ ] Team game aggregates
- [ ] Player game aggregates
- [ ] Per-game and season averages
- [ ] Opponent recent-form calculations
- [ ] Head-to-head calculations
- [ ] Coverage/sample-size indicators

## Phase 5 — Reports
- [ ] Game report HTML/PDF
- [ ] Opponent scouting report
- [ ] Team season report
- [ ] League/opponent database report
- [ ] Report source traceability

## Phase 6 — External data
- [ ] Import official/public fixtures where reliable
- [ ] Optional league data adapters
- [ ] External team/player enrichment
- [ ] Never allow external data to overwrite verified game data silently

## Current blocker

The application can be developed through the complete review UI without a live OCR provider. Production OCR tuning requires representative Swish screenshots because the exact screen layouts determine field mapping and preprocessing.
