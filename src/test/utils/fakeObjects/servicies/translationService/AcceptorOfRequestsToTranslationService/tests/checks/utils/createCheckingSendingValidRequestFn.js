"use strict";

import { ok as expectTrue, deepEqual as expectDeepEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../../createCurringFnFactory.js";


const createCheckingSendingValidRequestFn = createCurringFnFactory(
  async function checkSendingRequest(
    setSendingResponseListener,
    expectedBodyOfResponse,
    sendRequest,
    url,
    acceptorOfRequestsToTranslationService
  ) {
    setSendingResponseListener(acceptorOfRequestsToTranslationService);
    const response = await sendRequest(url);
    expectTrue(response.ok);
    const body = await response.json();
    expectDeepEqual(expectedBodyOfResponse, body);
  }
);

export default createCheckingSendingValidRequestFn;
