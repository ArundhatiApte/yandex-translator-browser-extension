"use strict";

import emptyApiKey from "../../../../common/js/data/emptyApiKey.js";
import emptyFunction from "../../../../common/js/utils/emptyFunction.js";
import checkThatListenerOfEventIsFunction from "../../../../common/js/utils/checkThatListenerOfEventIsFunction.js";
import i18nateElementIfHaveTranslation from "../../../../common/js/utils/i18nateElementIfHaveTranslation.js";


const setupGui = (options) => {
  const {
    document,
    uiThemes,
    initalSettings,
    i18n,
    beautifySelectElement
  } = options;

  if (typeof document !== "object") throw new Error("Документ должен быть объектом.");
  if (typeof uiThemes !== "object") throw new Error("Темы интерфейса должны быть объектом.");
  if (typeof initalSettings !== "object") throw new Error("Начальные настройки быть объектом.");
  if (typeof i18n !== "object") throw new Error("I18n должнa быть объектом.");
  if (typeof beautifySelectElement !== "function") throw new Error("Правка элементов выбоа должен быть функцией.");

  const gui = {
    [_uiThemes]: uiThemes,
    [_onRequestForUpdatingSettings]: emptyFunction,

    setRequestForUpdatingSettingsListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForUpdatingSettings] = listener;
    }
  };

  _setuptSelectorOfUiThemes(gui, document, uiThemes, initalSettings, i18n, beautifySelectElement);

  {
    let inputForApiKey = document.getElementById("api-key-for-ts-input");
    let label = document.querySelector("label[for=\"api-key-for-ts-input\"]");
    i18nateElementIfHaveTranslation(label, "innerHTML", i18n, "apiKeyToTs");

    if (inputForApiKey === null) throw new Error("Отсутствует поле ввода API ключа для сервиса переводчика.");
    gui[_inputForApiKeyForTs] = inputForApiKey;

    let apiKey = initalSettings.apiKeyForTs;
    if (apiKey === emptyApiKey) {
      inputForApiKey.value = "";
      gui[_lastSavedApiKeyForTs] = emptyApiKey;
    }
    else if (typeof apiKey === "string") {
      inputForApiKey.value = apiKey;
      gui[_lastSavedApiKeyForTs] = apiKey;
    }
    else throw new Error("API ключ к сервису переводчика является не строкой.");

    inputForApiKey = document.getElementById("api-key-for-ds-input");
    label = document.querySelector("label[for=\"api-key-for-ds-input\"]");
    i18nateElementIfHaveTranslation(label, "innerHTML", i18n, "apiKeyToDs");

    if (inputForApiKey === null) throw new Error("Отсутствует поле ввода API ключа для сервиса словаря.");
    gui[_inputForApiKeyForDs] = inputForApiKey;

    apiKey = initalSettings.apiKeyForDs;
    if (apiKey === emptyApiKey) {
      inputForApiKey.value = "";
      gui[_lastSavedApiKeyForDs] = emptyApiKey;
    }
    else if (typeof apiKey === "string") {
      inputForApiKey.value = apiKey;
      gui[_lastSavedApiKeyForDs] = apiKey;
    }
    else throw new Error("API ключ к сервису словаря является не строкой.");
  }

  _setupSavingButton(gui, document, i18n);
  return gui;
};

const _uiThemes  = "_";
const _onRequestForUpdatingSettings = "_1";

const _selectorOfUiTheme = "_2";
const _lastSavedIdOfUiTheme = "_3";
const _nameOfCurrentCssClassNameForUiTheme = "_4";

const _inputForApiKeyForTs = "_5";
const _lastSavedApiKeyForTs = "_6";

const _inputForApiKeyForDs = "_7";
const _lastSavedApiKeyForDs = "_8";

const _setuptSelectorOfUiThemes = (gui, document, uiThemes, initalSettings, i18n, beautifySelectElement) => {
  const selectorOfUiTheme = document.getElementById("ui-theme-selector");
  if (selectorOfUiTheme === null) throw new Error("Отсутствует список выбора тем интерфейса.");

  const classListOfBody = document.body.classList;
  gui[_selectorOfUiTheme] = selectorOfUiTheme;
  _setChangingThemeListener(selectorOfUiTheme, gui, classListOfBody);

  const label = document.querySelector("label[for=\"ui-theme-selector\"]");
  i18nateElementIfHaveTranslation(label, "innerHTML", i18n, "uiTheme");

  const idOfUiTheme = initalSettings.idOfTheme;
  const uiTheme = uiThemes.getThemeById(idOfUiTheme);
  if (!uiTheme) throw new Error("Отсутствует тема интерфейса с id: " + idOfUiTheme);
  _addUiThemes(document, selectorOfUiTheme, uiThemes, i18n);
  gui[_lastSavedIdOfUiTheme] = idOfUiTheme;
  selectorOfUiTheme.value = idOfUiTheme;

  const name = uiTheme.nameOfCssClass;
  if (name) {
    classListOfBody.add(name);
    gui[_nameOfCurrentCssClassNameForUiTheme] = name;
  }
  beautifySelectElement(selectorOfUiTheme);
};

const _addUiThemes = (document, selectorOfUiTheme, uiThemes, i18n) => {
  const fragment = document.createDocumentFragment();
  for (const uiTheme of uiThemes.getAllThemes()) {
    fragment.appendChild(_createOptionForUiTheme(document, uiTheme, i18n));
  }
  selectorOfUiTheme.appendChild(fragment);
};

const _createOptionForUiTheme = (document, uiTheme, i18n) => {
  const option = document.createElement("option");
  option.value = uiTheme.id.toString();
  option.innerHTML = i18n.getMessage(uiTheme.name + "Theme");
  return option;
};

const _setChangingThemeListener = (selectorOfUiTheme, gui, classListOfBody) => {
  return selectorOfUiTheme.addEventListener("change", _changeUiTheme.bind(gui, classListOfBody));
};

const _changeUiTheme = function(bodysClassList) {
  const idOfNewUiTheme = _getIdOfUiTheme(this[_selectorOfUiTheme]);
  const nameOfNewCssClass = this[_uiThemes].getThemeById(idOfNewUiTheme).nameOfCssClass;
  const nameOfPrevCssClass = this[_nameOfCurrentCssClassNameForUiTheme];

  bodysClassList.remove(nameOfPrevCssClass);
  if (nameOfNewCssClass) bodysClassList.add(nameOfNewCssClass);
  this[_nameOfCurrentCssClassNameForUiTheme] = nameOfNewCssClass;
};

const _getIdOfUiTheme = (selectorOfUiTheme) => parseInt(selectorOfUiTheme.value);

const _setupSavingButton = (gui, document, i18n) => {
  const savingButton = document.getElementById("saving-button");
  i18nateElementIfHaveTranslation(savingButton, "value", i18n, "save");
  if (savingButton === null) throw new Error("Отсутствует кнопка для сохранения.");
  _setClickOnSavingButtonListener(savingButton, gui);
};

const _setClickOnSavingButtonListener = (savingButton, gui) =>
  savingButton.addEventListener("click", _handleRequestForUpatingSettings.bind(gui));

const _handleRequestForUpatingSettings = function() {
  const changes = Object.create(null);
  let hasChanges = false;

  const idOfNewUiTheme = _getIdOfUiTheme(this[_selectorOfUiTheme]);
  if (idOfNewUiTheme !== this[_lastSavedIdOfUiTheme]) {
    this[_lastSavedIdOfUiTheme] = idOfNewUiTheme;
    changes.idOfTheme = idOfNewUiTheme;
    hasChanges = true;
  }

  let newApiKey = this[_inputForApiKeyForTs].value;
  let prevApiKey = this[_lastSavedApiKeyForTs];
  if (newApiKey === "") {
    if (prevApiKey !== emptyApiKey) {
      this[_lastSavedApiKeyForTs] = emptyApiKey;
      changes.apiKeyForTs = emptyApiKey;
      hasChanges = true;
    }
  }
  else if (newApiKey !== prevApiKey) {
    this[_lastSavedApiKeyForTs] = newApiKey;
    changes.apiKeyForTs = newApiKey;
    hasChanges = true;
  }

  newApiKey = this[_inputForApiKeyForDs].value;
  prevApiKey = this[_lastSavedApiKeyForDs];
  if (newApiKey === "") {
    if (prevApiKey !== emptyApiKey) {
      this[_lastSavedApiKeyForDs] = emptyApiKey;
      changes.apiKeyForDs = emptyApiKey;
      hasChanges = true;
    }
  }
  else if (newApiKey !== prevApiKey) {
    this[_lastSavedApiKeyForDs] = newApiKey;
    changes.apiKeyForDs = newApiKey;
    hasChanges = true;
  }

  if (hasChanges) this[_onRequestForUpdatingSettings](changes);
};

export default setupGui;
