"use strict";

import uWebSockets from "uWebSockets.js";

import StarterOfUWebSocketsServer from "../../utils/StarterOfUWebSocketsServer.js";
import AcceptorOfRequestsToTranslationService from "../AcceptorOfRequestsToTranslationService/index.js";
import setListenersOnAcceptorOfRequestsToTranslationService from
  "../setListenersOnAcceptorOfRequestsToTranslationService/index.js";


const HttpServerOfTranslationService = class {
  constructor(options) {
    const {
      uWebSocketsServer = new uWebSockets.App({}),
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments,
      translator,
      validApiKeys,
      limitOfCharactersInText
    } = options;

    this[_starter] = new StarterOfUWebSocketsServer(uWebSocketsServer);
    const acceptor = new AcceptorOfRequestsToTranslationService({
      uWebSocketsServer,
      urlForGettingSupportedLanguages,
      urlForTranslatingTextFragments
    });
    setListenersOnAcceptorOfRequestsToTranslationService(acceptor, {
      translator,
      validApiKeys,
      limitOfCharactersInText
    });
  }

  listen(port) {
    return this[_starter].listen(port);
  }

  close() {
    return this[_starter].close();
  }
};

const _starter = Symbol();

export default HttpServerOfTranslationService;
