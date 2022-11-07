"use strict";

import {
  messageForGettingNameOfCssClassForCurrentUiTheme,
  messageForGettingSettingsByPopupPage
} from "../../../common/js/data/messaging/messagesToBackgroundScript.js";

import requestUpdatingSettingsToBackgroundScript from
  "../../../common/js/utils/requestUpdatingSettingsToBackgroundScript.js";
import sendRequestToBackgroundScriptAsync from
  "../../../common/js/utils/webExtensions/sendRequestToBackgroundScriptAsync/index.js";


const createConnectionToBackgroundScript = (senderOfMessagesToBackgroundScript) => {
  return {
    [_sender]: senderOfMessagesToBackgroundScript,
    requestGettingNameOfCssClassForCurrentUiTheme() {
      return sendRequestToBackgroundScriptAsync(
        this[_sender],
        messageForGettingNameOfCssClassForCurrentUiTheme
      );
    },
    requestGettingSettings() {
      return sendRequestToBackgroundScriptAsync(this[_sender], messageForGettingSettingsByPopupPage);
    },
    requestUpdatingSettings: requestUpdatingSettingsToBackgroundScript.bind(null, senderOfMessagesToBackgroundScript)
  };
};

const _sender = "_";

export default createConnectionToBackgroundScript;
