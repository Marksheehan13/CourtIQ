const KEY='courtiq-app-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"fixtures":[],"screenshots":[]}')}catch{return {fixtures:[],screenshots:[]}}};
const write=d=>{localStorage.setItem(KEY,JSON.stringify(d));return d};
export function getAppData(){return read()}
export function saveFixture(fixture){const d=read();const i=d.fixtures.findIndex(x=>String(x.id)===String(fixture.id));const value={...fixture,id:fixture.id||`fixture-${Date.now()}`,updatedAt:new Date().toISOString()};if(i<0)d.fixtures.push(value);else d.fixtures[i]=value;write(d);return value}
export function addScreenshot(fixtureId,screenshot){const d=read();const item={...screenshot,id:screenshot.id||`shot-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,fixtureId,createdAt:new Date().toISOString()};d.screenshots.push(item);write(d);return item}
export function getScreenshots(fixtureId){return read().screenshots.filter(x=>String(x.fixtureId)===String(fixtureId))}
