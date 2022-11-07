"use strict";

import emptyFunction from "../../../../../common/js/utils/emptyFunction.js";
import checkThatListenerOfEventIsFunction from "../../../../../common/js/utils/checkThatListenerOfEventIsFunction.js";
import WrapperOfElement from "../_WrapperOfElement.js";


const PanelForTranslatingPage = class extends WrapperOfElement {
  constructor(document, options) {
    super(document.createElement("section"));

    const {
      supportedLanguages,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      i18n
    } = options;

    if (Array.isArray(supportedLanguages) !== true) throw new Error("Список языков должен быть массивом");
    if (typeof codeOfSourceLanguage !== "string") throw new Error("Код исходного языка должен быть строкой");
    if (typeof codeOfTargetLanguage !== "string") throw new Error("Код целевого языка должен быть строкой");
    if (codeOfSourceLanguage === codeOfTargetLanguage)
      throw new Error("Коды исходного и целевого языка одинаковы.");
    if (typeof i18n !== "object") throw new Error("I18n должна быть объектом");

    const section = this[_element];
    _setupPanel(this, section, document, supportedLanguages, codeOfSourceLanguage, codeOfTargetLanguage);

    this[_onRequestForTranslatingPage] = emptyFunction;
    const button = section.querySelector("input[type=\"button\"]");
    const message = i18n.getMessage("translatePage");
    if (message) {
      button.value = message;
    }
    _setEmittingRequestForTranslatingPageListener(this, button);
  }

  setRequestForTranslatingPageListener(listener) {
    checkThatListenerOfEventIsFunction(listener);
    this[_onRequestForTranslatingPage] = listener;
  }

  getCodeOfSourceLanguage() {
    return this[_selectorOfSourceLanguage].value;
  }

  getCodeOfTargetLanguage() {
    return this[_targetSelectorOfLanguage].value;
  }
};

const _element = WrapperOfElement._namesOfProtectedProperties._element;
const _onRequestForTranslatingPage = "_1";
const _selectorOfSourceLanguage = "_2";
const _targetSelectorOfLanguage = "_3";

const _setupPanel = (() => {
  const setupPanel = (
    panelForTranslatingPage,
    section,
    document,
    supportedLanguages,
    codeOfSourceLanguage,
    codeOfTargetLanguage
  ) => {
    section.innerHTML = _htmlOfSection;
    const selectors = section.querySelectorAll("select");
    const selectorOfSourceLanguage = selectors[0];
    const selectorOfTargetLanguage = selectors[1];
    panelForTranslatingPage[_selectorOfSourceLanguage] = selectorOfSourceLanguage;
    panelForTranslatingPage[_targetSelectorOfLanguage] = selectorOfTargetLanguage;

    _fillLanguages(
      document,
      selectorOfSourceLanguage,
      supportedLanguages,
      codeOfSourceLanguage,
      codeOfTargetLanguage
    );
    _fillLanguages(
      document,
      selectorOfTargetLanguage,
      supportedLanguages,
      codeOfTargetLanguage,
      codeOfSourceLanguage
    );

    _setHidingEqualLanguageListener(
      selectorOfSourceLanguage,
      codeOfSourceLanguage,
      selectorOfTargetLanguage
    );
    _setHidingEqualLanguageListener(
      selectorOfTargetLanguage,
      codeOfTargetLanguage,
      selectorOfSourceLanguage
    );
  };

  const _htmlOfSection =
    "<div>" +
      "<select id=source-language-selector></select>" +
      "<select id=target-language-selector></select>" +
    "</div>" +
    "<input type=button id=translation-button value=\"Translate page\"/>"

  const _fillLanguages = (() => {
    const fillLanguages = (
      document,
      selectorOfLanguages,
      languages,
      codeOfInitalLanguage,
      codeOfHiddenLanguage
    ) => {
      let i = 0;
      const length = languages.length;
      let entry;
      let isoCode;
      let nameInLanguageOfCurrentLocale;

      for (; i < length; i += 1) {
        entry = languages[i];
        isoCode = entry[0];
        nameInLanguageOfCurrentLocale = entry[1];

        if (isoCode === codeOfHiddenLanguage) {
          const option = _createOptionWithLanguage(document, isoCode, nameInLanguageOfCurrentLocale);
          _hideElement(option.style);
          selectorOfLanguages.appendChild(option);
          i += 1;
          break;
        }
        _appendOptionWithLanguage(document, selectorOfLanguages, isoCode, nameInLanguageOfCurrentLocale);
      }
      for (; i < length; i += 1) {
        entry = languages[i];
        _appendOptionWithLanguage(document, selectorOfLanguages, entry[0],  entry[1]);
      }
      selectorOfLanguages.value = codeOfInitalLanguage;
    };

    const _appendOptionWithLanguage = (
      document,
      selectorOfLanguages,
      isoCode,
      nameInLanguageOfCurrentLocale
    ) => {
      return selectorOfLanguages.appendChild(_createOptionWithLanguage(
        document,
        isoCode,
        nameInLanguageOfCurrentLocale
      ));
    };

    const _createOptionWithLanguage = (document, isoCode, nameInLanguageOfCurrentLocale) => {
      const option = document.createElement("option");
      option.value = isoCode;
      option.innerHTML = nameInLanguageOfCurrentLocale;
      return option;
    };

    return fillLanguages;
  })();

  const _hideElement = (styleOfElement) => styleOfElement.display = "none";

  const _setHidingEqualLanguageListener = (() => {
    const setHidingEqualLanguageListener = (
      sourceSelectorOfLanguage,
      codeOfHiddenLanguageInTargetSelector,
      targetSelectorOfLanguage
    ) => {
      const listener = new _HidingEqualValueListener(
        sourceSelectorOfLanguage,
        _findOptionByValue(targetSelectorOfLanguage.options, codeOfHiddenLanguageInTargetSelector),
        targetSelectorOfLanguage
      );
      sourceSelectorOfLanguage.addEventListener(
        "change",
        _HidingEqualValueListener_onValueChanged.bind(listener)
      );
    };

    const _HidingEqualValueListener = function(
      sourceSelector,
      hiddenOptionInTargetSelector,
      targetSelector
    ) {
      this[_sourceSelector] = sourceSelector;
      this[_styleOfPrevHiddenOptionInTargetSelector] = hiddenOptionInTargetSelector.style;
      this[_targetSelector] = targetSelector;
    };

    const _sourceSelector = "_";
    const _styleOfPrevHiddenOptionInTargetSelector = "_1";
    const _targetSelector = "_2";

    const _HidingEqualValueListener_onValueChanged = function() {
      _showBlockElement(this[_styleOfPrevHiddenOptionInTargetSelector]);
      const codeOfSelectedValue = this[_sourceSelector].value;
      const optionForHiding = _findOptionByValue(this[_targetSelector].options, codeOfSelectedValue);
      const style = optionForHiding.style;
      _hideElement(style);
      this[_styleOfPrevHiddenOptionInTargetSelector] = style;
    };

    const _findOptionByValue = (options, value) => {
      for (const option of options) {
        if (option.value === value) return option;
      }
      throw new Error("Отсутствует пункт выбора: " + codeOfLanguage);
    };

    const _showBlockElement = (style) => style.display = "block";

    return setHidingEqualLanguageListener;
  })();

  return setupPanel;
})();

const _setEmittingRequestForTranslatingPageListener = (() => {
  const setEmittingRequestForTranslatingPageListener = (panelForTranslatingPage, button) => {
    return button.addEventListener("click", _emitRequestForTranslatingPage.bind(panelForTranslatingPage));
  };

  const _emitRequestForTranslatingPage = function() {
    return this[_onRequestForTranslatingPage](
      this[_selectorOfSourceLanguage].value,
      this[_targetSelectorOfLanguage].value
    );
  };

  return setEmittingRequestForTranslatingPageListener;
})();

export default PanelForTranslatingPage;
