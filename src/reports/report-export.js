import { renderReportHtml } from './html-report.js';

export function openPrintableReport(data){
  const html=renderReportHtml(data);
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const w=window.open(url,'_blank','noopener,noreferrer');
  if(w) setTimeout(()=>{try{w.print()}catch{}},500);
  return url;
}

export function downloadReportHtml(data, filename='courtiq-report.html'){
  const html=renderReportHtml(data);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
