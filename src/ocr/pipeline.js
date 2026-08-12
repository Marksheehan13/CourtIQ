import { preprocessImage, createOcrRequest } from './local-adapter.js';
import { createReviewModel } from './review-ui.js';

export async function prepareScreenshotForOcr({fixtureId,screenshot}){
  const image=await preprocessImage(screenshot.data);
  return createOcrRequest({fixtureId,screenshotId:screenshot.id,image});
}

export async function createPendingReview({fixtureId,screenshot,candidates={}}){
  const request=await prepareScreenshotForOcr({fixtureId,screenshot});
  const review=createReviewModel({fixtureId,screenshotId:screenshot.id,imageData:request.image,candidates});
  return {request,review};
}
