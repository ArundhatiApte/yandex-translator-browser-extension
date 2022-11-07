"use strict";

import {
  headerForTranslationOfTextFragments
} from "../../../common/js/data/messaging/messagesToBackgroundScript.js";

import sendRequestToBackgroundScriptAsync from
  "../../../common/js/utils/webExtensions/sendRequestToBackgroundScriptAsync/index.js";


const createConnectionToBackgroundScript = (senderOfMessageToBackgroundScript /* chrome.runtime */) => {
  return {
    requestTranslationOfTextFragments(
      codeOfSourceLanguage,
      codeOfTargetLanguage,
      textFragments
    ) {
      return sendRequestToBackgroundScriptAsync(senderOfMessageToBackgroundScript, [
        headerForTranslationOfTextFragments,
        codeOfSourceLanguage,
        codeOfTargetLanguage,
        textFragments
      ]);
    }
  };
};

export default createConnectionToBackgroundScript;
