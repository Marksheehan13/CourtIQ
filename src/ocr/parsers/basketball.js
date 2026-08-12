const aliases={pts:['pts','points','p'],reb:['reb','rebs','rebounds'],ast:['ast','asts','assists'],stl:['stl','steals'],blk:['blk','blocks'],to:['to','tos','turnovers'],pf:['pf','fouls'],fgm:['fgm'],fga:['fga'],tpm:['3pm','3ptm','3pm'],tpa:['3pa','3pta'],ftm:['ftm'],fta:['fta'],min:['min','mins','minutes']};
const keyFor=v=>{const x=String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');return Object.entries(aliases).find(([,a])=>a.includes(x))?.[0]||null};
export function parseStatHeader(header=[]){return header.map(keyFor)}
export function parsePlayerRow(row=[],headers=[]){const out={};headers.forEach((h,i)=>{if(!h)return;const raw=row[i];const n=Number(String(raw??'').replace(/[^0-9.-]/g,''));out[h]=Number.isFinite(n)?n:raw});return out}
export function parseRows(rows,headers){return rows.map(r=>parsePlayerRow(r,headers)).filter(r=>Object.keys(r).length)}
