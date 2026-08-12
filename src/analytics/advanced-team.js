import { estimatePossessions, pointsPerPossession } from './possessions.js';
export function teamAdvancedStats(team={}){const poss=estimatePossessions(team);return {possessions:poss,fgPct=team.fga?Number(team.fgm)/Number(team.fga):null,threePct:team.tpa?Number(team.tpm)/Number(team.tpa):null,ftPct:team.fta?Number(team.ftm)/Number(team.fta):null,ppp:pointsPerPossession(team.pts,poss)}}
