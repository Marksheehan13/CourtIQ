# CourtIQ OCR Engineering Notes

## Recommended pipeline

CourtIQ should use a layered extraction pipeline rather than trusting a single OCR pass:

1. Preserve the original Swish screenshot as immutable source evidence.
2. Detect/crop relevant statistical regions where possible.
3. Run a deterministic OCR engine for text recognition.
4. Preserve bounding boxes and confidence scores.
5. Normalize OCR output into typed basketball fields.
6. Apply basketball validation rules (e.g. made shots cannot exceed attempts; quarter totals must reconcile with final score where applicable).
7. Use a vision-language model as a secondary resolver for ambiguous regions, not as the sole source of truth.
8. Present every low-confidence/invalid field for human review.
9. Only verified values enter the canonical game database.
10. Keep the raw OCR extraction and verification history for auditability.

## Open-source component research

PaddleOCR is a strong candidate for the deterministic OCR layer. Its current 3.7 release provides PP-OCRv6, layout/table parsing, bounding boxes, confidence information, JSON/Markdown structured output, and a browser inference SDK. It is Apache-2.0 licensed, making it suitable for a commercial/proprietary CourtIQ application subject to normal licence compliance.

Official project: https://github.com/PaddlePaddle/PaddleOCR

CourtIQ should not assume that generic document OCR alone will solve Swish screenshots. Basketball-specific post-processing and validation are essential because the screenshots contain structured sports statistics rather than ordinary prose.

## Basketball-specific normalization

The extraction layer should support, at minimum:

- player number
- player name
- minutes
- points
- field goals made/attempted
- 2PT made/attempted
- 3PT made/attempted
- free throws made/attempted
- offensive rebounds
- defensive rebounds
- total rebounds
- assists
- steals
- blocks
- turnovers
- fouls
- plus/minus when available
- team totals
- quarter scores
- final score

Derived metrics should be calculated from verified primitive values rather than trusted directly from OCR.

## Confidence model

Each extracted value should retain:

- raw OCR text
- normalized value
- OCR confidence when available
- validation status
- reviewer-edited value, if changed
- verification timestamp
- source screenshot ID

Suggested states:

`extracted` → `needs_review` → `verified` → `superseded`

## Why this architecture

The objective is not merely to turn screenshots into text. CourtIQ needs trustworthy longitudinal basketball data. A wrong OCR value can contaminate player histories, opponent trends and scouting reports, so the system must make uncertainty visible and prevent unverified data from propagating into analysis.
