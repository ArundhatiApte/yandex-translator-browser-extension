"use strict";

import { equal as expectEqual } from "assert/strict";


const expectThatElementsContainSourceText = (
  bodyOfDocument,
  selectorOfElements,
  getSourceTextFromElement
) => {
  const elements = bodyOfDocument.querySelectorAll(selectorOfElements);
  if (elements === null) {
    throw new Error("Отсутствуют элементы документа.");
  }
  for (const element of elements) {
    expectThatElementContainsSourceText(element, getSourceTextFromElement);
  }
};

const expectThatElementContainsSourceText = (element, getSourceTextFromElement) => {
  return expectEqual(getSourceTextFromElement(element), element.textContent);
};

export default expectThatElementsContainSourceText;
