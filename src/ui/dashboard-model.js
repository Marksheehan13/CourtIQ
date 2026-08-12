import { getAppData } from '../data/app-store.js';
import { stageLabel } from '../data/fixture-status.js';

export function buildDashboardModel(){
 const {fixtures=[],screenshots=[]}=getAppData();
 const counts={total:fixtures.length,verified:0,inProgress:0,reported:0};
 const rows=fixtures.map(f=>{const shots=screenshots.filter(s=>String(s.fixtureId)===String(f.id));if(f.status==='verified')counts.verified++;if(!['verified','reported'].includes(f.status))counts.inProgress++;if(f.status==='reported')counts.reported++;return {...f,stageLabel:stageLabel(f.status),screenshotCount:shots.length};}).sort((a,b)=>new Date(a.date)-new Date(b.date));
 return {counts,fixtures:rows};
}

export function filterFixtures(fixtures=[],query='',status='all'){
 const q=query.trim().toLowerCase();return fixtures.filter(f=>(status==='all'||f.status===status)&&(!q||`${f.home} ${f.away} ${f.venue}`.toLowerCase().includes(q)));
}
