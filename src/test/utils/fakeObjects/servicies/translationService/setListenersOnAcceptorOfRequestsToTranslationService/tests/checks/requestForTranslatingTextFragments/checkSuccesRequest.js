"use strict";

import { equal as expectEqual, ok as expectTrue } from "assert/strict";

import { statusesOfTranslation } from "../../../../FakeUpperCasingTranslator/index.js";
import checkSendingRequest from "../utils/checkSendingRequest.js";
import requestTranslatingTextFragments from "./_requestTranslatingTextFragmentsWithApiKey.js";


const checkSuccesRequest = (fullUrlToMethod, validApiKey, fakeTranslator) => {
  const supportedLanguages = fakeTranslator.getSupportedLanguages();
  expectTrue(supportedLanguages.length >= 2);

  const codeOfSourceLanguage = supportedLanguages[0].code;
  const codeOfTargetLanguage = supportedLanguages[1].code;
  const textFragments = ["check", "translating", "text", "fragments"];
  const [status, expectedTranslatedTextFragments] = fakeTranslator.translateTextFragments(
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    textFragments
  );
  expectEqual(statusesOfTranslation.ok, status);

  const sendRequest = requestTranslatingTextFragments.bind(
    null,
    fullUrlToMethod,
    validApiKey,
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    textFragments
  );
  return checkSendingRequest(sendRequest, checkBodyOfResponse.bind(null, expectedTranslatedTextFragments));
};

const checkBodyOfResponse = (expectedTranslatedTextFragments, bodyFromJson) => {
  const translations = bodyFromJson.translations;
  let i = expectedTranslatedTextFragments.length;
  expectEqual(i, translations.length);

  let translatedTextFragment;
  let translation;

  for (; i; ) {
    i -= 1;
    translatedTextFragment = expectedTranslatedTextFragments[i];
    translation = translations[i];
    expectEqual(translatedTextFragment, translation.text);
  }
};

export default checkSuccesRequest;
