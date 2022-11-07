"use strict";

import { equal as expectEqual } from "assert/strict";


const expectThatTextInElementsIsTranslated = (
  bodyOfDocument,
  selectorOfElements,
  getSourceTextFromElement,
  translateText
) => {
  const elements = bodyOfDocument.querySelectorAll(selectorOfElements);
  if (elements === null) {
    throw new Error("Отсутствуют элементы документа.");
  }
  for (const element of elements) {
    expectThatTextInElementIsTranslated(element, getSourceTextFromElement, translateText);
  }
};

const expectThatTextInElementIsTranslated = (element, getSourceTextFromElement, translateText) => {
  return expectEqual(
    translateText(getSourceTextFromElement(element)),
    element.textContent
  );
};

export default expectThatTextInElementsIsTranslated;
