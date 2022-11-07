"use strict";

import {
  notTranslated as statesOfPageTranslation_notTranslated,
  translated as statesOfPageTranslation_translated,
  translatedAndSourceTextShown as statesOfPageTranslation_translatedAndSourceTextShown
} from "../../common/js/data/statesOfPageTranslation.js";

import statusesOfResponseOnGettingSupportedLanguages from
  "../../common/js/data/statusesOfResponse/gettingSupportedLanguages.js";
import statusesOfResponseOnTranslation from "../../common/js/data/statusesOfResponse/translation.js";
import i18nateElementIfHaveTranslation from "../../common/js/utils/i18nateElementIfHaveTranslation.js";

import createConnectionToBackgroundScript from "./utils/createConnectionToBackgroundScript.js";
import createConnectionToTranslatingPageScript from "./utils/ConnectionToTranslatingPageScript/index.js";

import PanelForTranslatingPage from "./utils/gui/PanelForTranslatingPage/index.js";
import PanelWithOneButton from "./utils/gui/PanelWithOneButton/index.js";
import displayerOfErrors from "./utils/gui/displayerOfErrors.js";
import getI18natedMessageOrDefault from "./utils/gui/getI18natedMessageOrDefault.js";


const script = (() => {
  const _window = "_";
  const _connectionToBackgroundScript = "_1";
  const _i18n = "_2";
  const _tabs = "_3";
  const _idOfCurrentTab = "_4";

  const _connectionToTranslatingPageScript = "_5";
  const _wasTranslatingPageScriptExecuted = "_6";
  const _stateOfPageTranslation = "_7";
  const _mainElement = "_8";

  const _panelForTranslatingPage = "_9";
  const _panelForShowingSourceTextInPage = "_a";
  const _panelForShowingTranslatedTextInPage = "_b";

  const script = {
    [_window]: null,
    [_connectionToBackgroundScript]: null,
    [_i18n]: null,
    [_tabs]: null,
    [_idOfCurrentTab]: -1,

    [_connectionToTranslatingPageScript]: null,
    [_wasTranslatingPageScriptExecuted]: false,
    [_stateOfPageTranslation]: null,
    [_mainElement]: null,

    [_panelForTranslatingPage]: null,
    [_panelForShowingSourceTextInPage]: null,
    [_panelForShowingTranslatedTextInPage]: null,

    async run(window, chrome) {
      this[_window] = window;
      const connectionToBackgroundScript = createConnectionToBackgroundScript(chrome.runtime);
      this[_connectionToBackgroundScript] = connectionToBackgroundScript;
      await _receiveAndApplyUiTheme(this);

      const i18n = chrome.i18n;
      this[_i18n] = i18n;
      const document = window.document;
      i18nateElementIfHaveTranslation(document, "title", i18n, "popup");

      const tabs = chrome.tabs;
      this[_tabs] = tabs;
      const idOfCurrentTab = await _getIdOfCurrentTab(tabs);
      this[_idOfCurrentTab] = idOfCurrentTab;

      const connectionToTranslatingPageScript = createConnectionToTranslatingPageScript(tabs, idOfCurrentTab);
      this[_connectionToTranslatingPageScript] = connectionToTranslatingPageScript;
      this[_mainElement] = document.querySelector("main");
      await _showUiBasedOnStateOfPageTranslation(this);
    }
  };

  const _receiveAndApplyUiTheme = async (script) => {
    const name = await script[_connectionToBackgroundScript].requestGettingNameOfCssClassForCurrentUiTheme();
    if (name) script[_window].document.body.classList.add(name);
  };

  const _getIdOfCurrentTab = (tabs) =>
    new Promise((resolve) => tabs.query({ currentWindow: true, active: true }, (tabs) => resolve(tabs[0].id)));

  const _showUiBasedOnStateOfPageTranslation = async (script) => {
    let stateOfPageTranslation;
    try {
      stateOfPageTranslation = await script[_connectionToTranslatingPageScript]
        .requestGettingStateOfPageTranslation();
    }
    catch(scriptWasNotExecutedInCurrentTab) {
      script[_wasTranslatingPageScriptExecuted] = false;
      script[_stateOfPageTranslation] = statesOfPageTranslation_notTranslated;
      await _showUiWhenPageIsNotTranslated(script);
      return;
    }
    script[_wasTranslatingPageScriptExecuted] = true;
    script[_stateOfPageTranslation] = stateOfPageTranslation;

    if (stateOfPageTranslation === statesOfPageTranslation_notTranslated) {
      await _showUiWhenPageIsNotTranslated(script);
      return;
    }
    _showUiForViewingSourceOrTranslatedText(script);
  };

  const _showUiWhenPageIsNotTranslated = async (script) => {
    const settings = await script[_connectionToBackgroundScript].requestGettingSettings();
    const gettingSupportedLanguages = settings[0];
    const status = gettingSupportedLanguages.s;
    const statuses = statusesOfResponseOnGettingSupportedLanguages;

    switch (status) {
      case statuses.ok:
        const supportedLanguages = gettingSupportedLanguages.r;
        const [, codeOfSourceLanguage, codeOfTargetLanguage] = settings;
        _showPanelForTranslatingPageFirstTime(
          script,
          supportedLanguages,
          codeOfSourceLanguage,
          codeOfTargetLanguage
        );
        return;
      case statuses.apiKeyWasNotSetted:
        _showApiKeyWasNotSettedMessageFirstTime(script);
        return;
      case statuses.networkError:
        _showNetworkErrorMessageFirstTime(script);
        return;
      case statuses.invalidApiKey:
        _showInvalidApiKeyMessageFirstTime(script);
        return;
      case statuses.unknown:
        const message = gettingSupportedLanguages.em;
        _showErrorMessageFromServerResponseFirstTime(script, message);
        return;
    }
    _logMessageAndThrow("Неизвестный статус на запрос получения поддерживаемых языков: " + status);
  };

  const _logMessageAndThrow = (message) => {
    console.warn(message);
    throw new Error(message);
  };

  const _showPanelForTranslatingPageFirstTime = (
    script,
    supportedLanguages,
    codeOfSourceLanguage,
    codeOfTargetLanguage
  ) => {
    const window = script[_window];
    const panel = new PanelForTranslatingPage(window.document, {
      supportedLanguages,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      i18n: script[_i18n]
    });
    script[_panelForTranslatingPage] = panel;
    _setRequestForTranslatingPageListener(script, panel, codeOfSourceLanguage, codeOfTargetLanguage);
    script[_mainElement].appendChild(panel.getElement());
  };

  const _setRequestForTranslatingPageListener = (
    script,
    panel,
    codeOfInitalSourceLanguage,
    codeOfInitalTargetLanguage
  ) => {
    const updaterOfLanguages = UpdatingLanguagesHandler.create(
      script[_connectionToBackgroundScript],
      codeOfInitalSourceLanguage,
      codeOfInitalTargetLanguage
    );
    const listenerOfRequest = _handleRequestForTranslatingPage.bind(script, updaterOfLanguages);
    panel.setRequestForTranslatingPageListener(listenerOfRequest);
  };

  const _handleRequestForTranslatingPage = async function(
    updaterOfLanguages,
    codeOfSelectedSourceLanguage,
    codeOfSelectedTargetLanguage
  ) {
    const script = this;
    if (script[_stateOfPageTranslation] !== statesOfPageTranslation_notTranslated) return;

    if (script[_wasTranslatingPageScriptExecuted] === false) {
      await _executeScript(script[_tabs], script[_idOfCurrentTab], {
        file: "/contentScripts/translatingPageScript.js",
        runAt: "document_idle"
      });
      script[_wasTranslatingPageScriptExecuted] = true;
    }
    const response = await script[_connectionToTranslatingPageScript].requestTranslatingPage(
      codeOfSelectedSourceLanguage,
      codeOfSelectedTargetLanguage
    );
    _showUiAfterRequestForTranslatingPage(script, response);
    await updaterOfLanguages.updateLanguagesIfNeed(codeOfSelectedSourceLanguage, codeOfSelectedTargetLanguage);
  };

  const _executeScript = (tabs, idOfTab, options) =>
    new Promise((resolve) => tabs.executeScript(idOfTab, options, resolve));

  const _showUiAfterRequestForTranslatingPage = (script, response) => {
    const status = response.s;
    const statuses = statusesOfResponseOnTranslation;

    _hidePanelForTranslatingPage(script);
    switch (status) {
      case statuses.ok:
        script[_stateOfPageTranslation] = statesOfPageTranslation_translated;
        _showPanelForViewingSourceTextFirstTime(script);
        return;
      case statuses.apiKeyWasNotSetted:
        _showApiKeyWasNotSettedMessageFirstTime(script);
        return;
      case statuses.networkError:
        _showNetworkErrorMessageFirstTime(script);
        return;
      case statuses.invalidApiKey:
        _showInvalidApiKeyMessageFirstTime(script);
        return;
      case statuses.unknown:
        const message = gettingSupportedLanguages.em;
        _showErrorMessageFromServerResponseFirstTime(script, message);
        return;
    }
    _logMessageAndThrow("Неизвестный код ответа на запрос перевода текстa: " + status);
  };

  const _hidePanelForTranslatingPage = (script) =>
    _hideElement(script[_panelForTranslatingPage].getElement());

  const _hideElement = (element) => element.style.display = "none";

  const _showPanelForViewingSourceTextFirstTime = (script) =>
    _showAndConfigurePanelWithOneButton(
      script,
      _panelForShowingSourceTextInPage,
      "showSourceText",
      "Show source text",
      _handleRequestForShowingSourceText
    );

  const _showAndConfigurePanelWithOneButton = (
    script,
    nameOfProperty,
    nameOfMessageOnButton,
    defaultMessageOnButton,
    handleClick
  ) => {
    const window = script[_window];
    const textForButotn = getI18natedMessageOrDefault(script[_i18n], nameOfMessageOnButton, defaultMessageOnButton);
    const panel = new PanelWithOneButton(window.document, textForButotn);
    script[nameOfProperty] = panel;

    panel.setClickOnButtonListener(handleClick.bind(script));
    script[_mainElement].appendChild(panel.getElement());
  };

  const _handleRequestForShowingSourceText = async function() {
    const script = this;
    await script[_connectionToTranslatingPageScript].requestShowingSourceTextInPage();
    script[_stateOfPageTranslation] = statesOfPageTranslation_translatedAndSourceTextShown;
    _hideElement(script[_panelForShowingSourceTextInPage].getElement());
    _showPanelForViewingTranslatedText(script);
  };

  const _showPanelForViewingTranslatedText = (script) =>
    _showPanelOrSetup(script, _panelForShowingTranslatedTextInPage, _showPanelForViewingTranslatedTextFirstTime);

  const _showPanelOrSetup = (script, nameOfPanel, setupPanel) => {
    const panel = script[nameOfPanel];
    if (panel) {
      _showBlockElement(panel.getElement());
      return;
    }
    setupPanel(script);
  };

  const _showBlockElement = (element) => element.style.display = "block";

  const _showPanelForViewingTranslatedTextFirstTime = (script) =>
    _showAndConfigurePanelWithOneButton(
      script,
      _panelForShowingTranslatedTextInPage,
      "showTranslatedText",
      "Show translated text",
      _handleRequestForShowingTranslatedText
    );

  const _handleRequestForShowingTranslatedText = async function() {
    const script = this;
    await script[_connectionToTranslatingPageScript].requestShowingTranslatedTextInPage();
    script[_stateOfPageTranslation] = statesOfPageTranslation_translated;
    _hideElement(script[_panelForShowingTranslatedTextInPage].getElement());
    _showPanelForViewingSourceText(script);
  };

  const _showPanelForViewingSourceText = (script) =>
    _showPanelOrSetup(script, _panelForShowingSourceTextInPage, _showPanelForViewingSourceTextFirstTime);

  const _showUiForViewingSourceOrTranslatedText = (script) => {
    const state = script[_stateOfPageTranslation];
    if (state === statesOfPageTranslation_translated)
      _showPanelForViewingSourceText(script);
    else if (state === statesOfPageTranslation_translatedAndSourceTextShown)
      _showPanelForViewingTranslatedText(script);
    else throw new Error("Неизвестный статус состояния страницы; "+ state);
  };

  const _showApiKeyWasNotSettedMessageFirstTime = (script) =>
    displayerOfErrors.addApiKeyWasNotSettedMessage(script[_window].document, script[_mainElement], script[_i18n]);

  const _showNetworkErrorMessageFirstTime = (script) =>
    displayerOfErrors.addNetworkErrorMessage(script[_window].document, script[_mainElement], script[_i18n]);

  const _showInvalidApiKeyMessageFirstTime = (script) =>
    displayerOfErrors.addInvalidApiKeyMessage(script[_window].document, script[_mainElement], script[_i18n]);

  const _showErrorMessageFromServerResponseFirstTime = (script, message) =>
    displayerOfErrors.addCustomMessage(script[_window], script[_mainElement], message);

  const UpdatingLanguagesHandler = (() => {
    const createUpdatingLanguagesHandler = (
      connectionToBackgroundScript,
      codeOfInitalSourceLanguage,
      codeOfInitalTargetLanguage
    ) => {
      return {
        [_connectionToBackgroundScript]: connectionToBackgroundScript,
        [_codeOfLastSavedSourceLanguage]: codeOfInitalSourceLanguage,
        [_codeOfLastSavedTargetLanguage]: codeOfInitalTargetLanguage,

        updateLanguagesIfNeed(codeOfNewSourceLanguage, codeOfNewTargetLanguage) {
          let changes = Object.create(null);
          let hasChanges = false;

          if (codeOfNewSourceLanguage !== this[_codeOfLastSavedSourceLanguage]) {
            this[_codeOfLastSavedSourceLanguage] = codeOfNewSourceLanguage;
            changes.codeOfSourceLanguageForTs = codeOfNewSourceLanguage;
            hasChanges = true;
          }
          if (codeOfNewTargetLanguage !== this[_codeOfLastSavedTargetLanguage]) {
            this[_codeOfLastSavedTargetLanguage] = codeOfNewTargetLanguage;
            changes.codeOfTargetLanguageForTs = codeOfNewTargetLanguage;
            hasChanges = true;
          }
          if (hasChanges) return this[_connectionToBackgroundScript].requestUpdatingSettings(changes);
        }
      };
    };

    const _connectionToBackgroundScript = "_";
    const _codeOfLastSavedSourceLanguage = "_1";
    const _codeOfLastSavedTargetLanguage = "_2";

    return { create: createUpdatingLanguagesHandler };
  })();

  return script;
})();

script.run(window, chrome);
