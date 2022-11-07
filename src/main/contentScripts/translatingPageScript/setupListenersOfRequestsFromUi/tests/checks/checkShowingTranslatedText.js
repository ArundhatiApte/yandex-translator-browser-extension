"use strict";

import {
  messageForShowingTranslatedText
} from "../../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import defaultSuccesStatus from "../../../../../common/js/data/messaging/defaultSuccesStatus.js";

import {
  translated as statesOfPageTranslation_translated
} from "../../../../../common/js/data/statesOfPageTranslation.js";

import checkShowingSourceText from "./checkShowingSourceText.js";
import emitIncomingRequestThenCheckStatusInResponse from "./utils/emitIncomingRequestThenCheckStatusInResponse.js";
import expectThatTextInElementsIsTranslated from "./utils/expectThatTextInElementsIsTranslated.js";
import checkStateOfPageTranslation from "./utils/checkStateOfPageTranslation.js";


const checkShowingTranslatedText = async (options) => {
  const { bodyOfDocument, fakeEventOfIncomingMessage } = await checkShowingSourceText(options);
  const {
    selectorOfElements,
    getSourceTextFromElement,
    translateText
  } = options;
  await emitIncomingRequestThenCheckStatusInResponse(
    fakeEventOfIncomingMessage,
    messageForShowingTranslatedText,
    defaultSuccesStatus
  );
  expectThatTextInElementsIsTranslated(
    bodyOfDocument,
    selectorOfElements,
    getSourceTextFromElement,
    translateText
  );
  await checkStateOfPageTranslation(fakeEventOfIncomingMessage, statesOfPageTranslation_translated);
};

export default checkShowingTranslatedText;
