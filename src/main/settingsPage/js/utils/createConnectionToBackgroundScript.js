"use strict";

import { messageForGettingSettingsBySettingsPage } from
  "../../../common/js/data/messaging/messagesToBackgroundScript.js";
import requestUpdatingSettingsToBackgroundScript from
  "../../../common/js/utils/requestUpdatingSettingsToBackgroundScript.js";
import sendRequestToBackgroundScriptAsync from
  "../../../common/js/utils/webExtensions/sendRequestToBackgroundScriptAsync/index.js";


const createConnectionToBackgroundScript = (senderOfMessagesToBackgroundScript) => {
  return {
    [_senderOfMessages]: senderOfMessagesToBackgroundScript,

    requestGettingSettings() {
      return sendRequestToBackgroundScriptAsync(this[_senderOfMessages], messageForGettingSettingsBySettingsPage);
    },

    requestUpdatingSettings: requestUpdatingSettingsToBackgroundScript.bind(null, senderOfMessagesToBackgroundScript)
  };
};

const _senderOfMessages = "_";

export default createConnectionToBackgroundScript;
