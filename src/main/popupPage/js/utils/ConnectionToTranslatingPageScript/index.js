"use strict";

import defaultSuccesStatus from "../../../../common/js/data/messaging/defaultSuccesStatus.js";
import {
  messageForGettingStateOfPage,
  headerForTranslatingPage,
  messageForShowingSourceText,
  messageForShowingTranslatedText
} from "../../../../common/js/data/messaging/messagesToTranslatingPageScript.js";

import sendRequestToTabAsync from
  "../../../../common/js/utils/webExtensions/sendRequestToTabAsync/index.js";


const createConnectionToTranslatingPageScript = (senderOfMessagesToTabs, idOfTab) => {
  if (typeof idOfTab !== "number") {
    throw new TypeError("Id вкладки нечисло.");
  }

  return {
    [_tabs]: senderOfMessagesToTabs,
    [_idOfTab]: idOfTab,

    requestGettingStateOfPageTranslation() {
      return sendRequestToTabAsync(this[_tabs], this[_idOfTab], messageForGettingStateOfPage);
    },

    requestTranslatingPage(codeOfSourceLanguage, codeOfTargetLanguage) {
      return sendRequestToTabAsync(
        this[_tabs],
        this[_idOfTab],
        [
          headerForTranslatingPage,
          codeOfSourceLanguage,
          codeOfTargetLanguage
        ]
      );
    },

    requestShowingSourceTextInPage() {
      return sendRequestToTabAsyncThenCheckResponseOnSuccesStatus(
        this[_tabs],
        this[_idOfTab],
        messageForShowingSourceText
      );
    },

    requestShowingTranslatedTextInPage() {
      return sendRequestToTabAsyncThenCheckResponseOnSuccesStatus(
        this[_tabs],
        this[_idOfTab],
        messageForShowingTranslatedText
      );
    }
  };
};

const _tabs = "_";
const _idOfTab = "_1";

const sendRequestToTabAsyncThenCheckResponseOnSuccesStatus = async (tabs, idOfTab, message) => {
  const response = await sendRequestToTabAsync(tabs, idOfTab, message);
  if (response !== defaultSuccesStatus) {
    throw new Error("Ответ отличается от статуса ok.");
  }
};

export default createConnectionToTranslatingPageScript;
