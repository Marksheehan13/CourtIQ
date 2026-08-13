const KEY='courtiq:data:v2';
const seed={fixtures:[],screenshots:[],pdfs:[],extractions:[],verifications:[],reports:[]};
function clone(x){return JSON.parse(JSON.stringify(x))}
export function getAppData(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return clone(seed)}}
export function saveAppData(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
export function saveFixture(fixture){const d=getAppData();const i=d.fixtures.findIndex(x=>String(x.id)===String(fixture.id));if(i<0)d.fixtures.push(fixture);else d.fixtures[i]=fixture;saveAppData(d);return fixture}
export function createFixture(input={}){return saveFixture({id:crypto.randomUUID(),season:input.season||'2026-27',date:input.date||'',home:input.home||'',away:input.away||'',venue:input.venue||'',competition:input.competition||'Irish National League',score:null,q:[],status:'collecting',createdAt:new Date().toISOString()})}
export function saveAppDataSilently(data){return saveAppData(data)}
export function clearAppData(){localStorage.removeItem(KEY);return clone(seed)}
