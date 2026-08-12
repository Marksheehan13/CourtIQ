import { saveFixture, addScreenshot, getScreenshots } from '../data/app-store.js';

export function createFixture({home,away,date,venue=''}){return saveFixture({id:`fixture-${Date.now()}`,home,away,date,venue,status:'scouting'})}
export async function ingestImages(fixtureId,files){
 const out=[]; for(const file of files){const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});out.push(addScreenshot(fixtureId,{name:file.name,type:file.type,size:file.size,data,status:'unreviewed'}))} return out;
}
export function fixtureWorkspace(fixtureId){return {fixtureId,screenshots:getScreenshots(fixtureId),stages:['screenshots','ocr-review','verification','analytics','report']}}
