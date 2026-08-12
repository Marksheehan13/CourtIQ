export function generateScoutingInsights({opponent, games=[]}) {
  if (!games.length) return {opponent,confidence:'insufficient',insights:[],message:'Not enough verified games.'};
  const mean=k=>{const v=games.map(g=>Number(g[k])).filter(Number.isFinite);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null};
  const insights=[];
  const pts=mean('points'); if(pts!=null) insights.push({type:'offence',label:'Scoring profile',value:`${pts.toFixed(1)} points per game`,evidence:`${games.length} verified game${games.length===1?'':'s'}`});
  const reb=mean('rebounds'); if(reb!=null) insights.push({type:'rebounding',label:'Rebounding profile',value:`${reb.toFixed(1)} rebounds per game`,evidence:`${games.length} verified game${games.length===1?'':'s'}`});
  const to=mean('turnovers'); if(to!=null) insights.push({type:'ball-security',label:'Turnover profile',value:`${to.toFixed(1)} turnovers per game`,evidence:`${games.length} verified game${games.length===1?'':'s'}`});
  return {opponent,confidence:games.length>=5?'high':games.length>=3?'medium':'low',insights};
}
