"use strict";

import createFakeTextNodesFromStrings from "./utils/createFakeTextNodesFromStrings.js";

import {
  translateTextFragmentsToUpperCase,
  upperCasingStringFakeClientOfTranslatorService
} from "./utils/upperCasingStringFakeClientOfTranslatorService.js";

import createIteratingThroughNodesFn from "./utils/createIteratingThroughNodesFn.js";
import expectThatTextNodesContainStrings from "./utils/expectThatTextNodesContainStrings.js";


const checkShowingSourceText = async (createRewriterOfTextInDomElement) => {
  const sourceTextFragments = ["апельсин", "банан", "вишня", "грейпфрут", "дыня"];
  const translatedTextFragments = translateTextFragmentsToUpperCase(sourceTextFragments);

  const fakeTextNodes = createFakeTextNodesFromStrings(sourceTextFragments);
  const iterateThroughTextNodes = createIteratingThroughNodesFn(fakeTextNodes);

  const rewriter = createRewriterOfTextInDomElement({
    iterateThroughTextNodesThatCanContainWords: iterateThroughTextNodes,
    maxCountOfCharactersInTextOfRequestOnTranslation: 14
  });

  const startNode = null;
  const codeOfSourceLanguage = "sl";
  const codeOfTargetLanguage = "tl";

  await rewriter.rewriteTextInElementWithTranslatedAndSaveSource(
    startNode,
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    upperCasingStringFakeClientOfTranslatorService
  );
  expectThatTextNodesContainStrings(fakeTextNodes, translatedTextFragments);

  rewriter.showSourceTextInElement(startNode);
  expectThatTextNodesContainStrings(fakeTextNodes, sourceTextFragments);

  return {
    translatedTextFragments,
    fakeTextNodes,
    rewriter,
    startNode
  };
};

export default checkShowingSourceText;
