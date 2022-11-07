"use strict";

import { statusesOfResponse } from "../../../index.js";
import createCheckingReceivingResponseWithErrorStatusFn from
  "../utils/createCheckingReceivingResponseWithErrorStatusFn.js";
import requestTranslatingTextFragments from "./_requestTranslatingTextFragments.js";


const httpCode = "401";
const errorStatus = 16;
const errorMessage = "Unknown api key";

const checkReceivingResponseWithErrorStatus = createCheckingReceivingResponseWithErrorStatusFn(
  requestTranslatingTextFragments,
  function setSendingResponseWithErrorListener(httpServerOfTranslationService, clientsApiKey) {
    return httpServerOfTranslationService.setRequestForTranslatingTextFragmentsListener(
      (request, apiKey, dataAboutText, senderOfResponse) => {
        if (apiKey === clientsApiKey) {
          senderOfResponse.sendError(httpCode, errorStatus, errorMessage);
        }
      }
    );
  },
  statusesOfResponse.invalidApiKey
);

export default checkReceivingResponseWithErrorStatus;
