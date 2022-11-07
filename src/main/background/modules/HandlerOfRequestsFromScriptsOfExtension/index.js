"use strict";

import createHandlerOfRequestForGettingSettingsByPopupPage from
  "./utils/HandlerOfRequestForGettingSettingsByPopupPage/index.js";
import createHandlingRequestAsyncFn from "./utils/createHandlingRequestAsyncFn.js";

const createHandlerOfRequests = (options) => {
  const {
    uiThemes,
    codeOfLanguageToName,
    storerOfSettings,
    wrapperOfTranslationServiceClient
  } = options;

  if (typeof uiThemes !== "object") throw new Error("Темы интерфейса должны быть объектом");
  if (typeof codeOfLanguageToName !== "object") throw new Error("Таблица имён языков должна быть объектом");
  if (typeof storerOfSettings !== "object") throw new Error("Хранилище настроек должно быть объектом");
  if (typeof wrapperOfTranslationServiceClient !== "object")
    throw new Error("Обёртка клиента сервиса переводчика входящего сообщения должна быть объектом");

  const handler = createHandlerOfRequestForGettingSettingsByPopupPage(
    wrapperOfTranslationServiceClient,
    storerOfSettings,
    codeOfLanguageToName
  );
  return {
    [_uiThemes]: uiThemes,
    [_wrapperOfTranslationServiceClient]: wrapperOfTranslationServiceClient,
    [_storerOfSettings]: storerOfSettings,

    handleRequestForGettingNameOfCssClassForCurrentUiTheme(sendResponse) {
      return sendResponse(
        this[_uiThemes].getThemeById(this[_storerOfSettings].getIdOfTheme()).nameOfCssClass
      );
    },

    handleRequestForGettingSettingsByPopupPage: handler.handleRequest.bind(handler),

    handleRequestForGettingSettingsBySettingsPage(sendSettings) {
      const storerOfSettings = this[_storerOfSettings];
      sendSettings({
        apiKeyForTs: storerOfSettings.getApiKeyForTs(),
        apiKeyForDs: storerOfSettings.getApiKeyForDs(),
        idOfTheme: storerOfSettings.getIdOfTheme()
      });
    },

    handleRequestForUpdatingSettings: createHandlingRequestAsyncFn(async (handler, args) => {
      const changes = args[0];
      const sendOkStatus = args[1];

      const storerOfSettings = handler[_storerOfSettings];
      try {
        await storerOfSettings.updateSettings(changes);
      } catch(error) {
        console.log(error);
        return;
      }
      _updateApiKeysIfNeed(handler, changes);
      sendOkStatus();
    }),

    handleRequestForTranslatingTextFragments: createHandlingRequestAsyncFn(async (handler, args) => {
      const codeOfSourceLanguage = args[0];
      const codeOfTargetLanguage = args[1];
      const textFragments = args[2];
      const sendResponse = args[3];

      return sendResponse(await handler[_wrapperOfTranslationServiceClient].requestTranslatingTextFragments(
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        textFragments
      ));
    })
  };
};

const _uiThemes = "_";
const _wrapperOfTranslationServiceClient = "_1";
const _storerOfSettings = "_2";

const _willHandleRequestAsync = true;

const _updateApiKeysIfNeed = (handlerOfRequests, changes) => {
  if ("apiKeyForTs" in changes)
    handlerOfRequests[_wrapperOfTranslationServiceClient].setApiKey(changes.apiKeyForTs);
};

export default createHandlerOfRequests;
