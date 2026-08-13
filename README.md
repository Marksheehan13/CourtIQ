# CourtIQ

CourtIQ is a basketball scouting platform built around Swish screenshots. The core rule is **evidence first**: every screenshot belongs to one fixture, OCR output is treated as a candidate, and only verified values should feed reports and longitudinal analytics.

## Current architecture

- Vite + vanilla JavaScript frontend
- Netlify deployment configuration
- Fixture-first workflow with independent game workspaces
- Local browser persistence for the prototype data layer
- Provider-neutral OCR endpoint supporting Anthropic, OpenAI and Gemini through Netlify environment variables
- Swish screen classification and basketball field normalization
- OCR review states and extraction audit trail
- Shooting metrics, trends, opponent model and report-data foundations

## Development

```bash
npm install
npm run dev
```

## OCR configuration

Set one provider key in Netlify. The endpoint defaults to Anthropic, but `OCR_PROVIDER` can be set to `anthropic`, `openai`, or `gemini`.

Never put provider API keys in the browser or commit them to GitHub.

## Data integrity

1. Create/select a fixture before uploading screenshots.
2. Preserve source screenshots.
3. Treat OCR as unverified evidence.
4. Validate basketball statistics before verification.
5. Keep corrections as verification history.
6. Only verified data should feed reports and historical analytics.
