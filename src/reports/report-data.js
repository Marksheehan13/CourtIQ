import { shootingStats } from '../analytics/advanced-stats.js';
import { generateInsights } from '../analytics/insights.js';

export function buildGameReportData(fixture, verifiedData) {
  if (!verifiedData) return {ready:false, reason:'No verified game data'};
  const teams=verifiedData.teams||{};
  const teamStats=verifiedData.teamStats||Object.values(teams);
  return {ready:true,fixture:{id:fixture.id,date:fixture.date,home:fixture.home,away:fixture.away,venue:fixture.venue,score:fixture.score,quarters:fixture.q||verifiedData.quarters||[]},teamStats:teamStats.map(t=>({...t,shooting:shootingStats(t)})),playerStats:verifiedData.playerStats||[],sourceCount:verifiedData.sourceCount||0,verifiedAt:verifiedData.verifiedAt||null,insights:verifiedData.insights||[]};
}

export function buildOpponentReportData(opponent, fixtures = [], verifiedGames = []) {
  const games=verifiedGames.filter(g=>g.opponent===opponent).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const latest=games[0];const teams=latest?.teams||{};const values=Object.values(teams);const team=values[0]||{};const opp=values[1]||{};
  return {ready:games.length>0,opponent,sampleSize:games.length,recentGames:games.slice(0,5),insights:games.length>=3?generateInsights(team,opp,games.length):[],note:games.length?null:'Insufficient verified data for an opponent report.'};
}
