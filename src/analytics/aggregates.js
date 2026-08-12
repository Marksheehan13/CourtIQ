export function teamGameSummary(game, teamId) {
  const side = game.teams?.[teamId] || {};
  const fgPct = side.fga ? side.fgm / side.fga : null;
  const threePct = side.tpa ? side.tpm / side.tpa : null;
  const ftPct = side.fta ? side.ftm / side.fta : null;
  return { teamId, points: side.pts ?? null, rebounds: side.reb ?? null, assists: side.ast ?? null, turnovers: side.to ?? null, fgPct, threePct, ftPct };
}

export function averageGames(games = [], teamId) {
  const rows = games.map(g => teamGameSummary(g, teamId)).filter(r => r.points != null);
  if (!rows.length) return {games:0};
  const avg = key => rows.reduce((s,r)=>s+(r[key] ?? 0),0)/rows.length;
  return {
    games: rows.length,
    points: avg('points'), rebounds: avg('rebounds'), assists: avg('assists'), turnovers: avg('turnovers'),
    fgPct: avg('fgPct'), threePct: avg('threePct'), ftPct: avg('ftPct')
  };
}

export function recentOpponentForm(games = [], opponentId, limit = 5) {
  return games.filter(g => g.opponentId === opponentId).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,limit);
}
