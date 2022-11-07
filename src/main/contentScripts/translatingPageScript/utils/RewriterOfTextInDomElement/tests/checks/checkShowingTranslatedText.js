"use strict";

import checkShowingSourceText from "./checkShowingSourceText.js";
import expectThatTextNodesContainStrings from "./utils/expectThatTextNodesContainStrings.js";


const checkShowingTranslatedText = async (createRewriterOfTextInDomElement) => {
  const {
    translatedTextFragments,
    fakeTextNodes,
    rewriter,
    startNode
  } = await checkShowingSourceText(createRewriterOfTextInDomElement);

  rewriter.showTranslatedTextInElement(startNode);
  expectThatTextNodesContainStrings(fakeTextNodes, translatedTextFragments);
};

export default checkShowingTranslatedText;
