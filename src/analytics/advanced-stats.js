const n=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;const pct=(a,b)=>b?100*a/b:null;
export function shootingStats(t={}){return {fgPct:pct(n(t.fgm),n(t.fga)),threePct:pct(n(t.tpm),n(t.tpa)),ftPct:pct(n(t.ftm),n(t.fta))}}
export function teamEfficiency(t={}){const pts=n(t.pts),reb=n(t.reb),ast=n(t.ast),stl=n(t.stl),blk=n(t.blk),to=n(t.to),fga=n(t.fga),fta=n(t.fta);return {efficiency:pts+reb+ast+stl+blk-to,possessions:fga+0.44*fta-to}}
export function playerEfficiency(p={}){return n(p.pts)+n(p.reb)+n(p.ast)+n(p.stl)+n(p.blk)-n(p.to)-Math.max(0,n(p.fga)-n(p.fgm))-Math.max(0,n(p.fta)-n(p.ftm))}
export function plusMinus(player,teamScore,opponentScore){if(player?.plusMinus!=null)return n(player.plusMinus);if(player?.teamScore!=null&&player?.opponentScore!=null)return n(player.teamScore)-n(player.opponentScore);return teamScore!=null&&opponentScore!=null?n(teamScore)-n(opponentScore):null}
