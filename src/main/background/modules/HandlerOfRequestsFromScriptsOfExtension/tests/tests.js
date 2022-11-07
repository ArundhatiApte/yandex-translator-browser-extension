"use strict";

import fetch from "node-fetch";

import {
  FakeUpperCasingTranslator,
  Language
} from "../../../../../test/utils/fakeObjects/servicies/translationService/FakeUpperCasingTranslator/index.js";
import HttpServerOfTranslationService from
  "../../../../../test/utils/fakeObjects/servicies/translationService/HttpServerOfTranslationService/index.js";
import FakeStorage from "../../../../../test/utils/fakeObjects/browser/FakeStorage/index.js";
import createElementsOfFakeConnectionFromRuntimeToBackgroundScript from
  "../../../../../test/utils/fakeObjects/browser/messaging/createElementsOfFakeConnectionFromRuntimeToBackgroundScript/index.js";

import uiThemes from "../../../../common/js/uiThemes/index.js";
import emptyApiKey from "../../../../common/js/data/emptyApiKey.js";
import emptyCodeOfLanguage from "../../../../common/js/data/emptyCodeOfLanguage.js";

import createAcceptorOfRequests from "../../AcceptorOfRequestsFromScriptsOfExtension/index.js";
import createStorerOfSettings from "../../StorerOfSettings/index.js";
import { create as createClientOfTranslationService } from
  "../../clientsOfServicies/ClientOfTranslationService/index.js";
import createWrapperOfTranslationServiceClient from
  "../../wrappersOfServiciesClients/WrapperOfTranslationServiceClient/index.js";
import codeOfLanguageToNameInEnglish from "../../codeOfLanguageToName/en.js";

import setHandlerOfRequestsFromScriptsOfExtension from "../../../utils/setHandlerOfRequestsFromScriptsOfExtension.js";

import checkRequestingNameOfCssClassForCurrentUiTheme from "./checks/checkRequestingNameOfCssClassForCurrentUiTheme.js";
import checkUpdatingAndGettingSettingsBySettingsPage from "./checks/checkUpdatingAndGettingSettingsBySettingsPage.js";
import checkRequestingTranslatingTextFragments from "./checks/checkRequestingTranslatingTextFragments.js";


describe("тест обработчика запросов от других частей расширения фонового сценария", () => {
  let fakeTranslator;
  const validApiKeys = ["abcd", "efgh"];
  let serverOfService;

  let fakeSenderOfMessages;
  let storerOfSettings;

  before(async () => {
    fakeTranslator = new FakeUpperCasingTranslator([
      new Language("aa", "Afar"),
      new Language("ae", "Avestan"),
      new Language("af", "Afrikaans"),
      new Language("ak", "Akan")
    ]);
    const port = 2004;
    const urlForGettingSupportedLanguages = "/langs";
    const urlForTranslatingTextFragments = "/tr";
    serverOfService = new HttpServerOfTranslationService({
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments,
      translator: fakeTranslator,
      validApiKeys,
      limitOfCharactersInText: 1000
    });
    await serverOfService.listen(port);

    const elements = createElementsOfFakeConnectionFromRuntimeToBackgroundScript();
    fakeSenderOfMessages = elements.fakeSenderOfMessages;
    const acceptorOfRequestsFromScriptsOfExtension = createAcceptorOfRequests(elements.fakeEventOfIncomingMessage);

    storerOfSettings = await createStorerOfSettings(new FakeStorage(), {
      emptyApiKey,
      emptyCodeOfLanguage,
      idOfDefaultTheme: uiThemes.getAllThemes()[0].id
    });
    const wrapperOfTranslationServiceClient = createWrapperOfTranslationServiceClient({
      fetch,
      translationService: {
        apiKey: storerOfSettings.getApiKeyForTs(),
        urlOfService: "http://127.0.0.1:" + port,
        urlForGettingSupportedLanguages,
        urlForTranslatingTextFragments,
        limitOfRequestsCount: {
          periodInMs: 1000,
          maxCount: 10
        }
      },
      createClientOfTranslationService
    });

    setHandlerOfRequestsFromScriptsOfExtension(acceptorOfRequestsFromScriptsOfExtension, {
      uiThemes,
      codeOfLanguageToName: codeOfLanguageToNameInEnglish,
      storerOfSettings,
      wrapperOfTranslationServiceClient
    });
  });

  const describeTests = () => {
    it("запрос на получение имени CSS класса для текущей цветовой темы",
      () => checkRequestingNameOfCssClassForCurrentUiTheme(fakeSenderOfMessages, storerOfSettings, uiThemes)
    );
    it("запрос на обновление и получение настроек страницей настроек",
      () => checkUpdatingAndGettingSettingsBySettingsPage(fakeSenderOfMessages)
    );
    it("запрос на перевод частей текста",
      () => checkRequestingTranslatingTextFragments(fakeSenderOfMessages, validApiKeys[1], fakeTranslator)
    );
  };
  describeTests();

  after(() => serverOfService.close());
});
