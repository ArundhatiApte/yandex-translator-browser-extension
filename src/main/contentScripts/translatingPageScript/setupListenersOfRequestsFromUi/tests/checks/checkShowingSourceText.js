"use strict";

import {
  messageForShowingSourceText
} from "../../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import defaultSuccesStatus from "../../../../../common/js/data/messaging/defaultSuccesStatus.js";

import {
  translatedAndSourceTextShown as statesOfPageTranslation_translatedAndSourceTextShown
} from "../../../../../common/js/data/statesOfPageTranslation.js";

import checkTranslatingPage from "./checkTranslatingPage.js";
import emitIncomingRequestThenCheckStatusInResponse from "./utils/emitIncomingRequestThenCheckStatusInResponse.js";
import expectThatElementsContainSourceText from "./utils/expectThatElementsContainSourceText.js";
import checkStateOfPageTranslation from "./utils/checkStateOfPageTranslation.js";


const checkShowingSourceText = async (options) => {
  const dependencies = await checkTranslatingPage(options);
  const { bodyOfDocument, fakeEventOfIncomingMessage } = dependencies;
  const { selectorOfElements, getSourceTextFromElement } = options;

  await emitIncomingRequestThenCheckStatusInResponse(
    fakeEventOfIncomingMessage,
    messageForShowingSourceText,
    defaultSuccesStatus
  );
  expectThatElementsContainSourceText(bodyOfDocument, selectorOfElements, getSourceTextFromElement);
  await checkStateOfPageTranslation(
    fakeEventOfIncomingMessage,
    statesOfPageTranslation_translatedAndSourceTextShown
  );
  return dependencies;
};

export default checkShowingSourceText;
