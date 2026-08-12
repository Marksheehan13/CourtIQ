export function buildTeamHistory(games=[],teamId){
 const rows=games.filter(g=>g.teams?.[teamId]).map(g=>({fixtureId:g.fixtureId,date:g.date,...g.teams[teamId]})).sort((a,b)=>new Date(b.date)-new Date(a.date));
 const avg=k=>{const v=rows.map(r=>Number(r[k])).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null};
 return {teamId,games:rows.length,recent:rows.slice(0,5),averages:{pts:avg('pts'),reb:avg('reb'),ast:avg('ast'),to:avg('to')}};
}

export function getHeadToHead(games=[],teamA,teamB){return games.filter(g=>{const ids=Object.keys(g.teams||{});return ids.includes(teamA)&&ids.includes(teamB)}).sort((a,b)=>new Date(b.date)-new Date(a.date));}
