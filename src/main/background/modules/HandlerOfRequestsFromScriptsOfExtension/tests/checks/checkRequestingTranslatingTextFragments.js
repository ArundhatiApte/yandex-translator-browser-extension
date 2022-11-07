"use strict";

import { deepEqual as expectDeepEqual, ok as expectTrue } from "assert/strict";

import statusesOfResponse from
  "../../../wrappersOfServiciesClients/WrapperOfTranslationServiceClient/statusesOfResponse.js";
import createConnectionFromSettingsPage from
  "../../../../../settingsPage/js/utils/createConnectionToBackgroundScript.js";
import createConnectionFromTranslatingPageScript from
  "../../../../../contentScripts/translatingPageScript/utils/createConnectionToBackgroundScript.js";


const checkRequestingTranslatingTextFragments = async (
  senderOfMessagesToBackgroundScript,
  validApiKey,
  fakeTranslator
) => {
  await setApiKeyForTranslationService(senderOfMessagesToBackgroundScript, validApiKey);
  await checkRequest(senderOfMessagesToBackgroundScript, fakeTranslator);
};

const setApiKeyForTranslationService = (senderOfMessagesToBackgroundScript, apiKey) => {
  const connection = createConnectionFromSettingsPage(senderOfMessagesToBackgroundScript);
  return connection.requestUpdatingSettings({ apiKeyForTs: apiKey });
};

const checkRequest = async (senderOfMessagesToBackgroundScript, fakeTranslator) => {
  const languages = fakeTranslator.getSupportedLanguages();
  expectTrue(languages.length >= 2);

  const codeOfSourceLanguage = languages[0].code;
  const codeOfTargetLanguage = languages[0].code;
  const sourceTextFragments = ["banana", "qiwi", "apple", "mango"];
  const [, expectedTranslatedTextFragment] = fakeTranslator.translateTextFragments(
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    sourceTextFragments
  );

  const connection = createConnectionFromTranslatingPageScript(senderOfMessagesToBackgroundScript);
  const result = await connection.requestTranslationOfTextFragments(
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    sourceTextFragments
  );
  expectDeepEqual({ s: statusesOfResponse.ok, r: expectedTranslatedTextFragment }, result);
};

export default checkRequestingTranslatingTextFragments;
