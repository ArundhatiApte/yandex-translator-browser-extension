"use strict";

import { ok as expectTrue } from "assert/strict";

import statusesOfResponseOnTranslation from
  "../../../../../../../common/js/data/statusesOfResponse/translation.js";
const status_ok = statusesOfResponseOnTranslation.ok;

import createFakeTextNodesFromStrings from "../utils/createFakeTextNodesFromStrings.js";

import {
  translateTextFragmentToUpperCase,
  upperCasingStringFakeClientOfTranslatorService
} from "../utils/upperCasingStringFakeClientOfTranslatorService.js";

import createIteratingThroughNodesFn from "../utils/createIteratingThroughNodesFn.js";
import expectThatContentInTextNodesIsTranslated from "../utils/expectThatContentInTextNodesIsTranslated.js";


const checkRewritingTextInElementWithTranslated = async (createRewriterOfTextInDomElement) => {
  const sourceTextFragments = ["the", "list", "of", "strings", "список", "строк"];
  const fakeTextNodes = createFakeTextNodesFromStrings(sourceTextFragments);
  const iterateThroughTextNodes = createIteratingThroughNodesFn(fakeTextNodes);

  const rewriter = createRewriterOfTextInDomElement({
    iterateThroughTextNodesThatCanContainWords: iterateThroughTextNodes,
    maxCountOfCharactersInTextOfRequestOnTranslation: 14
  });

  const startNode = null;
  const codeOfSourceLanguage = "sl";
  const codeOfTargetLanguage = "tl";

  const resultsWithStatuses = await rewriter.rewriteTextInElementWithTranslatedAndSaveSource(
    startNode,
    codeOfSourceLanguage,
    codeOfTargetLanguage,
    upperCasingStringFakeClientOfTranslatorService
  );

  expectThatContentInTextNodesIsTranslated(fakeTextNodes, sourceTextFragments, translateTextFragmentToUpperCase);
  expectTrue(resultsWithStatuses.every(r => r.s === status_ok));
};

export default checkRewritingTextInElementWithTranslated;
