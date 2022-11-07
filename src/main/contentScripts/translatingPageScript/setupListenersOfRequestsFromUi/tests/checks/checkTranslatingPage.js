"use strict";

import { equal as expectEqual } from "assert/strict";

import {
  notTranslated as statesOfPageTranslation_notTranslated,
  translated as statesOfPageTranslation_translated
} from "../../../../../common/js/data/statesOfPageTranslation.js";

import {
  headerForTranslatingPage
} from "../../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import statusesOfResponseOnTranslation from "../../../../../common/js/data/statusesOfResponse/translation.js";

import FakeEventOfIncomingMessage from
  "../../../../../../test/utils/fakeObjects/browser/messaging/FakeEventOfIncomingMessage/index.js";

import checkStateOfPageTranslation from "./utils/checkStateOfPageTranslation.js"
import expectThatTextInElementsIsTranslated from "./utils/expectThatTextInElementsIsTranslated.js";


const checkTranslatingPage = async (options) => {
  const {
    createWindowWithPage,
    senderOfMessageToBackgroundScript,
    limitOfCharactersInTextOfRequestOnTranslation,
    setupListenersOfRequestsFromUi,
    selectorOfElements,
    getSourceTextFromElement,
    translateText
  } = options;

  const fakeEventOfIncomingMessage = new FakeEventOfIncomingMessage();
  const bodyOfDocument = createWindowWithPage().document.body;

  setupListenersOfRequestsFromUi({
    runtime: senderOfMessageToBackgroundScript,
    runtimeOnMessage: fakeEventOfIncomingMessage,
    bodyOfDocument,
    limitOfCharactersInTextOfRequestOnTranslation
  });
  await checkStateOfPageTranslation(fakeEventOfIncomingMessage, statesOfPageTranslation_notTranslated);

  const requestForTranslatingPage = [headerForTranslatingPage, "fr", "cn"];

  const responseOnTranslation = await fakeEventOfIncomingMessage._emit(requestForTranslatingPage);
  const status = responseOnTranslation.s;
  expectEqual(statusesOfResponseOnTranslation_ok, status);

  expectThatTextInElementsIsTranslated(
    bodyOfDocument,
    selectorOfElements,
    getSourceTextFromElement,
    translateText
  );
  await checkStateOfPageTranslation(fakeEventOfIncomingMessage, statesOfPageTranslation_translated);
  return { bodyOfDocument, fakeEventOfIncomingMessage };
};

const statusesOfResponseOnTranslation_ok = statusesOfResponseOnTranslation.ok;

export default checkTranslatingPage;
