"use strict";

import {
  translatedOrSourceText as symbolsForTextNode_translatedOrSourceText,
  state as symbolsForTextNode_state
} from "./_symbolsForTextNode.js";


const replaceTextInElement = (
  iterateThroughTextNodesThatCanContainWords,
  domElement,
  searchedStateOfTextNode,
  targetStateOfTextNode
) => {
  return iterateThroughTextNodesThatCanContainWords(domElement, (textNode) => {
    if (textNode[symbolsForTextNode_state] === searchedStateOfTextNode) {
      const cachedText = textNode[symbolsForTextNode_translatedOrSourceText];
      if (cachedText) {
        const currentText = textNode.nodeValue;
        textNode[symbolsForTextNode_translatedOrSourceText] = currentText;
        textNode.nodeValue = cachedText;
        textNode[symbolsForTextNode_state] = targetStateOfTextNode;
      }
    }
  });
};

export default replaceTextInElement;
