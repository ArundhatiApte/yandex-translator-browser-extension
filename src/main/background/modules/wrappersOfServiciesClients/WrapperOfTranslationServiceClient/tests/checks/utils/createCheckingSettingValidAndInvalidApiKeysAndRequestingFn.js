"use strict";

import { equal as expectEqual, deepEqual as expectDeepEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";
import emptyApiKey from "../../../../../../../common/js/data/emptyApiKey.js"
import statusesOfWrapperResponse from "../../../statusesOfResponse.js";
import createDefaultOptionsForContructor from "./createDefaultOptionsForContructor.js";


const createCheckingSettingValidAndInvalidApiKeysAndRequestingFn = createCurringFnFactory(
  async function checkSettingApiKeyAndRequesting(
    validApiKey,
    invalidApiKey,
    clientOfTranslationService,
    sendRequest,
    expectedResult,
    createWrapperOfTranslationServiceClient
  ) {
    const options = createDefaultOptionsForContructor();
    options.translationService.apiKey = emptyApiKey;
    options.createClientOfTranslationService = () => clientOfTranslationService;

    const wrapper = createWrapperOfTranslationServiceClient(options);
    await checkRequestingWithValidApiKey(wrapper, validApiKey, sendRequest, expectedResult);
    await checkRequestingWithInvalidApiKey(wrapper, invalidApiKey, sendRequest);
  }
);

const checkRequestingWithValidApiKey = async (wrapper, validApiKey, sendRequest, expectedResult) => {
  wrapper.setApiKey(validApiKey);
  const response = await sendRequest(wrapper);
  expectEqual(statusesOfWrapperResponse_ok, response.s);
  expectDeepEqual(expectedResult, response.r);
};

const statusesOfWrapperResponse_ok = statusesOfWrapperResponse.ok;

const checkRequestingWithInvalidApiKey = async (wrapper, invalidApiKey, sendRequest) => {
  wrapper.setApiKey(invalidApiKey);
  const response = await sendRequest(wrapper);
  expectEqual(statusesOfWrapperResponse_invalidApiKey, response.s);
};

const statusesOfWrapperResponse_invalidApiKey = statusesOfWrapperResponse.invalidApiKey;

export default createCheckingSettingValidAndInvalidApiKeysAndRequestingFn;
