import { selectGamesForReport, reportScopeLabel } from './report-selection.js';
import { buildOpponentModel } from '../ui/opponent-model.js';
import { buildTeamHistory } from '../data/team-history.js';

export function buildReportContext(games=[],{teamId,opponentId,seasonId,teamName,opponentName,seasonName,limit=10}={}){const selected=selectGamesForReport(games,{teamId,opponentId,seasonId,limit});return {scope:reportScopeLabel({teamName,opponentName,seasonName,gameCount:selected.length}),games:selected,team:teamId?buildTeamHistory(selected,teamId):null,opponent:opponentId?buildOpponentModel(selected,opponentId):null,generatedAt:new Date().toISOString()}}
