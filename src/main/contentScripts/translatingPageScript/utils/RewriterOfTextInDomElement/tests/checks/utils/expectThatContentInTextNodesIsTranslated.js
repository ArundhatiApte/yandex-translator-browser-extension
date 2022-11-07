"use strict";

import { equal as expectEqual } from "assert/strict";


const expectThatContentInTextNodesIsTranslated = (
  textNodes,
  parallelSourceTextFragments,
  translateTextFakely
) => {
  let i = textNodes.length;
  expectEqual(i, parallelSourceTextFragments.length);

  i -= 1;
  for (; i; i -= 1) {
    const textNode = textNodes[i];
    const sourceText = parallelSourceTextFragments[i];
    expectThatContentInTextNodeIsTranslated(textNode, sourceText, translateTextFakely);
  }
};

const expectThatContentInTextNodeIsTranslated = (textNode, sourceText, translateTextFakely) => {
  return expectEqual(translateTextFakely(sourceText), textNode.nodeValue);
};

export default expectThatContentInTextNodesIsTranslated;
