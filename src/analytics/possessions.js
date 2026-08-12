export function estimatePossessions({fga=0,fta=0,oreb=0,to=0}={}){const v=Number(fga)+0.44*Number(fta)-Number(oreb)+Number(to);return Number.isFinite(v)?Math.max(0,v):null}
export function pace(team,opponent){const a=estimatePossessions(team),b=estimatePossessions(opponent);if(a==null||b==null)return null;return (a+b)/2}
export function pointsPerPossession(points,possessions){const p=Number(points),q=Number(possessions);return q>0?p/q:null}
