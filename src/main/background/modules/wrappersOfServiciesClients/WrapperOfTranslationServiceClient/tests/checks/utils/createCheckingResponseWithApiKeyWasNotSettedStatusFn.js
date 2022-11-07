"use strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";
import emptyApiKey from "../../../../../../../common/js/data/emptyApiKey.js"
import statusesOfWrapperResponse from "../../../statusesOfResponse.js";
import createDefaultOptionsForContructor from "./createDefaultOptionsForContructor.js";
import checkReceivingResponseOnlyWithStatus from "./checkReceivingResponseOnlyWithStatus.js";


const createCheckingResponseWithApiKeyWasNotSettedStatusFn = createCurringFnFactory(
  async function checkResponseWithApiKeyWasNotSettedStatus(performRequest, createWrapperOfTranslationServiceClient) {
    const wrapper = createWrapperOfTranslationServiceClient(createDefaultOptionsForContructor());
    await checkReceivingResponseOnlyWithStatus(wrapper, performRequest, expectedStatus);
    wrapper.setApiKey(emptyApiKey);
    await checkReceivingResponseOnlyWithStatus(wrapper, performRequest, expectedStatus);
  }
);

const expectedStatus = statusesOfWrapperResponse.apiKeyWasNotSetted;

export default createCheckingResponseWithApiKeyWasNotSettedStatusFn;
