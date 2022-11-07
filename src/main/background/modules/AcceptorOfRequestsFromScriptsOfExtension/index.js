"use strict";

import emptyFunction from "./../../../common/js/utils/emptyFunction.js";
import checkThatListenerOfEventIsFunction from "./../../../common/js/utils/checkThatListenerOfEventIsFunction.js";

import {
  messageForGettingNameOfCssClassForCurrentUiTheme,
  messageForGettingSettingsByPopupPage,
  messageForGettingSettingsBySettingsPage,
  headerForTranslationOfTextFragments as headerForTranslatingTextFragments,
  headerForUpdatingSettings
} from "./../../../common/js/data/messaging/messagesToBackgroundScript.js";

import defaultSuccesStatus from "./../../../common/js/data/messaging/defaultSuccesStatus.js";


const createAcceptorOfRequestsFromScriptsOfExtension = function(eventOfIncomingMessage) {
  const acceptorOfRequests = {
    [_onRequestForGettingNameOfCssClassForCurrentUiTheme]: emptyFunction,
    [_onRequestForGettingSettingsByPopupPage]: emptyFunction,
    [_onRequestForGettingSettingsBySettingsPage]: emptyFunction,
    [_onRequestForTranslatingTextFragments]: emptyFunction,
    [_onRequestForUpdatingSettings]: emptyFunction,

    setRequestForGettingNameOfCssClassForCurrentUiTheme(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForGettingNameOfCssClassForCurrentUiTheme] = listener;
    },

    setRequestForGettingSettingsByPopupPageListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForGettingSettingsByPopupPage] = listener;
    },

    setRequestForGettingSettingsBySettingsPageListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForGettingSettingsBySettingsPage] = listener;
    },

    setRequestForTranslatingTextFragmentsListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForTranslatingTextFragments] = listener;
    },

    setRequestForUpdatingSettingsListener(listener) {
      checkThatListenerOfEventIsFunction(listener);
      this[_onRequestForUpdatingSettings] = listener;
    }
  };
  _setEmittingEventByIncomingMessageListener(eventOfIncomingMessage, acceptorOfRequests);
  return acceptorOfRequests;
};

const _onRequestForGettingNameOfCssClassForCurrentUiTheme = "_";
const _onRequestForGettingSettingsByPopupPage = "_1";
const _onRequestForGettingSettingsBySettingsPage = "_2";
const _onRequestForTranslatingTextFragments = "_3";
const _onRequestForUpdatingSettings = "_4";

const _setEmittingEventByIncomingMessageListener = (eventOfIncomingMessage, acceptorOfRequests) => (
  eventOfIncomingMessage.addListener(_emitEventByIncomingMessage.bind(acceptorOfRequests))
);

const _emitEventByIncomingMessage = (() => {
  const emitEventByIncomingMessage = function(message, sender, sendResponse) {
    const a = this;

    switch (message) {
      case messageForGettingNameOfCssClassForCurrentUiTheme:
        // везде return _emitSomeEvent для поддержки ассинхронного ответа
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage#addlistener_syntax
        return _emitRequestForGettingValue(
          a,
          _onRequestForGettingNameOfCssClassForCurrentUiTheme,
          sendResponse
        );
      case messageForGettingSettingsByPopupPage:
        return _emitRequestForGettingValue(a, _onRequestForGettingSettingsByPopupPage, sendResponse);
      case messageForGettingSettingsBySettingsPage:
        return _emitRequestForGettingValue(a, _onRequestForGettingSettingsBySettingsPage, sendResponse);
    }

    const header = message[0];
    switch (header) {
      case headerForTranslatingTextFragments:
        return _emitRequestForTranslatingTextFragments(a, message, sendResponse);
      case headerForUpdatingSettings:
        return _emitRequestForUpdatingSettings(a, message, sendResponse);
    }
  };

  const _emitRequestForGettingValue = (acceptorOfRequests, nameOfListener, sendResponse) =>
    acceptorOfRequests[nameOfListener](sendResponse);

  const _emitRequestForTranslatingTextFragments = (acceptorOfRequests, message, sendResponse) => {
    const [, codeOfSourceLanguage, codeOfTargetLanguage, textFragments] = message;
    return acceptorOfRequests[_onRequestForTranslatingTextFragments](
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      textFragments,
      sendResponse
    );
  };

  const _emitRequestForUpdatingSettings = (acceptorOfRequests, message, sendResponse) => {
    const [, changes] = message;
    const sendOkStatus = _createSendingOkStatusFn(sendResponse);
    return acceptorOfRequests[_onRequestForUpdatingSettings](changes, sendOkStatus);
  };

  const _createSendingOkStatusFn = (sendResponse) => sendResponse.bind(null, defaultSuccesStatus);

  return emitEventByIncomingMessage;
})();

export default createAcceptorOfRequestsFromScriptsOfExtension;
