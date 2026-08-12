export function buildGameReportData(fixture, verifiedData) {
  if (!verifiedData) return {ready:false, reason:'No verified game data'};
  return {
    ready:true,
    fixture:{id:fixture.id,date:fixture.date,home:fixture.home,away:fixture.away,venue:fixture.venue,score:fixture.score,quarters:fixture.q || []},
    teamStats:verifiedData.teamStats || [],
    playerStats:verifiedData.playerStats || [],
    sourceCount:verifiedData.sourceCount || 0,
    verifiedAt:verifiedData.verifiedAt || null
  };
}

export function buildOpponentReportData(opponent, fixtures = [], verifiedGames = []) {
  const games = verifiedGames.filter(g => g.opponent === opponent).sort((a,b)=>new Date(b.date)-new Date(a.date));
  return {
    ready: games.length > 0,
    opponent,
    sampleSize: games.length,
    recentGames: games.slice(0,5),
    note: games.length ? null : 'Insufficient verified data for an opponent report.'
  };
}
