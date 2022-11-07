"use strict";

import emptyFunction from "../../../../../../main/common/js/utils/emptyFunction.js";
import checkThatListenerOfEventIsFunction from
  "../../../../../../main/common/js/utils/checkThatListenerOfEventIsFunction.js";

import _setEmittingEventsListener from "./utils/setEmittingEventsListener/setEmittingEventsListener.js";
import {
  _onMalformedRequest,
  _onRequestForGettingSupportedLanguages,
  _onRequestForTranslatingTextFragments
} from "./utils/namesOfPrivateProperties.js";


const AcceptorOfRequestsToTranslationService = class {
  constructor(options) {
    const {
      uWebSocketsServer,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments
    } = options;

    this[_onMalformedRequest] = emptyFunction;
    this[_onRequestForGettingSupportedLanguages] = emptyFunction;
    this[_onRequestForTranslatingTextFragments] = emptyFunction;

    _setEmittingEventsListener(this, uWebSocketsServer, urlForGettingSupportedLanguages, urlForTranslatingTextFragments);
  }

  setMalformedRequestListener(listener) {
    checkThatListenerOfEventIsFunction(listener);
    this[_onMalformedRequest] = listener;
  }

  setRequestForGettingSupportedLanguagesListener(listener) {
    checkThatListenerOfEventIsFunction(listener);
    this[_onRequestForGettingSupportedLanguages] = listener;
  }

  setRequestForTranslatingTextFragmentsListener(listener) {
    checkThatListenerOfEventIsFunction(listener);
    this[_onRequestForTranslatingTextFragments] = listener;
  }
};

export default AcceptorOfRequestsToTranslationService;
