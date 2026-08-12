const KEY='courtiq-seasons-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=x=>{localStorage.setItem(KEY,JSON.stringify(x));return x};
export function saveSeason(season){if(!season?.id||!season?.name)throw new Error('Season requires id and name');const all=read().filter(x=>String(x.id)!==String(season.id));all.push({...season,updatedAt:new Date().toISOString()});return write(all)}
export function getSeasons(){return read()}
export function getSeason(id){return read().find(x=>String(x.id)===String(id))||null}
export function deleteSeason(id){return write(read().filter(x=>String(x.id)!==String(id)))}
export function seasonFixtureId(seasonId,fixtureId){return `${seasonId}::${fixtureId}`}
