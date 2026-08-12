export function buildOpponentInsights({opponent, games=[]}) {
  const verified = games.filter(g => g?.verification?.status === 'verified');
  if (!verified.length) return {opponent, sampleSize:0, sufficientData:false, insights:[]};

  const rows = verified.map(g => {
    const opponentStats = g.teamStats?.find(t => t.team === opponent) || {};
    const ownStats = g.teamStats?.find(t => t.team !== opponent) || {};
    return {
      date:g.date,
      score:g.score,
      points:opponentStats.pts ?? null,
      rebounds:opponentStats.reb ?? null,
      assists:opponentStats.ast ?? null,
      turnovers:opponentStats.to ?? null,
      ownPoints:ownStats.pts ?? null
    };
  });

  const average = key => {
    const values=rows.map(r=>r[key]).filter(v=>typeof v==='number');
    return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null;
  };

  const insights=[];
  const pts=average('points');
  const reb=average('rebounds');
  const ast=average('assists');
  const to=average('turnovers');
  if(pts!==null) insights.push({type:'offence',label:'Scoring output',value:pts,description:`${pts.toFixed(1)} points per verified game`});
  if(reb!==null) insights.push({type:'rebounding',label:'Rebounding',value:reb,description:`${reb.toFixed(1)} rebounds per verified game`});
  if(ast!==null) insights.push({type:'creation',label:'Ball movement',value:ast,description:`${ast.toFixed(1)} assists per verified game`});
  if(to!==null) insights.push({type:'turnovers',label:'Turnovers',value:to,description:`${to.toFixed(1)} turnovers per verified game`});

  return {opponent,sampleSize:verified.length,sufficientData:verified.length>=2,averages:{points:pts,rebounds:reb,assists:ast,turnovers:to},recentGames:rows.slice(0,5),insights};
}
