"use strict";

import bindFunction from "../../../../../../main/common/js/utils/bindFunction.js";
import HandlerOfRequests from "./_HandlerOfRequests/index.js";


const setListenersOnAcceptorOfRequestsToTranslationService = (acceptor, options) => {
  const {
    translator,
    validApiKeys,
    limitOfCharactersInText
  } = options;
  const h = new HandlerOfRequests(translator, validApiKeys, limitOfCharactersInText);
  _setListenersOfRequests(acceptor, h);
};

const _setListenersOfRequests = (a, h) => {
  a.setMalformedRequestListener(bindFunction(h, h.onMalformedRequest));
  a.setRequestForGettingSupportedLanguagesListener(bindFunction(h, h.onRequestForGettingSupportedLanguages));
  a.setRequestForTranslatingTextFragmentsListener(bindFunction(h, h.onRequestForTranslatingTextFragments));
};

export default setListenersOnAcceptorOfRequestsToTranslationService;
