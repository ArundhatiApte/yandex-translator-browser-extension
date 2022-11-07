"use strict";

import {
  translated as statesOfTextNode_translated,
  translatedAndSourceShown as statesOfTextNode_translatedAndSourceShown
} from "./utils/statesOfTextNode.js";

import
  _rewriteTextInElementWithTranslatedAndSaveSource
from "./utils/rewriteTextInElementWithTranslatedAndSaveSource.js";

import _replaceTextInElement from "./utils/replaceTextInElement.js";


const createRewriterOfTextInDomElement = (options) => {
  const {
    iterateThroughTextNodesThatCanContainWords,
    maxCountOfCharactersInTextOfRequestOnTranslation
  } = options;

  if (typeof iterateThroughTextNodesThatCanContainWords !== "function") {
    throw new TypeError("Функция обхода текстовых узлов");
  }
  if (isNaN(maxCountOfCharactersInTextOfRequestOnTranslation)) {
    throw new TypeError("Максимальное кол-во символов в тексте запроса не число");
  }

  return {
    [_iterateThroughTextNodesThatCanContainWords]: iterateThroughTextNodesThatCanContainWords,
    [_maxCountOfCharactersInTextOfRequestOnTranslation]:
      maxCountOfCharactersInTextOfRequestOnTranslation,

    rewriteTextInElementWithTranslatedAndSaveSource(
      domElement,
      coudeOfSourceLanguage,
      codeOfTargetLanguage,
      clientOfTranslatorService
    ) {
      return _rewriteTextInElementWithTranslatedAndSaveSource(
        this[_iterateThroughTextNodesThatCanContainWords],
        this[_maxCountOfCharactersInTextOfRequestOnTranslation],
        domElement,
        coudeOfSourceLanguage,
        codeOfTargetLanguage,
        clientOfTranslatorService
      );
    },

    showSourceTextInElement(domElement) {
      return _replaceTextInElement(
        this[_iterateThroughTextNodesThatCanContainWords],
        domElement,
        statesOfTextNode_translated,
        statesOfTextNode_translatedAndSourceShown
      );
    },

    showTranslatedTextInElement(domElement) {
      return _replaceTextInElement(
        this[_iterateThroughTextNodesThatCanContainWords],
        domElement,
        statesOfTextNode_translatedAndSourceShown,
        statesOfTextNode_translated
      );
    }
  };
};

const _iterateThroughTextNodesThatCanContainWords = "_";
const _maxCountOfCharactersInTextOfRequestOnTranslation = "_1";

export default createRewriterOfTextInDomElement;
