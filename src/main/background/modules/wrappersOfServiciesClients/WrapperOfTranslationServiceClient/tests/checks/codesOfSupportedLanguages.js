"use strict";

import { statusesOfResponse as statusesOfClientResponse } from
  "../../../../clientsOfServicies/ClientOfTranslationService/index.js";

import createCheckingResponseWithApiKeyWasNotSettedStatusFn from
  "./utils/createCheckingResponseWithApiKeyWasNotSettedStatusFn.js";
import createCheckingSettingValidAndInvalidApiKeysAndRequestingFn from
  "./utils/createCheckingSettingValidAndInvalidApiKeysAndRequestingFn.js";
import createCheckingResponseWithUnknownStatusAndMessageFn from
  "./utils/createCheckingResponseWithUnknownStatusAndMessageFn.js";
import { createCheckingResponseWithNetworkErrorStatusFn, getResponseWithNetworkErrorStatus } from
  "./utils/createCheckingResponseWithNetworkErrorStatusFn.js";


const requestGettingCodesOfSupportedLanguages = (wrapper) => wrapper.requestGettingCodesOfSupportedLanguages();

export const checkApiKeyWasNotSettedStatus = createCheckingResponseWithApiKeyWasNotSettedStatusFn(
  requestGettingCodesOfSupportedLanguages
);

export const checkRequestsWithValidAndInvalidApiKey = (() => {
  const validApiKey = "valid";
  const invalidApiKey = "invalid";

  const clientOfTranslationService = {
    setApiKey(apiKey) {
      this._ = apiKey;
    },
    async requestGettingCodesOfSupportedLanguages() {
      if (this._ === validApiKey) {
        return { s: statusesOfClientResponse.ok, r: codesOfLanguages };
      }
      return { s: statusesOfClientResponse.invalidApiKey };
    }
  };

  const codesOfLanguages = ["aa", "cy", "en", "fr"];

  const checkRequestingGettingSupportedLanguages = createCheckingSettingValidAndInvalidApiKeysAndRequestingFn(
    validApiKey,
    invalidApiKey,
    clientOfTranslationService,
    requestGettingCodesOfSupportedLanguages,
    codesOfLanguages
  );
  return checkRequestsWithValidAndInvalidApiKey;
});

export const checkResponseWithUnknownStatusAndErrorMessage = createCheckingResponseWithUnknownStatusAndMessageFn(
  requestGettingCodesOfSupportedLanguages
);

export const checkResponseWithNetworkErrorStatus = createCheckingResponseWithNetworkErrorStatusFn(
  {
    requestGettingCodesOfSupportedLanguages: getResponseWithNetworkErrorStatus
  },
  requestGettingCodesOfSupportedLanguages
);
