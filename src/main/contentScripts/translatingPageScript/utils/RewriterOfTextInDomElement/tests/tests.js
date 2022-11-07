"use strict";

import { createAndAddTestsFromTable } from "../../../../../../test/utils/addingTestsFromTable.js";

import createRewriterOfTextInDomElement from "./../index.js";

import checkRewritingTextInElementWithTranslated from
  "./checks/rewritingTextInElementWithTranslated/checkRewritingTextInElementWithTranslated.js";
import checkLimitingTotalCountOfCharactersInRequest from
  "./checks/rewritingTextInElementWithTranslated/limitingTotalCountOfCharactersInRequest/check.js";

import checkShowingSourceText from "./checks/checkShowingSourceText.js";
import checkShowingTranslatedText from "./checks/checkShowingTranslatedText.js";


const createTestingRewriterFn = (checkRewriterOfTextInElement) => {
  return checkRewriterOfTextInElement.bind(null, createRewriterOfTextInDomElement);
};

describe("тест перезаписывателя текста на странице", () => {
  describe("перевод", () => (
    createAndAddTestsFromTable(createTestingRewriterFn, it, [
      ["перезапись на переведённый текст", checkRewritingTextInElementWithTranslated],
      ["соблюдение ограничения кол-ва символов текста в запросе", checkLimitingTotalCountOfCharactersInRequest]
    ])
  ));

  createAndAddTestsFromTable(createTestingRewriterFn, it, [
    ["показ исходного текста", checkShowingSourceText],
    ["показ переведённого текста", checkShowingTranslatedText]
  ]);
});
