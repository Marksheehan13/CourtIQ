export function validateBoxScore(stats = {}) {
  const errors = [];
  const warnings = [];
  const integerFields = ['reb','ast','stl','blk','to','pf','pts'];
  for (const [key,value] of Object.entries(stats)) {
    if (integerFields.includes(key) && (typeof value !== 'number' || value < 0 || !Number.isInteger(value))) errors.push(`${key} must be a non-negative integer`);
  }
  const pairs = [['fgm','fga','FG made cannot exceed attempts'],['tpm','tpa','3PT made cannot exceed attempts'],['ftm','fta','FT made cannot exceed attempts']];
  for (const [made,attempts,msg] of pairs) if (stats[made] != null && stats[attempts] != null && stats[made] > stats[attempts]) errors.push(msg);
  if (stats.tpm != null && stats.fgm != null && stats.tpm > stats.fgm) errors.push('3PT made cannot exceed total FG made');
  if (stats.pts != null && stats.pts > 200) warnings.push('Unusually high points total; verify source');
  return {valid: errors.length === 0, errors, warnings};
}

export function confidenceBand(value) {
  const n = Number(value);
  if (n >= .9) return 'high';
  if (n >= .7) return 'medium';
  return 'low';
}

export function buildVerificationRecord({fixtureId, screenshotId, extraction, correctedFields = {}}) {
  return {
    fixtureId,
    screenshotId,
    createdAt: new Date().toISOString(),
    status: 'review',
    source: extraction,
    correctedFields,
    validation: validateBoxScore(correctedFields),
    verifiedAt: null,
    verifiedBy: null
  };
}
