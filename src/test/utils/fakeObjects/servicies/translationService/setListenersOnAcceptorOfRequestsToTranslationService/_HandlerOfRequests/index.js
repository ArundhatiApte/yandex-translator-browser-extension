"use strict";

import { statusesOfTranslation } from "../../FakeUpperCasingTranslator/index.js";
import { createArrayBufferWithUtf8FromString } from "../../../../../encodingDecodingStringInUtf8.js";
import isTotalLengthOfStringsMoreThanN from "./isTotalLengthOfStringsMoreThanN/index.js";


const HandlerOfRequests = class {
  constructor(fakeTranslator, validApiKeys, limitOfCharactersInTextForTranslation) {
    this[_fakeTranslator] = fakeTranslator;
    this[_validApiKeys] = new Set(validApiKeys);
    this[_limitOfCharactersInTextForTranslation] = limitOfCharactersInTextForTranslation;

    this[_cachedSupportedLanguages] = _createArrayBufferWithSupportedLangauges(
      fakeTranslator.getSupportedLanguages()
    );
  }

  onMalformedRequest(request, response) {
    return response.close();
  }

  onRequestForGettingSupportedLanguages(request, apiKey, senderOfResponse) {
    if (_isValidApiKey(this, apiKey)) {
      senderOfResponse.sendSupportedLanguages(this[_cachedSupportedLanguages]);
      return;
    }
    _sendResponseWithInvalidApiKeyMessage(senderOfResponse, apiKey);
  }

  onRequestForTranslatingTextFragments(request, apiKey, dataAboutText, senderOfResponse) {
    if (_isValidApiKey(this, apiKey)) {
      const textFragments = dataAboutText.textFragments;
      if (isTotalLengthOfStringsMoreThanN(textFragments, this[_limitOfCharactersInTextForTranslation])) {
        _sendResponseWithLimitOfCharactersInTextMessage(senderOfResponse);
        return;
      }
      _handleRequestForTranslatingTextFragments(this[_fakeTranslator], dataAboutText, textFragments, senderOfResponse);
      return;
    }
    _sendResponseWithInvalidApiKeyMessage(senderOfResponse, apiKey);
  }
};

const _fakeTranslator = Symbol();
const _validApiKeys = Symbol();
const _limitOfCharactersInTextForTranslation = Symbol();
const _cachedSupportedLanguages = Symbol();

const _createArrayBufferWithSupportedLangauges = (() => {
  const createArrayBufferWithSupportedLangauges = (languages) => {
    const sortedLanguagesByCode = _getSortedLanguagesByCode(languages);
    const jsonableLanguages = _createJsonableLanguages(sortedLanguagesByCode);
    const object = { languages: jsonableLanguages };
    return createArrayBufferWithUtf8FromString(JSON.stringify(object));
  };

  const _getSortedLanguagesByCode = (languages) => languages.slice().sort(_compareLanguagesByCode);
  const _compareLanguagesByCode = (a, b) => a.code.localeCompare(b.code);

  const _createJsonableLanguages = (languages) => languages.map(_createEntry);
  const _createEntry = (language) => ({ code: language.code, name: language.name });

  return createArrayBufferWithSupportedLangauges;
})();

const _isValidApiKey = (handlerOfRequests, apiKey) => handlerOfRequests[_validApiKeys].has(apiKey);

const _sendResponseWithInvalidApiKeyMessage = (senderOfResponse, invalidApiKey) => {
  return senderOfResponse.sendError("401", 16, "Unknown api key '" + invalidApiKey + "'");
};

const _sendResponseWithLimitOfCharactersInTextMessage = (senderOfResponse) => {
  return senderOfResponse.sendError("400", 11, "Limit of characters in text");
};

const _handleRequestForTranslatingTextFragments = (() => {
  const handleRequestForTranslatingTextFragments = (
    fakeTranslator,
    dataAboutText,
    textFragments,
    senderOfResponse
  ) => {
    const result = fakeTranslator.translateTextFragments(
      dataAboutText.codeOfSourceLanguage,
      dataAboutText.codeOfTargetLanguage,
      textFragments
    );
    const status = result[0];
    switch (status) {
      case statusesOfTranslation_noSuchSourceLanguage:
      // fallthrough
      case statusesOfTranslation_noSuchTargetLanguage:
        _sendResponseWithNoSuchLanguageMessage(senderOfResponse);
        return;
      case statusesOfTranslation_ok:
        const translatedTextFragments = result[1];
        _sendTranslation(senderOfResponse, translatedTextFragments);
        return;
    }
    throw new Error("Неизвестный статаус перевода: " + status);
  };

  const {
    noSuchSourceLanguage: statusesOfTranslation_noSuchSourceLanguage,
    noSuchTargetLanguage: statusesOfTranslation_noSuchTargetLanguage,
    ok: statusesOfTranslation_ok
  } = statusesOfTranslation;

  const _sendResponseWithNoSuchLanguageMessage = (senderOfResponse) => {
    return senderOfResponse.sendError("400", 3, "Unsupported language");
  };

  const _sendTranslation = (senderOfResponse, translatedTextFragments) => {
    const translation = {
      translations: translatedTextFragments.map(_createText)
    };
    senderOfResponse.sendTranslation(translation);
  };
  const _createText = (string) => ({ text: string });

  return handleRequestForTranslatingTextFragments;
})();

export default HandlerOfRequests;
