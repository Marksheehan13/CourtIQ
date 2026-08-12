# CourtIQ OCR → verification pipeline

## Goal

Turn Swish screenshots into reliable, auditable basketball statistics without allowing OCR mistakes to silently enter the historical database.

## Pipeline

1. **Upload**
   - User is already inside a fixture.
   - Every screenshot is attached to that fixture.
   - Multiple screenshots can belong to one game.

2. **Classify**
   - Identify screenshot type (team box score, player box score, shooting, quarters, etc.).
   - Preserve the original image as evidence.

3. **Extract**
   - Vision/OCR model returns structured fields, not just plain text.
   - Each extracted field should carry a confidence value where possible.

4. **Normalize**
   - Convert values such as `12/28` into `made=12`, `attempted=28`.
   - Normalize player names, team names and jersey numbers.
   - Validate arithmetic relationships such as made <= attempted.

5. **Review**
   - Show extracted values in an editable table.
   - Highlight low-confidence fields.
   - Allow the user to compare the value with the source screenshot.

6. **Verify**
   - User confirms the complete game.
   - Save a verification timestamp and change history.
   - Mark fixture scouting status as `verified`.

7. **Aggregate**
   - Only verified statistics feed team/player history, opponent trends and reports.

## Required UX

The review screen should make it fast to correct OCR rather than force the user to re-enter a whole box score.

Recommended states:

`Uploaded → Processing → Needs review → Verified`

Failed processing should remain recoverable and must never delete the source screenshot.

## Important safeguards

- Never overwrite the source screenshot with OCR output.
- Never treat raw OCR as verified data.
- Never combine screenshots from different fixtures.
- Keep fixture IDs attached throughout the entire pipeline.
- Preserve corrections so future OCR/model improvements can be audited.
