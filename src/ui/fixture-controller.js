import { fixtureWorkspaceHtml } from './fixture-workspace.js';
import { getScreenshots, addScreenshot } from '../data/app-store.js';

export function mountFixtureWorkspace(root, fixture){
  const render=()=>{root.innerHTML=fixtureWorkspaceHtml(fixture,{screenshots:getScreenshots(fixture.id)});const input=root.querySelector('#fixture-files');if(input)input.addEventListener('change',async e=>{for(const file of e.target.files){if(!file.type.startsWith('image/'))continue;const data=await readFile(file);addScreenshot(fixture.id,{name:file.name,type:file.type,size:file.size,data,status:'unreviewed'})}render()});return root};
  return render();
}
function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}
