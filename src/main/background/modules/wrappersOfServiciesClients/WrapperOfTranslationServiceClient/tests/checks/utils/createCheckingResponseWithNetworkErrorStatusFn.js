"use strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";
import { statusesOfResponse as statusesOfClientResponse } from
  "../../../../../clientsOfServicies/ClientOfTranslationService/index.js";
import statusesOfWrapperResponse from "../../../statusesOfResponse.js";
import createDefaultOptionsForContructor from "./createDefaultOptionsForContructor.js";
import checkReceivingResponseOnlyWithStatus from "./checkReceivingResponseOnlyWithStatus.js";


const createCheckingResponseWithNetworkErrorStatusFn = createCurringFnFactory(
  async function checkResponseWithNetworkErrorStatus(
    fakeClientOfTs,
    performRequest,
    createWrapperOfTranslationServiceClient
  ) {
    const options = createDefaultOptionsForContructor();
    options.createClientOfTranslationService = () => fakeClientOfTs;
    options.translationService.apiKey = "abcded";
    const wrapper = createWrapperOfTranslationServiceClient(options);
    await checkReceivingResponseOnlyWithStatus(wrapper, performRequest, expectedStatus);
  }
);

const expectedStatus = statusesOfWrapperResponse.networkError;

const getResponseWithNetworkErrorStatus = () => result;
const result = Object.freeze({ s: statusesOfClientResponse.networkError });

export { createCheckingResponseWithNetworkErrorStatusFn, getResponseWithNetworkErrorStatus };
