"use strict";

import { equal as expectEqual } from "assert/strict";

import createEmptyWindow from "../../../../../../../../test/utils/createEmptyWindow.js";
import fakeI18n from "../../../../../../../../test/utils/fakeObjects/browser/fakeI18n.js";
import languages from "./languages.js";

const checkCreating = (PanelForTranslatingPage) => {
  const codeOfSourceLanguage = languages[1][0];
  const codeOfTargetLanguage = languages[3][0];

  const document = createEmptyWindow().document;
  const panel = new PanelForTranslatingPage(document, {
    supportedLanguages: languages,
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    i18n: fakeI18n
  });
  document.body.appendChild(panel.getElement());

  checkLanguagesInSelector(
    document.getElementById("source-language-selector"),
    languages,
    codeOfTargetLanguage
  );
  checkLanguagesInSelector(
    document.getElementById("target-language-selector"),
    languages,
    codeOfSourceLanguage
  );
};

const checkLanguagesInSelector = (selector, languages, codeOfHiddenLanguage) => {
  const options = selector.options;
  const length = options.length;
  expectEqual(languages.length, length);

  for (let i = 0; i < length; i += 1) {
    const language = languages[i];
    const option = options[i];
    checkOption(option, language);
    if (option.value === codeOfHiddenLanguage) expectElementHidden(option);
  }
};

const checkOption = (option, language) => {
  const [isoCode, nameInLanguageOfCurrentLocale] = language;
  expectEqual(isoCode, option.value);
  expectEqual(nameInLanguageOfCurrentLocale, option.innerHTML);
};

const expectElementHidden = (element) => expectEqual("none", element.style.display);

export default checkCreating;
