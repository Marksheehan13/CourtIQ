# CourtIQ Canonical Data Model

The fixture is the anchor for all game-specific information.

```text
Season
 ├── Fixture
 │    ├── SourceScreenshot[]
 │    │    └── OCRExtraction[]
 │    │          └── Verification[]
 │    ├── TeamGameStats[]
 │    ├── PlayerGameStats[]
 │    ├── QuarterScore[]
 │    └── Report[]
 ├── Team[]
 └── Player[]
```

## Fixture

A scheduled game exists even when no scouting material has been collected.

Required identity fields:

- fixture_id
- season_id
- date/time
- home_team_id
- away_team_id
- competition
- venue
- status

Optional result fields:

- final score
- quarter scores
- overtime periods
- winner

## SourceScreenshot

Represents immutable evidence supplied by the user.

- screenshot_id
- fixture_id
- filename
- storage reference
- screenshot type/category
- upload timestamp
- checksum

## OCRExtraction

Represents what the extraction engine believed it saw.

- extraction_id
- screenshot_id
- engine
- engine_version
- raw output
- structured candidate values
- confidence
- processing timestamp

## Verification

Represents human approval/correction of extracted data.

- verification_id
- extraction_id
- field path
- original value
- corrected value
- reviewer
- status
- timestamp

## Canonical statistics

Verified team and player game statistics reference both the fixture and the relevant team/player. Historical queries aggregate these records; they never replace them.

## Important integrity rules

1. A fixture must not be created by uploading a screenshot. The fixture is selected/created first.
2. Screenshots belong to exactly one fixture.
3. OCR output is not canonical data.
4. Only verified values feed reports and historical analytics.
5. A correction creates verification history rather than silently destroying the original extraction.
6. Deleting a report must never delete the underlying game data.
7. Team/player aggregates are derived views, not independent copies of game truth.
