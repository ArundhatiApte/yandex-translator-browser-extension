"use strict";

import createEmptyWindow from "../../../../../../../test/utils/createEmptyWindow.js";
import fakeI18n from "../../../../../../../test/utils/fakeObjects/browser/fakeI18n.js";

import PanelForTranslatingPage from "../index.js";
import languages from "./utils/languages.js";
import checkCreating from "./utils/checkCreating.js";
import checkClickForTranslatingPage from "./utils/checkClickForTranslatingPage.js";
import checkNoAbilityToSelectEqualSourceAndTargetLanguages from
  "./utils/checkNoAbilityToSelectEqualSourceAndTargetLanguages.js";


describe("тест панели для перевода страницы во вкладке", () => {
  let window;
  let panelForTranslatingPage;

  before(async () => {
    window = createEmptyWindow();
    const document = window.document;

    const codeOfSourceLanguage = languages[0][0];
    const codeOfTargetLanguage = languages[1][0];
    panelForTranslatingPage = new PanelForTranslatingPage(document, {
      supportedLanguages: languages,
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      i18n: fakeI18n
    });
    document.body.appendChild(panelForTranslatingPage.getElement());
  });

  const describeTests = () => {
    it("создание", () => checkCreating(PanelForTranslatingPage));
    it(
      "событие запроса на перевод страницы",
      () => checkClickForTranslatingPage(window, panelForTranslatingPage)
    );
    it(
      "отсутствие возможности выбора одинаковых исходного и целевого языков",
      () => checkNoAbilityToSelectEqualSourceAndTargetLanguages(
        window,
        languages,
        panelForTranslatingPage
      )
    );
  };
  describeTests();
});
