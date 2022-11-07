"use strict";

import emptyApiKey from "../../../../common/js/data/emptyApiKey.js";

const createClientOfTranslationService = (options) => {
  const {
    fetch,
    isItNetworkError = _isItNetworkErrorF,
    apiKey,
    urlOfService,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments
  } = options;

  if (typeof fetch !== "function") throw new TypeError("fetch является нефункцией.");
  if (typeof isItNetworkError !== "function")
    throw new TypeError("Проверяющая сетевую ошибку функция является нефункцией.");

  if (typeof apiKey !== "string" && apiKey !== emptyApiKey)
    throw new TypeError("Ключ доступа к API сервиса является нестрокой.");

  if (typeof urlOfService !== "string")
    throw new TypeError("Адрес сервера службы переводчика является нестрокой.");

  if (typeof urlForGettingSupportedLanguages !== "string")
    throw new TypeError("Путь для получения поодерж. языков является нестрокой.");

  if (typeof urlForTranslatingTextFragments !== "string")
    throw new TypeError("Путь для перевода является нестрокой.");

  return {
    [_fetch]: fetch,
    [_isItNetworkError]: isItNetworkError,
    [_fullUrlForGettingSupportedLanguages]: urlOfService + urlForGettingSupportedLanguages,
    [_fullUrlForTranslatingTextFragments]: urlOfService + urlForTranslatingTextFragments,
    [_optionsForTranslatingTextFragments]: _createOptionsForTranslatingTextFragments(apiKey),

    setApiKey(apiKey) {
      this[_optionsForTranslatingTextFragments].headers[_nameOfHeaderForAuthorization] =
        _createValueOfHeaderForAuthorization(apiKey);
    },

    requestGettingCodesOfSupportedLanguages() {
      const options = {
        headers: {
          [_nameOfHeaderForAuthorization]: this[_optionsForTranslatingTextFragments]
            .headers[_nameOfHeaderForAuthorization]
        },
        method: _nameOfPostMethod
      };
      return _tryToFetchAndExtractResultIfOk(
        this[_fetch],
        this[_fullUrlForGettingSupportedLanguages],
        options,
        this[_isItNetworkError],
        _extractCodesOfSupportedLanguages
      );
    },

    requestTranslatingTextFragments(codeOfSourceLanguage, codeOfTargetLanguage, textFragments) {
      const options = this[_optionsForTranslatingTextFragments];
      options.body = _stringifyToJson({
        sourceLanguageCode: codeOfSourceLanguage,
        targetLanguageCode: codeOfTargetLanguage,
        texts: textFragments
      });
      return _tryToFetchAndExtractResultIfOk(
        this[_fetch],
        this[_fullUrlForTranslatingTextFragments],
        options,
        this[_isItNetworkError],
        _extractTranslatedTextFragments
      );
    }
  };
};

const _fetch = "_";
const _isItNetworkError = "_1";
const _fullUrlForGettingSupportedLanguages = "_2";
const _fullUrlForTranslatingTextFragments = "_3";
const _optionsForTranslatingTextFragments = "_4";

const _createOptionsForTranslatingTextFragments = (apiKey) => {
  const out = _createEmptyObject();

  const headers = _createEmptyObject();
  headers[_nameOfHeaderForAuthorization] = _createValueOfHeaderForAuthorization(apiKey);
  headers["Content-Type"] = "application/json";
  out.headers = headers;

  out.body = _createEmptyObject();
  out.method = _nameOfPostMethod;

  return out;
};

const _createEmptyObject = Object.create.bind(Object, null);
const _nameOfHeaderForAuthorization = "Authorization";

const _createValueOfHeaderForAuthorization = (apiKey) => "Api-Key " + apiKey;
const _nameOfPostMethod = "POST";

const _tryToFetchAndExtractResultIfOk = async (
  fetch,
  url,
  options,
  isItNetworkError,
  extractResultFromParsedByJsonObject
) => {
  let response;
  try {
    response = await fetch(url, options);
  } catch(error) {
    if (isItNetworkError(error)) {
      return _resultWithNetworkErrorStatus;
    }
    throw error;
  }
  return _extractStatusAndResultIfOk(response, extractResultFromParsedByJsonObject);
};

const _isItNetworkErrorF = (error) => error instanceof TypeError;

// https://cloud.yandex.ru/docs/translate/api-ref/errors-handling
const statuses_ok = 0;
const statuses_networkError = -1;
const statuses_invalidApiKey = 16;
const statuses_unknown = -2;

const _createResultOnlyWithStatus = (status) => {
  const out = Object.create(null);
  out.s = status;
  return Object.freeze(out);
};

const _resultWithNetworkErrorStatus = _createResultOnlyWithStatus(statuses_networkError);
const _resultWithInvalidApiKeyStatus = _createResultOnlyWithStatus(statuses_invalidApiKey)

const _extractStatusAndResultIfOk = async (response, extractResultFromParsedByJsonObject) => {
  let object;
  try {
    object = await response.json();
  } catch(error) {
    return _resultWithNetworkErrorStatus;
  }
  const codeOfError = object.code;
  if (codeOfError) {
    return _extractStatusOfErrorAndMessage(codeOfError, object);
  }
  return {
    s: statuses_ok,
    r: extractResultFromParsedByJsonObject(object)
  };
};

const _extractStatusOfErrorAndMessage = (codeOfError, bodyOfResponse) => {
  if (codeOfError === statuses_invalidApiKey) {
    return _resultWithInvalidApiKeyStatus;
  }
  return {
    s: statuses_unknown,
    em: bodyOfResponse.message
  };
};

const statusesOfResponse = (() => {
  const out = Object.create(null);

  out.ok = statuses_ok;
  out.networkError = statuses_networkError;
  out.invalidApiKey = statuses_invalidApiKey;
  out.unknown = statuses_unknown;

  Object.freeze(out);
  return out;
})();

const _extractCodesOfSupportedLanguages = (bodyOfResponse) => bodyOfResponse.languages.map(_extractCodeOfLanguage);
const _extractCodeOfLanguage = (entry) => entry.code;

const _stringifyToJson = JSON.stringify;

const _extractTranslatedTextFragments = (bodyOfResponse) => bodyOfResponse.translations.map(_extractText);
const _extractText = (translation) => translation.text;

export {
  createClientOfTranslationService as create,
  statusesOfResponse
};
