const KEY='courtiq-ocr-reviews-v1';

function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function write(data){localStorage.setItem(KEY,JSON.stringify(data));return data}

export function saveReview(review){
  const data=read();
  const id=review.id||`review-${Date.now()}`;
  data[id]={...review,id,updatedAt:new Date().toISOString()};
  return write(data)[id];
}

export function getReviewsForFixture(fixtureId){
  return Object.values(read()).filter(r=>String(r.fixtureId)===String(fixtureId));
}

export function getReview(id){return read()[id]||null}

export function verifyReview(id, verifiedBy='user'){
  const data=read();
  if(!data[id]) return null;
  data[id]={...data[id],status:'verified',verifiedBy,verifiedAt:new Date().toISOString()};
  write(data);return data[id];
}
