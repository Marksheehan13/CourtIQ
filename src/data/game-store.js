const KEY='courtiq-verified-games-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
const write=x=>{localStorage.setItem(KEY,JSON.stringify(x));return x};
export function saveVerifiedGame(game){if(!game?.fixtureId||game.status!=='verified')throw new Error('Only verified games can be saved');const all=read().filter(g=>String(g.fixtureId)!==String(game.fixtureId));all.push({...game,savedAt:new Date().toISOString()});return write(all)}
export function getVerifiedGames(){return read()}
export function getVerifiedGame(fixtureId){return read().find(g=>String(g.fixtureId)===String(fixtureId))||null}
export function deleteVerifiedGame(fixtureId){return write(read().filter(g=>String(g.fixtureId)!==String(fixtureId)))}
