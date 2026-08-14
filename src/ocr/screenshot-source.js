export function makeScreenshotSource(file,fixtureId,data){return{id:crypto.randomUUID(),fixtureId,filename:file.name,mimeType:file.type||'image/jpeg',size:file.size,data,uploadedAt:new Date().toISOString(),source:'swish',status:'pending'}}
export function sortScreenshotSources(items=[]){return [...items].sort((a,b)=>new Date(a.uploadedAt||0)-new Date(b.uploadedAt||0))}
