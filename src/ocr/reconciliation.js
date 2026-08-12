export function reconcileRows(sources=[]){
  const grouped=new Map();
  for(const source of sources){for(const row of source.rows||[]){const key=String(row.playerId??row.number??row.name??'').trim().toLowerCase();if(!key)continue;if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(row)}}
  return [...grouped.entries()].map(([identity,rows])=>{
    const fields=new Set(rows.flatMap(r=>Object.keys(r)));
    const merged={identity,sourceCount:rows.length,conflicts:[]};
    for(const field of fields){if(field==='playerId'||field==='number'||field==='name')continue;const values=rows.map(r=>r[field]).filter(v=>v!==undefined&&v!==null&&v!=='');const unique=[...new Set(values.map(String))];if(unique.length===1)merged[field]=values[0];else if(unique.length>1){merged[field]=values[0];merged.conflicts.push({field,values:unique})}}
    merged.status=merged.conflicts.length?'needs-review':'reconciled';
    return merged;
  });
}

export function reconcileGameScreenshots(screenshots=[]){
  const sources=screenshots.map(s=>({id:s.id,rows:s.rows||[]}));
  const players=reconcileRows(sources);
  return {sourceCount:sources.length,players,conflictCount:players.reduce((n,p)=>n+p.conflicts.length,0),status:players.some(p=>p.status==='needs-review')?'needs-review':'ready-for-validation'};
}
