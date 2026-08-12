import { saveReview, verifyReview } from './review-store.js';
import { validateBoxScore, confidenceBand } from '../analytics/validation.js';

export function createReviewModel({fixtureId,screenshotId,imageData,candidates={}}){
  return saveReview({
    fixtureId,screenshotId,imageData,status:'review',
    fields:Object.entries(candidates).map(([key,value])=>({key,value,originalValue:value,confidence:.5,band:confidenceBand(.5),corrected:false})),
    validation:validateBoxScore(candidates)
  });
}

export function updateReviewField(review,key,value,confidence=.99){
  const fields=(review.fields||[]).map(f=>f.key===key?{...f,value,corrected:value!==f.originalValue,confidence,band:confidenceBand(confidence)}:f);
  const corrected=Object.fromEntries(fields.map(f=>[f.key,typeof f.value==='string'&&/^\d+$/.test(f.value)?Number(f.value):f.value]));
  return saveReview({...review,fields,validation:validateBoxScore(corrected)});
}

export function verifyGameReview(review, verifiedBy='user'){
  if(review.validation?.valid===false) throw new Error('Fix validation errors before verifying');
  return verifyReview(review.id,verifiedBy);
}
