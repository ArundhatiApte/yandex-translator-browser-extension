"use strict";

import canStringContainWords from "./canStringContainWords/index.js";


// startNode имеет тип либо элемента, либо фагмента, либо документа
const iterateThroughTextNodesThatCanContainWords = (startNode, processNode) => {
  const childNodes = startNode.childNodes;
  if (childNodes === null) {
    return;
  }

  for (const childNode of childNodes) {
    const typeOfNode = childNode.nodeType;

    if (typeOfNode === nodeType_element) {
      const nameOfTagInUpperCase = childNode.tagName;

      if (isItScriptOrStyle(nameOfTagInUpperCase)) {
        continue;
      }
      if (isItIframeOrFrame(nameOfTagInUpperCase)) {
        iterateThroughTextNodesThatCanContainWords(childNode.contentWindow.document.body, processNode);
        continue;
      }
      iterateThroughTextNodesThatCanContainWords(childNode, processNode);
      continue;
    }

    if (typeOfNode === nodeType_text) {
      if (canStringContainWords(childNode.nodeValue)) {
        processNode(childNode);
      }
      continue;
    }

    if (typeOfNode === nodeType_fragment) {
      iterateThroughTextNodesThatCanContainWords(childNode, processNode);
    }
  }
};

const nodeType_element = 1;
const nodeType_text = 3;
const nodeType_fragment = 11;

const isItScriptOrStyle = (nameOfTagInUpperCase) => {
  return nameOfTagInUpperCase === "SCRIPT" || nameOfTagInUpperCase === "STYLE";
};

const isItIframeOrFrame = (nameOfTagInUpperCase) => {
  return nameOfTagInUpperCase === "IFRAME" || nameOfTagInUpperCase === "FRAME";
};

export default iterateThroughTextNodesThatCanContainWords;
