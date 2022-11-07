"use strict";

import createFakeTextNodesFromStrings from "../../utils/createFakeTextNodesFromStrings.js";

import {
  translateTextFragmentToUpperCase,
  translateTextFragmentsToUpperCase,
  upperCasingStringFakeClientOfTranslatorService
} from "../../utils/upperCasingStringFakeClientOfTranslatorService.js";

import createIteratingThroughNodesFn from "../../utils/createIteratingThroughNodesFn.js";
import expectThatContentInTextNodesIsTranslated from "../../utils/expectThatContentInTextNodesIsTranslated.js";
import LimitingLengthOfTextFakeClientOfTranslatorService from  "./LimitingLengthOfTextFakeClientOfTranslatorService.js";


const checkLimitingTotalCountOfCharactersInRequest = (createRewriterOfTextInDomElement) => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxCharactersOfTextInRequest = 40;
      const sourceTextFragments = createStringsWithIncreasingThemLength(maxCharactersOfTextInRequest);
      const fakeTextNodes = createFakeTextNodesFromStrings(sourceTextFragments);
      const iterateThroughTextNodes = createIteratingThroughNodesFn(fakeTextNodes);

      const clientOfTranslatorService = new LimitingLengthOfTextFakeClientOfTranslatorService(
        maxCharactersOfTextInRequest,
        translateTextFragmentsToUpperCase,
        reject
      );

      const rewriter = createRewriterOfTextInDomElement({
        iterateThroughTextNodesThatCanContainWords: iterateThroughTextNodes,
        maxCountOfCharactersInTextOfRequestOnTranslation: maxCharactersOfTextInRequest
      });

      const startNode = null;
      const codeOfSourceLanguage = "sl";
      const codeOfTargetLanguage = "tl";

      await rewriter.rewriteTextInElementWithTranslatedAndSaveSource(
        startNode,
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        clientOfTranslatorService
      );

      expectThatContentInTextNodesIsTranslated(fakeTextNodes, sourceTextFragments, translateTextFragmentToUpperCase);
      resolve();
    } catch(error) {
      reject(error);
    }
  })
};

const createStringsWithIncreasingThemLength = (maxLength) => {
  const oneChar = "a";
  const out = [oneChar];

  for (let i = 1; i <= maxLength; i += 1) {
    out.push(oneChar.repeat(i));
  }
  return out;
};

export default checkLimitingTotalCountOfCharactersInRequest;
