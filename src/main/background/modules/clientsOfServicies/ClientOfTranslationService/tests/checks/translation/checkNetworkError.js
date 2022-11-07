"use strict";

import { statusesOfResponse } from "../../../index.js";
import createCheckingReceivingResponseWithErrorStatusFn from
  "../utils/createCheckingReceivingResponseWithErrorStatusFn.js";
import requestTranslatingTextFragments from "./_requestTranslatingTextFragments.js";


const checkNetworkError = createCheckingReceivingResponseWithErrorStatusFn(
  requestTranslatingTextFragments,
  function setSendingResponseWithErrorListener(httpServerOfTranslationService, clientsApiKey) {
    return httpServerOfTranslationService.setRequestForTranslatingTextFragmentsListener(
      (request, apiKey, dataAboutText, senderOfResponse) => {
        if (apiKey === clientsApiKey) {
          senderOfResponse.terminateConnection();
        }
      }
    );
  },
  statusesOfResponse.networkError
);

export default checkNetworkError;
