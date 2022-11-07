"use strict";

import statusesOfResponseOnTranslation from "../../../common/js/data/statusesOfResponse/translation.js";

import {
  notTranslated as statesOfPageTranslation_notTranslated,
  translated as statesOfPageTranslation_translated,
  translatedAndSourceTextShown as statesOfPageTranslation_translatedAndSourceTextShown
} from "../../../common/js/data/statesOfPageTranslation.js";

import createConnectionToBackgroundScript from "../utils/createConnectionToBackgroundScript.js";
import iterateThroughTextNodesThatCanContainWords from "../utils/iterateThroughTextNodesThatCanContainWords/index.js";
import createRewriterOfTextInDomElement from "../utils/RewriterOfTextInDomElement/index.js";


const createHandlerRequestsFromUi = (options) => {
  /*
  const {
    runtime,
    bodyOfDocument,
    limitOfCharactersInTextOfRequestOnTranslation
  } = options;
  */

  return {
    [_bodyOfDocument]: options.bodyOfDocument,
    [_currentStateOfPageTranslation]: statesOfPageTranslation_notTranslated,
    [_connectionToBackgroundScript]: createConnectionToBackgroundScript(options.runtime),
    [_rewriterOfTextInDomElement]: createRewriterOfTextInDomElement({
      iterateThroughTextNodesThatCanContainWords,
      maxCountOfCharactersInTextOfRequestOnTranslation: options.limitOfCharactersInTextOfRequestOnTranslation
    }),

    onRequestOnGettingStateOfPageTranslation(sendState) {
      return sendState(this[_currentStateOfPageTranslation]);
    },

    async onRequestOnTranslatingPage(codeOfSourceLanguage, codeOfTargetLanguage, sendResponse) {
      if (this[_currentStateOfPageTranslation] !== statesOfPageTranslation_notTranslated) {
        return;
      }
      const resultsWithStatusesOfTranslations = await
      this[_rewriterOfTextInDomElement].rewriteTextInElementWithTranslatedAndSaveSource(
        this[_bodyOfDocument],
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        this[_connectionToBackgroundScript]
      );
      _sendStatusOfResponseOnTranslationAndChangeStateOfPageTranslation(
        this,
        resultsWithStatusesOfTranslations,
        sendResponse
      );
    },

    onRequestOnShowingSourceTextInPage(sendOkStatus) {
      if (this[_currentStateOfPageTranslation] !== statesOfPageTranslation_translated) {
        return;
      }
      this[_rewriterOfTextInDomElement].showSourceTextInElement(this[_bodyOfDocument]);
      this[_currentStateOfPageTranslation] = statesOfPageTranslation_translatedAndSourceTextShown;
      sendOkStatus();
    },

    onRequestOnShowingTranslatedTextInPage(sendOkStatus) {
      if (this[_currentStateOfPageTranslation] !== statesOfPageTranslation_translatedAndSourceTextShown) {
        return;
      }
      this[_rewriterOfTextInDomElement].showTranslatedTextInElement(this[_bodyOfDocument]);
      this[_currentStateOfPageTranslation] = statesOfPageTranslation_translated;
      sendOkStatus();
    }
  };
};

const _bodyOfDocument = "_";
const _currentStateOfPageTranslation = "_1";
const _connectionToBackgroundScript = "_2";
const _rewriterOfTextInDomElement = "_3";

const _sendStatusOfResponseOnTranslationAndChangeStateOfPageTranslation = (
  handlerRequestsFromUi,
  resultsWithStatusesOfTranslations,
  sendResponse
) => {
  let succesResult = null;
  let lastResultOfFail = null;

  for (const result of resultsWithStatusesOfTranslations) {
    if (result.s === statusesOfResponseOnTranslation_ok) {
      succesResult = result;
      continue;
    }
    lastResultOfFail = result;
  }

  if (succesResult !== null) {
    handlerRequestsFromUi[_currentStateOfPageTranslation] = statesOfPageTranslation_translated;
    sendResponse(succesResult);
  }
  else {
    sendResponse(lastResultOfFail);
  }
};

const statusesOfResponseOnTranslation_ok = statusesOfResponseOnTranslation.ok;

export default createHandlerRequestsFromUi;
