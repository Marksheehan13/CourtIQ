// Canonical CourtIQ game schema. Only verified records should enter this shape.
export function createVerifiedGame({fixture, teamStats=[], playerStats=[], screenshots=[], verifiedAt=null, verifiedBy=null}) {
  if (!fixture?.id) throw new Error('A fixture id is required');
  if (!verifiedAt) throw new Error('A verifiedAt timestamp is required');
  return {
    id: `game-${fixture.id}`,
    fixtureId: fixture.id,
    date: fixture.date,
    venue: fixture.venue || null,
    home: fixture.home,
    away: fixture.away,
    score: fixture.score || null,
    quarters: fixture.q || [],
    teamStats,
    playerStats,
    sourceScreenshotIds: screenshots.map(s => s.id),
    verification: {status:'verified', verifiedAt, verifiedBy}
  };
}

export function isVerifiedGame(game) {
  return Boolean(game?.fixtureId && game?.verification?.status === 'verified' && game?.verification?.verifiedAt);
}
