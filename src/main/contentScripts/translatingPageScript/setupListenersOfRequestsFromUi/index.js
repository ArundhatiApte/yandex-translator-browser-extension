"use strict";

import bindFunction from "./../../../common/js/utils/bindFunction.js";
import createAcceptorOfRequestsFromUi from "./../utils/AcceptorOfRequestsFromUi/index.js";
import createHandlerOfRequestsFromUi from "./_createHandlerOfRequestsFromUi.js";


const setupListenersOfRequestsFromUi = (options) => {
  /*
  const {
    runtime,
    runtimeOnMessage,
    bodyOfDocument,
    limitOfCharactersInTextOfRequestOnTranslation
  } = options;
  */

  const acceptorOfRequestsFromUi = createAcceptorOfRequestsFromUi(options.runtimeOnMessage);
  const handlerRequestsFromUi = createHandlerOfRequestsFromUi(options);
  _setupListenersOfRequestsFromUi(acceptorOfRequestsFromUi, handlerRequestsFromUi);
};

const _setupListenersOfRequestsFromUi = (acceptorOfRequestsFromUi, handlerRequestsFromUi) => {
  const a = acceptorOfRequestsFromUi;
  const h = handlerRequestsFromUi;

  a.setRequestOnGettingStateOfPageTranslationListener(bindFunction(h, h.onRequestOnGettingStateOfPageTranslation));
  a.setRequestOnTranslatingPageListener(bindFunction(h, h.onRequestOnTranslatingPage));
  a.setRequestOnShowingSourceTextInPageListener(bindFunction(h, h.onRequestOnShowingSourceTextInPage));
  a.setRequestOnShowingTranslatedTextInPageListener(bindFunction(h, h.onRequestOnShowingTranslatedTextInPage));
};

export default setupListenersOfRequestsFromUi;
