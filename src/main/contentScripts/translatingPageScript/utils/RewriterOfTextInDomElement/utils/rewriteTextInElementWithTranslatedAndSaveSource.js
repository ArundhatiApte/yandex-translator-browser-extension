"use strict";

import statusesOfResponseOnTranslation from "../../../../../common/js/data/statusesOfResponse/translation.js";
const statusOfTranslation_succes = statusesOfResponseOnTranslation.ok;

import {
  translated as statesOfTextNode_translated,
  translatedAndSourceShown as statesOfTextNode_translatedAndSourceShown
} from "./statesOfTextNode.js";

import {
  translatedOrSourceText as symbolsForTextNode_translatedOrSourceText,
  state as symbolsForTextNode_state
} from "./_symbolsForTextNode.js";


const rewriteTextInElementWithTranslatedAndSaveSource = async (
  iterateThroughTextNodesThatCanContainWords,
  maxCountOfCharactersInTextOfRequestOnTranslation,
  domElement,
  coudeOfSourceLanguage,
  codeOfTargetLanguage,
  clientOfTranslatorService
) => {
  let currentTotalCharactersInTextForOneRequest = 0;

  const tasksOnTranslationAndRewritingTextInNodes = [];
  let textFragmentsForOneRequest = [];
  let textNodesForOneRequest = [];
  const resultsWithStatuses = [];

  iterateThroughTextNodesThatCanContainWords(domElement, (textNode) => {
    const textFromNode = textNode.nodeValue;
    const length = textFromNode.length;
    if (length > maxCountOfCharactersInTextOfRequestOnTranslation) {
      return;
    }

    currentTotalCharactersInTextForOneRequest += length;
    if (currentTotalCharactersInTextForOneRequest >= maxCountOfCharactersInTextOfRequestOnTranslation) {
      if (textFragmentsForOneRequest.length !== 0) {
        tasksOnTranslationAndRewritingTextInNodes.push(_sendRequestThenRewriteTextNodesAndAddStatusOfResponse(
          coudeOfSourceLanguage,
          codeOfTargetLanguage,
          clientOfTranslatorService,
          textFragmentsForOneRequest,
          textNodesForOneRequest,
          resultsWithStatuses
        ));

        currentTotalCharactersInTextForOneRequest = length;
        textFragmentsForOneRequest = [textFromNode];
        textNodesForOneRequest = [textNode];
      }
    } else {
      textFragmentsForOneRequest.push(textFromNode);
      textNodesForOneRequest.push(textNode);
    }
  });

  if (textNodesForOneRequest.length !== 0) {
    tasksOnTranslationAndRewritingTextInNodes.push(_sendRequestThenRewriteTextNodesAndAddStatusOfResponse(
      coudeOfSourceLanguage,
      codeOfTargetLanguage,
      clientOfTranslatorService,
      textFragmentsForOneRequest,
      textNodesForOneRequest,
      resultsWithStatuses
    ));
  }

  await Promise.all(tasksOnTranslationAndRewritingTextInNodes);
  return resultsWithStatuses;
};

const _sendRequestThenRewriteTextNodesAndAddStatusOfResponse = async (
  coudeOfSourceLanguage,
  codeOfTargetLanguage,
  clientOfTranslatorService,
  textFragments, // параллельные списки
  textNodes,
  resultsWithStatuses
) => {
  const result = await clientOfTranslatorService.requestTranslationOfTextFragments(
    coudeOfSourceLanguage,
    codeOfTargetLanguage,
    textFragments
  );

  const status = result.s;
  if (status === statusOfTranslation_succes) {
    const translatedTextFragments = result.r;
    delete result.r;
    _rewriteTextToTranslatedInTextNodes(textNodes, translatedTextFragments);
  }
  resultsWithStatuses.push(result);
};

const _rewriteTextToTranslatedInTextNodes = (textNodes, parallelStringsWithTranslation) => {
  const countOfNodes = textNodes.length;
  for (let i = 0; i < countOfNodes; i += 1) {
    _rewriteTextToTranslatedInTextNode(textNodes[i], parallelStringsWithTranslation[i]);
  }
};

const _rewriteTextToTranslatedInTextNode = (textNode, stringWithTranslation) => {
  textNode[symbolsForTextNode_state] = statesOfTextNode_translated;
  textNode[symbolsForTextNode_translatedOrSourceText] = textNode.nodeValue;
  textNode.nodeValue = stringWithTranslation;
};

export default rewriteTextInElementWithTranslatedAndSaveSource;
