export const STAGES=['scouting','screenshots','ocr-review','verification','verified','reported'];
export function stageIndex(status){const i=STAGES.indexOf(status);return i<0?0:i}
export function nextStage(status){const i=stageIndex(status);return STAGES[Math.min(i+1,STAGES.length-1)]}
export function stageLabel(status){return ({scouting:'Scouting',screenshots:'Screenshots added','ocr-review':'OCR review','verification':'Verification','verified':'Verified','reported':'Report ready'})[status]||'Scouting'}
