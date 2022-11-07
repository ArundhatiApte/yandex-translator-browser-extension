"use strict";

import uiThemes from "../common/js/uiThemes/index.js";
import emptyApiKey from "../common/js/data/emptyApiKey.js";
import emptyCodeOfLanguage from "../common/js/data/emptyCodeOfLanguage.js";
import dataForTranslationService from "../common/js/data/translationService/usedForBuild.js";

import createAcceptorOfRequestsFromScriptsOfExtension from "./modules/AcceptorOfRequestsFromScriptsOfExtension/index.js";
import createStorerOfSettings from "./modules/StorerOfSettings/index.js";
import { create as createClientOfTranslationService} from
  "./modules/clientsOfServicies/ClientOfTranslationService/index.js";
import createWrapperOfTranslationServiceClient from
  "./modules/wrappersOfServiciesClients/WrapperOfTranslationServiceClient/index.js";

import setHandlerOfRequestsFromExtensionParts from "./utils/setHandlerOfRequestsFromScriptsOfExtension.js";
import findCodeOfLanguage from "./utils/findCodeOfLanguage/index.js";


const main = async () => {
  const fetch = window.fetch.bind(window);
  const storage = chrome.storage.local;
  const runtimeOnMessage = chrome.runtime.onMessage;
  const i18n = chrome.i18n;

  const storerOfSettings = await createStorerOfSettings(storage, {
    emptyApiKey,
    emptyCodeOfLanguage,
    idOfDefaultTheme: uiThemes.getAllThemes()[0].id
  });

  const {
    urlOfService,
    urlForGettingSupportedLanguages,
    urlForTranslatingTextFragments,
    limitOfRequestsCount: {
      periodInMs,
      maxCount
    }
  } = dataForTranslationService;

  const wrapperOfTranslationServiceClient = createWrapperOfTranslationServiceClient({
    fetch,
    translationService: {
      apiKey: storerOfSettings.getApiKeyForTs(),
      urlOfService,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments,
      limitOfRequestsCount: {
        periodInMs,
        maxCount
      }
    },
    createClientOfTranslationService
  });

  const acceptorOfRequests = createAcceptorOfRequestsFromScriptsOfExtension(runtimeOnMessage);
  const codeOfLanguageToNameInEnglish = await _getCodeOfLanguageToNameTableForCurrentLocale(
    "/background/modules/codeOfLanguageToName/",
    ["en", "ru"],
    "en",
    i18n.getUILanguage()
  );

  setHandlerOfRequestsFromExtensionParts(acceptorOfRequests, {
    uiThemes,
    codeOfLanguageToName: codeOfLanguageToNameInEnglish,
    storerOfSettings,
    wrapperOfTranslationServiceClient
  });
};

const _getCodeOfLanguageToNameTableForCurrentLocale = async (
  pathToTablesDirectory,
  codesOfSupportedLanguages,
  codeOfDefaultLanguage,
  codeOfCurrentLocaleLanguage
) => {
  const codeOfUsedLanguage = findCodeOfLanguage(
    codesOfSupportedLanguages,
    codeOfDefaultLanguage,
    codeOfCurrentLocaleLanguage
  );
  const module = await import(/* webpackIgnore: true */ pathToTablesDirectory + codeOfUsedLanguage + ".js");
  return module.default;
};

main();
