"use strict";

import emptyFunction from "../../../../common/js/utils/emptyFunction.js";
import checkThatListenerOfEventIsFunction from "../../../../common/js/utils/checkThatListenerOfEventIsFunction.js";

import {
  messageForGettingStateOfPage,
  headerForTranslatingPage,
  messageForShowingSourceText,
  messageForShowingTranslatedText
} from "../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import defaultSuccesStatus from "../../../../common/js/data/messaging/defaultSuccesStatus.js";


const createAcceptorOfRequestsFromUi = (eventOfIncomingMessage) => {
  const acceptorOfRequestsFromUi = {
    [_onRequestForGettingStateOfPageTranslation]: emptyFunction,
    [_onRequestForTranslatingPage]: emptyFunction,
    [_onRequestForShowingSourceTextInPage]: emptyFunction,
    [_onRequestForShowingTranslatedTextInPage]: emptyFunction,

    setRequestOnGettingStateOfPageTranslationListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForGettingStateOfPageTranslation] = listener;
    },
    setRequestOnTranslatingPageListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForTranslatingPage] = listener;
    },
    setRequestOnShowingSourceTextInPageListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForShowingSourceTextInPage] = listener;
    },
    setRequestOnShowingTranslatedTextInPageListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForShowingTranslatedTextInPage] = listener;
    }
  };
  _setEmittingEventByIncomingMessageListener(eventOfIncomingMessage, acceptorOfRequestsFromUi);
  return acceptorOfRequestsFromUi;
};

const _onRequestForGettingStateOfPageTranslation = "_";
const _onRequestForTranslatingPage = "_1";
const _onRequestForShowingSourceTextInPage = "_2";
const _onRequestForShowingTranslatedTextInPage = "_3";

const _setEmittingEventByIncomingMessageListener = (() => {
  const setEmittingEventByIncomingMessageListener = (eventOfIncomingMessage, acceptorOfRequestsFromUi) => {
    return eventOfIncomingMessage.addListener(_emitEventByIncomingMessage.bind(acceptorOfRequestsFromUi));
  };

  const _emitEventByIncomingMessage = function(message, sender, sendResponse) {
    if (Array.isArray(message) && message[0] === headerForTranslatingPage) {
      _emitRequestForTranslatingPage(this, message, sendResponse);
    }
    else if (message === messageForGettingStateOfPage) {
      _emitRequestForGettingStateOfPageTranslation(this, sendResponse);
    }
    else if (message === messageForShowingSourceText) {
      _emitRequestForShowingSourceTextInPage(this, sendResponse);
    }
    else if (message === messageForShowingTranslatedText) {
      _emitRequestForShowingTranslatedTextInPage(this, sendResponse);
    }
    else {
      return;
    }
    return _canSendResponseAsync;
  };

  const _canSendResponseAsync = true;

  const _emitRequestForTranslatingPage = (acceptorOfRequestsFromUi, message, sendResponse) => {
    const [ , codeOfSourceLanguage, codeOfTargetLanguage] = message;
    const sendStatusOfResult = sendResponse;

    acceptorOfRequestsFromUi[_onRequestForTranslatingPage](
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      sendStatusOfResult
    );
  };

  const _emitRequestForGettingStateOfPageTranslation = (acceptorOfRequestsFromUi, sendResponse) => {
    return acceptorOfRequestsFromUi[_onRequestForGettingStateOfPageTranslation](sendResponse);
  };

  const _emitRequestForShowingSourceTextInPage = (acceptorOfRequestsFromUi, sendResponse) => {
    return acceptorOfRequestsFromUi[_onRequestForShowingSourceTextInPage](
      _createSendingOkStatusFn(sendResponse)
    );
  };

  const _emitRequestForShowingTranslatedTextInPage = (acceptorOfRequestsFromUi, sendResponse) => {
    return acceptorOfRequestsFromUi[_onRequestForShowingTranslatedTextInPage](
      _createSendingOkStatusFn(sendResponse)
    );
  };

  const _createSendingOkStatusFn = (sendResponse) => {
    return sendResponse.bind(null, defaultSuccesStatus);
  };

  return setEmittingEventByIncomingMessageListener;
})();

export default createAcceptorOfRequestsFromUi;
