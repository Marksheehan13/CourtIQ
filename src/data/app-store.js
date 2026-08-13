const KEY='courtiq:data:v1';
const seed={fixtures:[],screenshots:[],extractions:[],verifications:[]};
function clone(x){return JSON.parse(JSON.stringify(x));}
export function getAppData(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return clone(seed)}}
export function saveAppData(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
export function saveFixture(fixture){const d=getAppData();const i=d.fixtures.findIndex(x=>String(x.id)===String(fixture.id));if(i<0)d.fixtures.push(fixture);else d.fixtures[i]=fixture;saveAppData(d);return fixture}
export function createFixture(input={}){const fixture={id:crypto.randomUUID(),season:input.season||new Date().getFullYear()+'-'+(new Date().getFullYear()+1),date:input.date||'',home:input.home||'',away:input.away||'',venue:input.venue||'',competition:input.competition||'Irish National League',score:input.score||null,q:input.q||[],status:'collecting',createdAt:new Date().toISOString()};return saveFixture(fixture)}
export function saveScreenshot(screenshot){const d=getAppData();d.screenshots.push(screenshot);saveAppData(d);return screenshot}
export function saveExtraction(extraction){const d=getAppData();d.extractions.push(extraction);saveAppData(d);return extraction}
export function saveVerification(v){const d=getAppData();d.verifications.push(v);saveAppData(d);return v}
export function clearAppData(){localStorage.removeItem(KEY);return clone(seed)}
