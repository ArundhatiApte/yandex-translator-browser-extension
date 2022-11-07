"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";


const createCheckingReceivingResponseWithErrorStatusFn = createCurringFnFactory(
  async function checkSendingRequestAndReceivingError(
    sendRequest,
    setSendingResponseWithErrorListener,
    statusOfError,
    clientOfTranslationService,
    apiKey,
    httpServerOfTranslationService
  ) {
    setSendingResponseWithErrorListener(httpServerOfTranslationService, apiKey);
    const response = await sendRequest(clientOfTranslationService);
    expectEqual(response.s, statusOfError);
  }
);

export default createCheckingReceivingResponseWithErrorStatusFn;
