export function formatPct(v){return Number.isFinite(v)?`${(v*100).toFixed(1)}%`:'—'}
export function buildReportSections({fixture, teamStats=[], playerStats=[], opponentInsights=[]}) {
  const rows=teamStats.map(t=>({team:t.team,pts:t.pts,reb:t.reb,ast:t.ast,to:t.to,fg:formatPct(t.fgPct),three:formatPct(t.threePct),ft:formatPct(t.ftPct)}));
  const players=[...playerStats].sort((a,b)=>(b.pts||0)-(a.pts||0));
  return {header:{title:'CourtIQ Game Report',fixture:`${fixture.home} vs ${fixture.away}`,date:fixture.date,venue:fixture.venue||'TBC'},sections:{score:{score:fixture.score||'—',quarters:fixture.q||[]},teamComparison:rows,playerLeaders:players.slice(0,5),insights:opponentInsights}};
}

export function reportIsReady({fixture,verified=true,teamStats=[]}){
  return Boolean(fixture && verified && teamStats.length && fixture.score);
}
