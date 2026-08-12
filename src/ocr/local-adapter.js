export function preprocessImage(dataUrl,{maxWidth=1800,quality=.9}={}){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,maxWidth/img.width),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',quality))};img.onerror=reject;img.src=dataUrl})}

export function createOcrRequest({fixtureId,screenshotId,image}){return {provider:'pending',fixtureId,screenshotId,image,requiresReview:true,status:'unprocessed',createdAt:new Date().toISOString()}}

export function normaliseNumeric(value){if(value===null||value===undefined||value==='')return null;const n=Number(String(value).replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:null}
