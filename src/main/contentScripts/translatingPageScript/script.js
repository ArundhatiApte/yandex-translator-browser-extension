"use strict";

import config from "../../common/js/data/translationService/usedForBuild.js";
import setupListenersOfRequestsFromUi from "./setupListenersOfRequestsFromUi/index.js";


setupListenersOfRequestsFromUi({
  runtime: chrome.runtime,
  runtimeOnMessage: chrome.runtime.onMessage,
  bodyOfDocument: window.document.body,
  limitOfCharactersInTextOfRequestOnTranslation: config.limitOfCharactersInTextOfRequestOnTranslation
});
