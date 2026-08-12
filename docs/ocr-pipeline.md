# CourtIQ OCR Pipeline

## Pipeline

1. Upload one or more screenshots to a fixture-specific scouting session.
2. Store the original image unchanged.
3. Preprocess a working copy for OCR where useful (crop, scale, contrast, orientation).
4. Run OCR/layout extraction.
5. Map detected text into basketball-specific candidate fields.
6. Validate candidates using domain rules.
7. Assign confidence and flag ambiguous values.
8. Present candidates in a review UI alongside the source screenshot.
9. User corrects or accepts values.
10. Save a versioned verified dataset against the fixture.
11. Recalculate derived metrics.
12. Make verified data available to historical analytics and reports.

## Provider abstraction

OCR must be implemented behind a provider interface so CourtIQ can use PaddleOCR, a vision model, or another engine without changing the verification layer.

Expected provider output:

```json
{
  "engine": "provider-name",
  "version": "provider-version",
  "text": "raw OCR text",
  "blocks": [
    {
      "text": "17",
      "confidence": 0.98,
      "box": [0, 0, 100, 40]
    }
  ]
}
```

## Basketball validation

Validation should detect impossible or suspicious values before review, including:

- Made shots greater than attempts.
- Three-pointers greater than total field goals.
- Free throws greater than attempts.
- Negative statistics.
- Duplicate player rows.
- Team totals inconsistent with player totals where the source screen permits reconciliation.
- Quarter totals inconsistent with final score where both are available.
- OCR confusions such as `8/3`, `0/O`, `1/7`, and punctuation loss.

## Confidence policy

- High confidence: display as accepted candidate but remain editable.
- Medium confidence: visibly flag for review.
- Low confidence: require explicit user confirmation.

A screenshot can never directly create verified historical data.
