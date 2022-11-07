"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";
import { statusesOfResponse } from "../../../index.js";


const createCheckingReceivingResponseWithUnknownStatusAndMessageFn = createCurringFnFactory(
  async function checkReceivingUnknownStatusAndMessage(
    sendRequest,
    setSendingResponseWithUnknownStatusAndMessageListener,
    clientOfTranslationService,
    apiKey,
    httpServerOfTranslationService
  ) {
    const errorMessage = "abbcefg";
    setSendingResponseWithUnknownStatusAndMessageListener(httpServerOfTranslationService, apiKey, errorMessage);
    const response = await sendRequest(clientOfTranslationService);
    expectEqual(response.s, statusesOfResponse_unknown);
    expectEqual(response.em, errorMessage);
  }
);

const statusesOfResponse_unknown = statusesOfResponse.unknown;

export default createCheckingReceivingResponseWithUnknownStatusAndMessageFn;

