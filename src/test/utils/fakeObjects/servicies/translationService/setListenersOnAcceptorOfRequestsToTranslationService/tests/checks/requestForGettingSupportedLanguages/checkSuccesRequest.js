"use strict";

import { equal as expectEqual } from "assert/strict";

import checkSendingRequest from "../utils/checkSendingRequest.js";
import requestGettingSupportedLanguagesWithApiKey from "./_requestGettingSupportedLanguagesWithApiKey.js";


const checkSuccesRequest = (fullUrlToMethod, validApiKey, fakeTranslator) => {
  return checkSendingRequest(
    requestGettingSupportedLanguagesWithApiKey.bind(null, fullUrlToMethod, validApiKey),
    checkBodyOfResponse.bind(null, fakeTranslator.getSupportedLanguages())
  );
};

const checkBodyOfResponse = (expectedUnsortedLanguages, body) => {
  let i = expectedUnsortedLanguages.length;
  const receivedLanguages = body.languages;
  expectEqual(i, receivedLanguages.length);

  sortLanguagesByCode(expectedUnsortedLanguages);
  const expectedLanguages = expectedUnsortedLanguages;

  let expectedLanguage;
  let receivedLanguage;
  for (; i; ) {
    i -= 1;
    expectedLanguage = expectedLanguages[i];
    receivedLanguage = receivedLanguages[i];
    expectThatLanguagesAreEqual(expectedLanguage, receivedLanguage);
  }
};

const sortLanguagesByCode = (languages) => languages.sort(compareLanguagesByCode);
const compareLanguagesByCode = (a, b) => a.code.localeCompare(b.code);

const expectThatLanguagesAreEqual = (a, b) => {
  expectEqual(a.code, b.code);
  expectEqual(a.name, b.name);
};

export default checkSuccesRequest;
