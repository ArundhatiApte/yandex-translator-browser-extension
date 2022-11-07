"use strict";

import { statusesOfResponse } from "../../../index.js";
import createCheckingReceivingResponseWithErrorStatusFn from
  "../utils/createCheckingReceivingResponseWithErrorStatusFn.js";


const httpCode = "401";
const errorStatus = 16;
const errorMessage = "Unknown key";

const checkNetworkError = createCheckingReceivingResponseWithErrorStatusFn(
  (clientOfTranslationService) => clientOfTranslationService.requestGettingCodesOfSupportedLanguages(),

  function setSendingResponseWithErrorListener(httpServerOfTranslationService, clientsApiKey) {
    return httpServerOfTranslationService.setRequestForGettingSupportedLanguagesListener(
      (request, apiKey, senderOfResponse) => {
        if (apiKey === clientsApiKey) {
          senderOfResponse.terminateConnection();
        }
      }
    );
  },
  statusesOfResponse.networkError
);

export default checkNetworkError;
