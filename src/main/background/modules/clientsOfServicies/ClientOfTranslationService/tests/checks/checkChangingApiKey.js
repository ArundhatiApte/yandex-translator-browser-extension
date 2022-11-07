"use strict";

import { deepEqual as expectDeepEqual } from "assert/strict";


const checkChangingApiKey = async (clientOfTranslationService, currentApiKey, httpServerOfTranslationService) => {
  const receivedApiKeys = [];
  const newKey = "newKey";
  const expectedApiKeys = [newKey, currentApiKey];

  httpServerOfTranslationService.setRequestForGettingSupportedLanguagesListener(
    (_, apiKey, senderOfResponse) => {
      receivedApiKeys.push(apiKey);
      senderOfResponse.terminateConnection();
    }
  );
  httpServerOfTranslationService.setRequestForTranslatingTextFragmentsListener(
    (_, apiKey, __, senderOfResponse) => {
      receivedApiKeys.push(apiKey);
      senderOfResponse.terminateConnection();
    }
  );

  clientOfTranslationService.setApiKey(newKey);
  // networkError
  await clientOfTranslationService.requestGettingCodesOfSupportedLanguages();

  clientOfTranslationService.setApiKey(currentApiKey);
  await clientOfTranslationService.requestTranslatingTextFragments("ab", "cd", ["ef"]);

  expectDeepEqual(expectedApiKeys, receivedApiKeys);
};

export default checkChangingApiKey;
