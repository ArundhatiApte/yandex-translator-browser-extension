"use strict";

import { equal as expectEqual } from "assert/strict";

import createCurringFnFactory from "../../../../../../../../test/utils/createCurringFnFactory.js";
import { statusesOfResponse as statusesOfClientResponse } from
  "../../../../../clientsOfServicies/ClientOfTranslationService/index.js";
import statusesOfWrapperResponse from "../../../statusesOfResponse.js";
import createDefaultOptionsForContructor from "./createDefaultOptionsForContructor.js";


const createCheckingResponseWithUnknownStatusAndMessageFn = createCurringFnFactory(
  async function checkResponseWithUnknownStatusAndMessage(performRequest, createWrapperOfTranslationServiceClient) {
    const errorMessage = "errorMessage";
    const options = createDefaultOptionsForContructor();
    options.createClientOfTranslationService = () => new FakeClientOfTranslationService(errorMessage);

    const wrapper = createWrapperOfTranslationServiceClient(options);
    wrapper.setApiKey("abcd");
    await checkReceivingUnknownStatusAndErrorMessage(wrapper, performRequest, errorMessage);
  }
);

const FakeClientOfTranslationService = class {
  constructor(errorMessage) {
    this._ = errorMessage;
  }

  setApiKey() {}
};

const Proto = FakeClientOfTranslationService.prototype;

Proto.requestGettingCodesOfSupportedLanguages =
Proto.requestTranslatingTextFragments = async function giveStaticResponse() {
  return {
    s: statusesOfClientResponse.unknown,
    em: this._
  }
};

const checkReceivingUnknownStatusAndErrorMessage = async (wrapper, performRequest, errorMessage) => {
  const response = await performRequest(wrapper);
  expectEqual(statusesOfWrapperResponse_unknown, response.s);
  expectEqual(errorMessage, response.em);
};

const statusesOfWrapperResponse_unknown = statusesOfWrapperResponse.unknown;

export default createCheckingResponseWithUnknownStatusAndMessageFn;
