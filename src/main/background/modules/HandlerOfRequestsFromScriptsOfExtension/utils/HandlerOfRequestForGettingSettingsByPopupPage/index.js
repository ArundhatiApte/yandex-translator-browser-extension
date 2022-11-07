"use strict";

import statusesOfResponse from
  "../../../../modules/wrappersOfServiciesClients/WrapperOfTranslationServiceClient/statusesOfResponse.js";
import createHandlingRequestAsyncFn from "../createHandlingRequestAsyncFn.js";


const createHandlerOfRequestForGettingSettingsByPopupPage = (
  wrapperOfTranslationServiceClient,
  storerOfSettings,
  codeOfLanguageToName
) => {
  return {
    [_codeOfLanguageToName]: codeOfLanguageToName,
    [_storerOfSettings]: storerOfSettings,
    [_wrapperOfTranslationServiceClient]: wrapperOfTranslationServiceClient,

    [_cachedOkResponseWithSupportedLanguages]: null,
    handleRequest
  };
};

const _codeOfLanguageToName = "_";
const _storerOfSettings = "_1";
const _wrapperOfTranslationServiceClient = "_2";
const _cachedOkResponseWithSupportedLanguages = "_3";

const handleRequest = createHandlingRequestAsyncFn(async function handleRequest(handler, args) {
  const sendSettings = args[0];
  const cachedOkResponse = handler[_cachedOkResponseWithSupportedLanguages];
  if (cachedOkResponse) {
    _sendResponseWhenSucces(handler, cachedOkResponse, sendSettings);
    return;
  }
  await _receiveSupportedLanguagesThenCacheIfNeedAndSendSettings(handler, sendSettings);
});

const _sendResponseWhenSucces = (handlerOfRequest, okResponseWithSupportedLanguages, sendSettings) => {
  const supportedLanguages = okResponseWithSupportedLanguages.r;
  const storerOfSettings = handlerOfRequest[_storerOfSettings];
  if (supportedLanguages.length < 2) {
    throw new Error("Список языков содержит менее 2-ух записей.");
  }
  sendSettings([
    okResponseWithSupportedLanguages,
    storerOfSettings.getCodeOfSourceLanguageForTs(),
    storerOfSettings.getCodeOfTargetLanguageForTs()
  ]);
};

const _receiveSupportedLanguagesThenCacheIfNeedAndSendSettings = async (handlerOfRequest, sendSettings) => {
  const response = await handlerOfRequest[_wrapperOfTranslationServiceClient]
    .requestGettingCodesOfSupportedLanguages();
  const status = response.s;

  if (status !== statusesOfResponse_ok) {
    _sendResponseWhenFail(handlerOfRequest, response, sendSettings);
    return;
  }

  const codesOfSupportedLanguages = response.r;
  await _updateCodesOfLanguagesIfHasNot(handlerOfRequest, codesOfSupportedLanguages);

  const cachedResponse = Object.freeze({
    s: statusesOfResponse_ok,
    r: _createLanguagesWithNames(codesOfSupportedLanguages, handlerOfRequest[_codeOfLanguageToName])
  });
  handlerOfRequest[_cachedOkResponseWithSupportedLanguages] = cachedResponse;
  _sendResponseWhenSucces(handlerOfRequest, cachedResponse, sendSettings);
};

const statusesOfResponse_ok = statusesOfResponse.ok;
const _sendResponseWhenFail = (handlerOfRequest, response, sendSettings) => sendSettings([response]);

const _updateCodesOfLanguagesIfHasNot = async (handlerOfRequest, codesOfSupportedLanguages) => {
  const storerOfSettings = handlerOfRequest[_storerOfSettings];
  let hasChanges = false;
  const changes = Object.create(null);

  if (_isNotInArray(codesOfSupportedLanguages, storerOfSettings.getCodeOfSourceLanguageForTs)) {
    hasChanges = true;
    changes.codeOfSourceLanguageForTs = codesOfSupportedLanguages[0];
  }
  if (_isNotInArray(codesOfSupportedLanguages, storerOfSettings.getCodeOfTargetLanguageForTs)) {
    hasChanges = true;
    changes.codeOfTargetLanguageForTs = codesOfSupportedLanguages[1];
  }
  if (hasChanges) await storerOfSettings.updateSettings(changes);
};

const _isNotInArray = (array, element) => array.indexOf(element) === -1;

const _createLanguagesWithNames = (codesOfLanguages, codeOfLanguageToName) => {
  return codesOfLanguages.map((code) => {
    const name = codeOfLanguageToName[code];
    return name ? [code, name] : [code];
  });
};

export default createHandlerOfRequestForGettingSettingsByPopupPage;
