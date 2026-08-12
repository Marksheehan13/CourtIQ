export function buildPlayerHistory(games = [], playerId) {
  const rows = games.flatMap(g => (g.playerStats || []).filter(p => p.playerId === playerId).map(p => ({...p,date:g.date,fixtureId:g.fixtureId}))).sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (!rows.length) return {playerId,games:0,recent:[],averages:{}};
  const avg = key => { const v=rows.map(r=>Number(r[key])).filter(Number.isFinite); return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null; };
  return {playerId,games:rows.length,recent:rows.slice(0,5),averages:{pts:avg('pts'),reb:avg('reb'),ast:avg('ast'),stl:avg('stl'),blk:avg('blk'),min:avg('min'),to:avg('to')}};
}

export function compareRecentForm(games=[],playerId,window=5){
  const h=buildPlayerHistory(games,playerId); const recent=h.recent.slice(0,window); const previous=h.recent.slice(window,window*2);
  const mean=(rows,k)=>{const v=rows.map(r=>Number(r[k])).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null};
  return {recent:recent.map(r=>r.pts).filter(Number.isFinite),deltaPts:(mean(recent,'pts')??0)-(mean(previous,'pts')??0),sampleSize:recent.length};
}
