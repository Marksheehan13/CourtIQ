# CourtIQ data model

## Design rule

A **fixture** is the root object. A fixture exists whether or not it has scouting data. All evidence and verified statistics are attached to that fixture by `fixtureId`.

## Core entities

### Season
- `id`
- `name`
- `competition`
- `startDate`
- `endDate`

### Team
- `id`
- `name`
- `shortName`
- `logoUrl`

### Fixture
- `id`
- `seasonId`
- `dateTime`
- `homeTeamId`
- `awayTeamId`
- `venue`
- `competition`
- `status`: `scheduled | live | final | postponed | cancelled`
- `scoutingStatus`: `not_started | processing | needs_review | verified`
- `homeScore`
- `awayScore`
- `source`: `manual | imported`

### QuarterScore
- `fixtureId`
- `quarter`
- `homeScore`
- `awayScore`

### Player
- `id`
- `teamId`
- `name`
- `jerseyNumber`
- `position`

### PlayerGameStats
- `fixtureId`
- `playerId`
- `minutes`
- `points`
- `fgMade`
- `fgAttempted`
- `threeMade`
- `threeAttempted`
- `ftMade`
- `ftAttempted`
- `offensiveRebounds`
- `defensiveRebounds`
- `totalRebounds`
- `assists`
- `steals`
- `blocks`
- `turnovers`
- `fouls`
- `plusMinus`
- `efficiency`

### TeamGameStats
- `fixtureId`
- `teamId`
- `fgMade`
- `fgAttempted`
- `threeMade`
- `threeAttempted`
- `ftMade`
- `ftAttempted`
- `offensiveRebounds`
- `defensiveRebounds`
- `totalRebounds`
- `assists`
- `steals`
- `blocks`
- `turnovers`
- `fouls`

### SourceScreenshot
- `id`
- `fixtureId`
- `filename`
- `storageKey`
- `uploadedAt`
- `screenshotType`
- `ocrStatus`

Screenshots are **source evidence**, not the canonical statistics database.

### OCRExtraction
- `id`
- `screenshotId`
- `fixtureId`
- `model`
- `rawText`
- `structuredPayload`
- `confidence`
- `createdAt`

### Verification
- `fixtureId`
- `verifiedBy`
- `verifiedAt`
- `changes`
- `status`

Only verified data should feed historical analytics and reports.

### Report
- `id`
- `fixtureId` (nullable for multi-game reports)
- `teamId`
- `reportType`: `game | opponent | season | league`
- `generatedAt`
- `dataSnapshotVersion`
- `fileKey`

## Relationships

`Season → Fixtures → (Screenshots → OCR → Verification) → Game Stats → Historical Aggregates → Reports`

A team can appear in many fixtures. A player can appear in many `PlayerGameStats` records. Historical team/player statistics are calculated from the verified game records and must not replace them.
