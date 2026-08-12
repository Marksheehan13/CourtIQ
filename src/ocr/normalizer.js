/**
 * CourtIQ OCR normalizer.
 *
 * OCR providers should return raw candidates; this module turns them into a
 * provider-neutral review model. It deliberately does not mark anything as
 * verified. Verification is a separate application action.
 */

export const FIELD_RULES = {
  points: { min: 0, integer: true },
  rebounds: { min: 0, integer: true },
  assists: { min: 0, integer: true },
  steals: { min: 0, integer: true },
  blocks: { min: 0, integer: true },
  turnovers: { min: 0, integer: true },
  fouls: { min: 0, integer: true },
  minutes: { min: 0 },
  fgMade: { min: 0, integer: true },
  fgAttempted: { min: 0, integer: true },
  threeMade: { min: 0, integer: true },
  threeAttempted: { min: 0, integer: true },
  ftMade: { min: 0, integer: true },
  ftAttempted: { min: 0, integer: true },
};

const integer = value => Number.isInteger(Number(value));
const nonNegative = value => Number(value) >= 0;

export function parseMadeAttempted(value) {
  if (typeof value === 'number') return { made: value, attempted: null };
  const match = String(value ?? '').trim().match(/^(\d+)\s*[/\\-]\s*(\d+)$/);
  return match ? { made: Number(match[1]), attempted: Number(match[2]) } : null;
}

export function validateStatRecord(stats = {}) {
  const errors = [];
  for (const [field, rule] of Object.entries(FIELD_RULES)) {
    if (stats[field] == null || stats[field] === '') continue;
    if (!nonNegative(stats[field])) errors.push(`${field} cannot be negative`);
    if (rule.integer && !integer(stats[field])) errors.push(`${field} must be an integer`);
  }

  const pairs = [
    ['fgMade', 'fgAttempted'],
    ['threeMade', 'threeAttempted'],
    ['ftMade', 'ftAttempted'],
  ];
  for (const [made, attempted] of pairs) {
    if (stats[made] != null && stats[attempted] != null && Number(stats[made]) > Number(stats[attempted])) {
      errors.push(`${made} cannot exceed ${attempted}`);
    }
  }
  if (stats.threeMade != null && stats.fgMade != null && Number(stats.threeMade) > Number(stats.fgMade)) {
    errors.push('threeMade cannot exceed fgMade');
  }
  return errors;
}

export function confidenceBand(confidence) {
  const n = Number(confidence);
  if (n >= 0.9) return 'high';
  if (n >= 0.7) return 'medium';
  return 'low';
}

export function createCandidate({ fixtureId, screenshotId, field, value, confidence = 0, sourceBox = null }) {
  const errors = validateStatRecord({ [field]: value });
  return {
    id: `candidate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fixtureId,
    screenshotId,
    field,
    originalValue: value,
    value,
    confidence: Number(confidence),
    confidenceBand: confidenceBand(confidence),
    sourceBox,
    validationErrors: errors,
    status: errors.length ? 'needs_review' : 'candidate',
    corrected: false,
  };
}

export function validateTeamGame(home, away, quarterScores = []) {
  const errors = [];
  const score = value => Number(value);
  if (home != null && away != null && (score(home) < 0 || score(away) < 0)) errors.push('Final scores cannot be negative');
  const quarters = quarterScores.map(score).filter(Number.isFinite);
  if (quarters.some(q => q < 0)) errors.push('Quarter scores cannot be negative');
  return errors;
}

export function toReviewPayload(extraction) {
  return {
    version: '1.0',
    fixtureId: extraction.fixtureId,
    screenshotId: extraction.screenshotId,
    engine: extraction.engine ?? 'unknown',
    engineVersion: extraction.engineVersion ?? 'unknown',
    status: 'review',
    candidates: extraction.candidates ?? [],
    rawText: extraction.rawText ?? '',
    blocks: extraction.blocks ?? [],
    verified: false,
  };
}
