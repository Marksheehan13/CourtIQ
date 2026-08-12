import { validatePlayerStatRow, validateTeamStats } from './validation.js';
import { gameComplete } from './game-model-v1.js';
export function verifyGame(game){const issues=[];if(!gameComplete(game))issues.push('Game is incomplete');for(const t of game.teamStats||[]){const r=validateTeamStats(t);issues.push(...r.errors)}for(const p of game.playerStats||[]){const r=validatePlayerStatRow(p);issues.push(...r.errors)}const status=issues.length?'needs-review':'verified';return {...game,status,verification:{status,issues,verifiedAt:status==='verified'?new Date().toISOString():null}}}
