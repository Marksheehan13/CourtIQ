import { createWorker } from 'tesseract.js';

const FIXTURE_KEY = 'courtiq-fixtures-v4';
const SHOT_KEY = 'courtiq-shots-v4';

const seed = [
  {id:'1',date:'2026-09-12',home:"St Paul's",away:'Malahide',venue:'TBC',status:'upcoming'},
  {id:'2',date:'2026-09-19',home:'UCC',away:"St Paul's",venue:'Mardyke Arena',status:'upcoming'},
  {id:'3',date:'2026-08-29',home:"St Paul's",away:'Fr Mathews',venue:'TBC',status:'final',score:'78–71',quarters:['19–16','21–18','17–20','21–17']}
];
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}};
const state={fixtures:load(FIXTURE_KEY,seed),shots:load(SHOT_KEY,{})};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{localStorage.setItem(FIXTURE_KEY,JSON.stringify(state.fixtures));localStorage.setItem(SHOT_KEY,JSON.stringify(state.shots))};
const id=()=>crypto.randomUUID();
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-IE',{day:'2-digit',month:'short',year:'numeric'});
const initials=s=>String(s).split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
const fixture=x=>state.fixtures.find(f=>f.id===x);

function app(){return `<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">CQ</div><div><strong>CourtIQ</strong><span>Basketball Intelligence</span></div></div><nav>${['overview','fixtures','scouting','teams','players','reports'].map(v=>`<button class="nav-item" data-nav="${v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</nav><div class="sidebar-footer"><span class="status-dot"></span> Season 2026/27</div></aside><main class="main"><header class="topbar"><div><p class="eyebrow">ST PAUL'S · NATIONAL LEAGUE</p><h1 id="title">Overview</h1></div><button class="primary" id="add">+ New fixture</button></header><section id="content"></section></main></div>`}

document.body.innerHTML=app();
const content=document.querySelector('#content');
const title=document.querySelector('#title');

function render(view='overview'){
 title.textContent={overview:'Overview',fixtures:'Fixtures',scouting:'Scouting',teams:'Teams',players:'Players',reports:'Reports'}[view];
 document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===view));
 content.innerHTML=({overview,fixtures,scouting,teams,players,reports}[view])();
 bind(view);
}
function overview(){const upcoming=state.fixtures.filter(f=>f.status==='upcoming').sort((a,b)=>a.date.localeCompare(b.date));const shots=Object.values(state.shots).reduce((n,a)=>n+a.length,0);return `<div class="grid stats"><div class="card"><div class="metric-label">Next game</div><div class="metric small-metric">${upcoming[0]?fmt(upcoming[0].date):'—'}</div><div>${upcoming[0]?esc(upcoming[0].home)+' vs '+esc(upcoming[0].away):'No fixture'}</div></div><div class="card"><div class="metric-label">Fixtures</div><div class="metric">${state.fixtures.length}</div><div>${upcoming.length} upcoming</div></div><div class="card"><div class="metric-label">Games with data</div><div class="metric">${state.fixtures.filter(f=>f.score).length}</div><div>Verified manually</div></div><div class="card"><div class="metric-label">Screenshots</div><div class="metric">${shots}</div><div>Fixture-scoped evidence</div></div></div><div class="section-head"><div><h2>Upcoming fixtures</h2><span class="section-sub">Select a game to open its independent scouting workspace.</span></div></div><div class="card list-card">${upcoming.map(row).join('')||'<div class="empty">No upcoming fixtures.</div>'}</div>`}
function row(f){return `<button class="fixture fixture-button" data-game="${f.id}"><div class="teams"><div class="team-badge">${initials(f.home)}</div><div><div class="date">${fmt(f.date)} · ${esc(f.venue||'TBC')}</div><div class="opponent">${esc(f.home)} <span class="versus">vs</span> ${esc(f.away)}</div></div></div><span class="badge ${f.score?'done':'scout'}">${f.score?'Data available':'To scout'}</span><span class="chevron">›</span></button>`}
function fixtures(){return `<div class="card"><div class="section-head flush"><div><h2>Season fixtures</h2><span class="section-sub">Every game is an independent record.</span></div><button class="primary" id="add2">+ Add fixture</button></div>${[...state.fixtures].sort((a,b)=>a.date.localeCompare(b.date)).map(row).join('')}</div>`}
function game(idv){const f=fixture(idv);if(!f)return '<div class="empty">Fixture not found.</div>';const shots=state.shots[f.id]||[];return `<div class="back-row"><button class="link" data-navback="fixtures">← Fixtures</button><span class="badge ${f.score?'done':'scout'}">${f.score?'Verified data':'Scouting'}</span></div><div class="game-hero card"><div><div class="eyebrow">${fmt(f.date)} · ${esc(f.venue||'TBC')}</div><h2>${esc(f.home)} <span>vs</span> ${esc(f.away)}</h2><div class="game-status">${f.score?'Final · '+esc(f.score):'No verified statistics yet'}</div></div><div class="game-actions"><button class="secondary" id="edit">Edit</button><button class="primary" id="upload">Upload screenshots</button></div></div><div class="grid two"><div class="card"><div class="section-head flush"><h2>Source evidence</h2><span class="badge">${shots.length} images</span></div>${shots.length?`<div class="screenshot-grid">${shots.map((s,i)=>`<div class="shot-card"><img src="${s.data}" alt="${esc(s.name)}"><div><b>${esc(s.name)}</b><span>${s.ocr?'OCR complete':'Not processed'}</span></div><div class="game-actions"><button class="secondary" data-ocr="${i}">${s.ocr?'Re-run OCR':'Run OCR'}</button><button class="link danger" data-remove="${i}">Remove</button></div></div>`).join('')}</div>`:'<div class="empty"><strong>No screenshots yet</strong><span>Upload every relevant SWISH screen for this fixture.</span></div>'}</div><div class="card"><div class="section-head flush"><h2>Verification</h2><span class="badge">Human review</span></div>${shots.filter(s=>s.ocr).length?shots.filter(s=>s.ocr).map(s=>`<div class="insight"><b>${esc(s.name)}</b><span>OCR confidence: ${s.ocrConfidence ?? '—'}%. Review before treating any value as canonical.</span><textarea class="ocr" data-ocrtext="${shots.indexOf(s)}">${esc(s.ocr)}</textarea><button class="primary" data-saveocr="${shots.indexOf(s)}">Save review</button></div>`).join(''):'<div class="empty compact">Run OCR on an uploaded screenshot to begin verification.</div>'}</div></div><div class="card" style="margin-top:16px"><div class="section-head flush"><h2>Game record</h2><span class="badge">Fixture isolated</span></div><div class="form-grid"><div class="field"><label>Final score</label><input id="score" value="${esc(f.score||'')}" placeholder="78–71"></div><div class="field"><label>Quarter scores</label><input id="quarters" value="${esc((f.quarters||[]).join(', '))}" placeholder="19–16, 21–18, 17–20, 21–17"></div></div><div class="modal-actions"><button class="primary" id="savegame">Save verified game data</button></div></div>`}
function scouting(){return `<div class="grid three"><div class="card"><div class="metric-label">Fixtures</div><div class="metric">${state.fixtures.length}</div></div><div class="card"><div class="metric-label">Screenshots</div><div class="metric">${Object.values(state.shots).reduce((n,a)=>n+a.length,0)}</div></div><div class="card"><div class="metric-label">Verified games</div><div class="metric">${state.fixtures.filter(f=>f.score).length}</div></div></div><div class="section-head"><div><h2>Scouting workflow</h2><span class="section-sub">Select a fixture → upload → OCR → review → verify.</span></div></div><div class="card workflow-list">${['Select an individual fixture','Upload all relevant SWISH screenshots','Run OCR and inspect extracted text','Correct and save verified game values','Use verified history for analysis and reports'].map((x,i)=>`<div class="insight"><b>${String(i+1).padStart(2,'0')} · ${x}</b><span>Nothing from another fixture is mixed into this workspace.</span></div>`).join('')}</div>`}
function teams(){const teams=[...new Set(state.fixtures.flatMap(f=>[f.home,f.away]))];return `<div class="card"><h2>Teams</h2><table class="table"><thead><tr><th>Team</th><th>Fixtures</th><th>Verified</th></tr></thead><tbody>${teams.map(t=>{const fs=state.fixtures.filter(f=>f.home===t||f.away===t);return `<tr><td><b>${esc(t)}</b></td><td>${fs.length}</td><td>${fs.filter(f=>f.score).length}</td></tr>`}).join('')}</tbody></table></div>`}
function players(){return `<div class="card"><div class="empty"><strong>Player intelligence comes after verified player-stat screens.</strong><span>Upload a SWISH box score, OCR it, and review the extracted values first.</span></div></div>`}
function reports(){return `<div class="grid two"><div class="card report-card"><div class="report-icon">OS</div><div class="metric report-title">Opponent scouting</div><p>Build this from verified historical fixtures rather than guesses.</p><button class="secondary" disabled>Requires verified game history</button></div><div class="card report-card"><div class="report-icon">GR</div><div class="metric report-title">Game report</div><p>Generate a report from a selected verified fixture.</p><button class="secondary" disabled>Requires verified game data</button></div></div>`}

async function runOCR(f,i){
 const s=state.shots[f.id]?.[i]; if(!s)return;
 const btn=document.querySelector(`[data-ocr="${i}"]`);
 if(btn){btn.disabled=true;btn.textContent='Loading OCR…'}
 let worker;
 try{
   worker=await createWorker('eng');
   if(btn)btn.textContent='OCR running…';
   const result=await worker.recognize(s.data);
   s.ocr=result.data.text.trim();
   s.ocrConfidence=Math.round(result.data.confidence);
   s.status='ocr-complete';
   save();
   openGame(f.id);
 }catch(e){
   console.error('CourtIQ OCR error',e);
   alert(`OCR failed: ${e?.message || e}. Please retry the image.`);
   if(btn){btn.disabled=false;btn.textContent='Run OCR'}
 }finally{if(worker)await worker.terminate().catch(()=>{})}
}
function upload(f){const input=document.createElement('input');input.type='file';input.accept='image/*';input.multiple=true;input.onchange=async()=>{const arr=state.shots[f.id]??=[];for(const file of input.files){const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});arr.push({name:file.name,type:file.type,size:file.size,data,status:'unreviewed',addedAt:new Date().toISOString()})}state.shots[f.id]=arr;save();openGame(f.id)};input.click()}
function edit(f){const home=prompt('Home team',f.home);if(home===null)return;const away=prompt('Away team',f.away);if(away===null)return;const date=prompt('Date (YYYY-MM-DD)',f.date);if(date===null)return;const venue=prompt('Venue',f.venue||'');if(venue===null)return;Object.assign(f,{home,away,date,venue});save();openGame(f.id)}
function addFixture(){const home=prompt('Home team',"St Paul's");if(!home)return;const away=prompt('Away team','Opponent');if(!away)return;const date=prompt('Date (YYYY-MM-DD)','2026-09-12');if(!date)return;const venue=prompt('Venue','TBC');if(venue===null)return;const f={id:id(),home,away,date,venue,status:'upcoming'};state.fixtures.push(f);save();openGame(f.id)}
function bind(view){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>render(b.dataset.nav));document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game));document.querySelectorAll('[data-navback]').forEach(b=>b.onclick=()=>render(b.dataset.navback));document.querySelector('#add')?.addEventListener('click',addFixture);document.querySelector('#add2')?.addEventListener('click',addFixture)}
function openGame(idv){title.textContent='Game';document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));content.innerHTML=game(idv);const f=fixture(idv);document.querySelector('#upload')?.addEventListener('click',()=>upload(f));document.querySelector('#edit')?.addEventListener('click',()=>edit(f));document.querySelector('#savegame')?.addEventListener('click',()=>{f.score=document.querySelector('#score').value.trim()||undefined;f.quarters=document.querySelector('#quarters').value.split(',').map(x=>x.trim()).filter(Boolean);f.status='final';save();openGame(f.id)});document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.shots[f.id].splice(Number(b.dataset.remove),1);save();openGame(f.id)});document.querySelectorAll('[data-ocr]').forEach(b=>b.onclick=()=>runOCR(f,Number(b.dataset.ocr)));document.querySelectorAll('[data-saveocr]').forEach(b=>b.onclick=()=>{state.shots[f.id][Number(b.dataset.saveocr)].ocr=document.querySelector(`[data-ocrtext="${b.dataset.saveocr}"]`).value;state.shots[f.id][Number(b.dataset.saveocr)].status='reviewed';save();openGame(f.id)});document.querySelectorAll('[data-navback]').forEach(b=>b.onclick=()=>render('fixtures'))}

document.querySelector('#add').onclick=addFixture;
render('overview');
