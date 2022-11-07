"use strict";

import createCheckingReceivingResponseWithUnknownStatusAndMessageFn from
  "../utils/createCheckingReceivingResponseWithUnknownStatusAndMessageFn.js";


const checkReceivingResponseWithUnknowStatusAndMessage = createCheckingReceivingResponseWithUnknownStatusAndMessageFn(
  (clientOfTranslationService) => clientOfTranslationService.requestGettingCodesOfSupportedLanguages(),

  (httpServerOfTranslationService, apiKey, errorMessage) => {
    return httpServerOfTranslationService.setRequestForGettingSupportedLanguagesListener(
      (request, receivedApiKey, senderOfResponse) => {
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
