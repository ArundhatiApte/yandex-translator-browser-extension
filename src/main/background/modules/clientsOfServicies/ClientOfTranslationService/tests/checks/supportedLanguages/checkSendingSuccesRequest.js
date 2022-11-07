"use strict";

import checkResponseOnSucces from "./../utils/checkResponseOnSucces.js";


const checkSendingSuccesRequest = async (
  clientOfTranslationService,
  apiKey,
  httpServerOfTranslationService
) => {
  httpServerOfTranslationService.setRequestForGettingSupportedLanguagesListener(
    (request, apiKey, senderOfResponse) => {
      if (apiKey === sendedApiKey) {
        senderOfResponse.sendSupportedLanguages(JSON.stringify(sendedSupportedLanguages));
      }
      else {
        senderOfResponse.terminateConnection();
      }
    }
  );
  const sendedApiKey = apiKey;
  const sendedSupportedLanguages = createSendedSupportedLanguages();

  const response = await clientOfTranslationService.requestGettingCodesOfSupportedLanguages();
  const expectedSupportedLanguages = createExpectedReceivedSupportedLanguages(sendedSupportedLanguages);
  checkResponseOnSucces(response, expectedSupportedLanguages);
};

const createSendedSupportedLanguages = () => {
  const entry = (isoCode, nameInThatLanguage) =>
    ({ code: isoCode, name: nameInThatLanguage });

  return {
    languages: [
      entry("ff", "Fula"),
      entry("fi", "Finnish"),
      entry("fj", "Fijian"),
      entry("fo", "Faroese")
    ]
  };
};

const createExpectedReceivedSupportedLanguages = (sendedSupportedLanguages) =>
  sendedSupportedLanguages.languages.map((entry) => entry.code);

export default checkSendingSuccesRequest;
