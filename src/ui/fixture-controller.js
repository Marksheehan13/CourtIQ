import {getAppData,saveAppData} from '../data/app-store.js';
import {fixtureWorkspaceHtml} from './fixture-workspace.js';
import {scanGame} from './workflow.js';
import {reportWorkspaceHtml} from './report-workspace.js';

export function mountFixtureWorkspace(root,fixture){
  const render=()=>{
    const data=getAppData();
    const screenshots=data.screenshots.filter(s=>String(s.fixtureId)===String(fixture.id));
    const pdfs=data.pdfs?.filter(p=>String(p.fixtureId)===String(fixture.id))||[];
    root.innerHTML=fixtureWorkspaceHtml(fixture,{screenshots,pdfs,scanning:false});
    const imageInput=root.querySelector('#fixture-images');
    const pdfInput=root.querySelector('#fixture-pdf');
    imageInput?.addEventListener('change',e=>{const files=[...e.target.files||[]];if(files.length){saveFiles(fixture.id,files);render()}});
    pdfInput?.addEventListener('change',e=>{const file=e.target.files?.[0];if(file){savePdf(fixture.id,file).then(render)}});
    root.querySelector('#scan-game')?.addEventListener('click',async()=>{
      const button=root.querySelector('#scan-game');button.disabled=true;button.textContent='Scanning game…';
      try{await scanGame(fixture.id);renderReport(root,fixture.id)}catch(err){console.error(err);alert(err.message||'Scan failed');button.disabled=false;button.textContent='Scan game'}
    });
    root.querySelector('#view-report')?.addEventListener('click',()=>renderReport(root,fixture.id));
  };
  render();
  return {refresh:render};
}

async function saveFiles(fixtureId,files){
  const d=getAppData();d.screenshots=d.screenshots||[];
  for(const file of files){d.screenshots.push({id:crypto.randomUUID(),fixtureId,filename:file.name,mimeType:file.type,size:file.size,data:await readFile(file),category:'unknown',uploadedAt:new Date().toISOString()})}
  saveAppData(d);
}
async function savePdf(fixtureId,file){const d=getAppData();d.pdfs=d.pdfs||[];d.pdfs.push({id:crypto.randomUUID(),fixtureId,filename:file.name,mimeType:file.type,size:file.size,data:await readFile(file),uploadedAt:new Date().toISOString()});saveAppData(d)}
function readFile(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
function renderReport(root,fixtureId){const d=getAppData();const fixture=d.fixtures.find(f=>String(f.id)===String(fixtureId));root.innerHTML=reportWorkspaceHtml(fixture,d);root.querySelector('#back-to-workspace')?.addEventListener('click',()=>mountFixtureWorkspace(root,fixture).refresh())}
