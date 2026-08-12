# CourtIQ

CourtIQ is a basketball scouting platform built around **fixtures as the primary record**. Each fixture is independent, while all verified games accumulate into a season database.

## Current MVP

- Season management
- Team database
- Full fixture schedule
- Upcoming / Final / Postponed / Cancelled status
- Independent game pages
- Result + quarter-by-quarter score entry
- Team statistics entry
- Multiple Swish screenshots attached to a specific fixture
- Vision OCR pipeline for screenshots (OpenAI or Anthropic)
- OCR JSON retained for audit/review
- Game Report PDF
- Season Fixture Report PDF
- Local SQLite persistence

## Run

```bash
pip install -r requirements.txt
streamlit run app.py
```

AI OCR is optional. Configure either:

```text
OPENAI_API_KEY=...
COURTIQ_AI_PROVIDER=openai
```

or:

```text
ANTHROPIC_API_KEY=...
COURTIQ_AI_PROVIDER=anthropic
```

## Architecture

`season -> fixtures -> game stats / player stats / screenshots / OCR / reports`

The next development phases are player-stat persistence, OCR verification/editing, automated opponent scouting reports, league/team aggregation, shot charts, and richer PDF layouts.
