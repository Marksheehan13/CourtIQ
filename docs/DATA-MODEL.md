# CourtIQ Canonical Data Model

The fixture is the anchor for all game-specific information. A real Swish game is represented by a set of screenshots because the app exposes different statistics through horizontally scrolled box-score screens, lineups, shot charts, and game summary screens.

```text
Season
 ├── Fixture
 │    ├── SourceScreenshot[]
 │    │    └── OCRExtraction[]
 │    │          └── Verification[]
 │    ├── TeamGameStats[]
 │    ├── PlayerGameStats[]
 │    ├── LineupStats[]
 │    ├── ShotEvent[]
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

A screenshot is never treated as a complete game. Multiple screenshots may describe the same table or different views of the same fixture.

## OCRExtraction

Represents what the extraction engine believed it saw.

- extraction_id
- screenshot_id
- engine
- engine_version
- screen type
- raw output
- structured candidate values
- confidence
- processing timestamp

The extraction schema supports game metadata, quarter scores, player box-score rows, lineups, and shot-chart events. Missing or cropped fields remain null rather than being guessed.

## Verification

Represents human approval/correction of extracted data.

- verification_id
- extraction_id
- fixture_id
- screenshot_id
- field path / structured row
- original value
- corrected value
- reviewer
- status
- timestamp

Verification is the gate between OCR evidence and canonical scouting data.

## Multi-screenshot reconciliation

When several screenshots belong to one fixture, CourtIQ should reconcile overlapping facts rather than treating each screenshot as a separate game record.

Examples:

- The game-summary screen establishes the fixture teams, date, final score, and quarter scores.
- Horizontally scrolled box-score screenshots contribute different statistic columns for the same player rows.
- The lineup screen contributes five-player combinations, minutes, points, and opponent points.
- The shot-chart screen contributes shot-location evidence.

Conflicting values are flagged for review. They are never silently overwritten.

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
8. Overlapping screenshots must be reconciled by fixture, team, jersey number, and player name where available.
