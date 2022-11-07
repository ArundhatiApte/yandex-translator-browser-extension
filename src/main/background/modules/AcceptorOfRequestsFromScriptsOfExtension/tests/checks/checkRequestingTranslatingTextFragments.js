"use strict";

import { ok as expectTrue, equal as expectEqual } from "assert/strict";

import statusesOfResponse from "./../../../../../common/js/data/statusesOfResponse/translation.js";
import createConnectionToBackgroundScript from
  "./../../../../../contentScripts/translatingPageScript/utils/createConnectionToBackgroundScript.js";


const checkRequestingTranslatingTextFragments = async (fakeSenderOfMessages, acceptorOfRequests) => {
  const sendedCodeOfSourceLanguage = "sl";
  const sendedCodeOfTargetLanguage = "tl";
  const sendedTextFragments = ["список частей ", "текста"];
  let isEventValid;

  acceptorOfRequests.setRequestForTranslatingTextFragmentsListener(
    function(codeOfSourceLanguage, codeOfTargetLanguage, textFragments, sendResponse) {
      isEventValid =
        codeOfSourceLanguage === sendedCodeOfSourceLanguage &&
        codeOfTargetLanguage === sendedCodeOfTargetLanguage &&
        // без глубокого сравнения
        textFragments === sendedTextFragments;
      sendResponse(sendedResponse);
    }
  );
  const sendedResponse = { s: statusesOfResponse.ok, r: ["переведённые части ", "текста"] };

  const connection = createConnectionToBackgroundScript(fakeSenderOfMessages);
  const receivedResponse = await connection.requestTranslationOfTextFragments(
    sendedCodeOfSourceLanguage,
    sendedCodeOfTargetLanguage,
    sendedTextFragments
  );

  expectTrue(isEventValid);
  // без глубокого сравнения
  expectEqual(sendedResponse, receivedResponse);
};

export default checkRequestingTranslatingTextFragments;
