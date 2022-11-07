"use strict";

import createCheckingReceivingResponseWithUnknownStatusAndMessageFn from
  "../utils/createCheckingReceivingResponseWithUnknownStatusAndMessageFn.js";
import requestTranslatingTextFragments from "./_requestTranslatingTextFragments.js";


const checkReceivingResponseWithUnknowStatusAndMessage = createCheckingReceivingResponseWithUnknownStatusAndMessageFn(
  requestTranslatingTextFragments,
  (httpServerOfTranslationService, apiKey, errorMessage) => {
    return httpServerOfTranslationService.setRequestForTranslatingTextFragmentsListener(
      (request, receivedApiKey, dataAboutText, senderOfResponse) => {
        if (receivedApiKey === apiKey) {
          const httpCode = "501";
          const status = 44;
          senderOfResponse.sendError(httpCode, status, errorMessage);
        }
      }
    );
  }
);

export default checkReceivingResponseWithUnknowStatusAndMessage;
