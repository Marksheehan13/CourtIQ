# CourtIQ Scouting Data Model

## Purpose

CourtIQ treats a fixture as the parent record for every scouting artefact. A screenshot is source evidence; verified structured statistics are the canonical dataset.

## Entities

### Season
- id
- name
- competition
- startDate
- endDate

### Team
- id
- name
- shortName
- logo

### Fixture
- id
- seasonId
- date
- homeTeamId
- awayTeamId
- venue
- status: scheduled | in_progress | final | postponed | cancelled
- score
- quarterScores[]

A fixture exists whether or not it has been scouted.

### ScoutingSession
- id
- fixtureId
- createdAt
- updatedAt
- status: uploaded | processing | review | verified | failed

### SourceScreenshot
- id
- fixtureId
- sessionId
- filename
- storageKey
- uploadedAt
- screenshotType
- checksum

Screenshots are immutable source evidence and are never overwritten by OCR corrections.

### OCRExtraction
- id
- screenshotId
- engine
- engineVersion
- extractedAt
- rawText
- structuredCandidates
- confidence
- boundingBoxes
- status

An extraction is a candidate interpretation, not canonical data.

### VerifiedGameData
- fixtureId
- verifiedAt
- verifiedBy
- teamStats
- playerStats
- quarterScores
- verificationVersion

Only verified data can feed historical analytics.

### TeamGameStats
Examples: points, FG, FGA, 3PM, 3PA, FT, FTA, rebounds, assists, steals, blocks, turnovers, fouls.

### PlayerGameStats
Examples: jersey number, player name, minutes, points, rebounds, assists, steals, blocks, turnovers, fouls, FG/FGA, 3PM/3PA, FT/FTA, plus-minus, efficiency.

## State transition

`fixture -> scouting session -> screenshots -> OCR candidates -> review -> verified game data -> analytics -> report`

No step may silently promote unverified values into historical statistics.

## Design requirement

The model must support multiple independent scouting sessions for different fixtures and must aggregate them by team/player without merging the underlying games.
