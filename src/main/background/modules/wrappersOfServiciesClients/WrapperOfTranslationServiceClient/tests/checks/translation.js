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


const requestTranslatingTextFragments = (wrapper) =>
  wrapper.requestTranslatingTextFragments("zh", "cy", ["a", "bc"]);

export const checkApiKeyWasNotSettedStatus = createCheckingResponseWithApiKeyWasNotSettedStatusFn(
  requestTranslatingTextFragments
);

export const checkRequestsWithValidAndInvalidApiKey = (() => {
  const validApiKey = "valid";
  const invalidApiKey = "invalid";

  const clientOfTranslationService = {
    setApiKey(apiKey) {
      this._ = apiKey;
    },
    async requestTranslatingTextFragments(codeOfSourceLanguage, codeOfTargetLanguage, textFragments) {
      if (this._ === validApiKey) {
        if (
          codeOfSourceLanguage === sendedCodeOfSourceLanguage &&
          codeOfTargetLanguage === sendedCodeOfTargetLanguage &&
          // без глубокого сравнения
          textFragments === sendedTextFragments
        ) {
          return { s: statusesOfClientResponse.ok, r: translatedTextFragments};
        }
        throw new Error("Ожидался другой список параметров.");
      }
      return { s: statusesOfClientResponse.invalidApiKey };
    }
  };

  const sendedCodeOfSourceLanguage = "sl";
  const sendedCodeOfTargetLanguage = "tl";
  const sendedTextFragments = ["a", "bc", "def", "ghij"];
  const translatedTextFragments = ["A", "BC", "DEF", "GHIJ"];

  const checkRequestsWithValidAndInvalidApiKey = createCheckingSettingValidAndInvalidApiKeysAndRequestingFn(
    validApiKey,
    invalidApiKey,
    clientOfTranslationService,
    (wrapper) => wrapper.requestTranslatingTextFragments(
      sendedCodeOfSourceLanguage,
      sendedCodeOfTargetLanguage,
      sendedTextFragments
    ),
    translatedTextFragments
  );
  return checkRequestsWithValidAndInvalidApiKey;
})();

export const checkResponseWithUnknownStatusAndErrorMessage = createCheckingResponseWithUnknownStatusAndMessageFn(
  requestTranslatingTextFragments
);

export const checkResponseWithNetworkErrorStatus = createCheckingResponseWithNetworkErrorStatusFn(
  {
    requestTranslatingTextFragments: getResponseWithNetworkErrorStatus
  },
  requestGettingCodesOfSupportedLanguages
);
