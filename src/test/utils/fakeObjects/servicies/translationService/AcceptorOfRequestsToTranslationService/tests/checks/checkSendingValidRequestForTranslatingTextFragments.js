"use strict";

import { isDeepStrictEqual as areDeepEqual } from "util";
import fetch from "node-fetch";

import createCheckingSendingValidRequestFn from "./utils/createCheckingSendingValidRequestFn.js";


const sendedApiKey = "abcd";

const sendedDataAboutText = {
  sourceLanguageCode: "az",
  texts: ["aosadij", "loc-pol", "hiluha", "muvanga"],
  targetLanguageCode: "by"
};

const sendedTranslation = {
  translations: [
    { text: "translated" },
    { text: "list" },
    { text: "of" },
    { text: "words" }
  ]
};

const checkSendingValidRequest = createCheckingSendingValidRequestFn(
  function setSendingResponseListener(acceptor) {
    return acceptor.setRequestForTranslatingTextFragmentsListener((
      request,
      apiKey,
      dataAboutText,
      senderOfResponse
    ) => {
      if (apiKey === sendedApiKey && isValidDataAboutText(dataAboutText, sendedDataAboutText)) {
        senderOfResponse.sendTranslation(sendedTranslation);
      }
      else {
        senderOfResponse.terminateConnection();
      }
    });
  },
  sendedTranslation,
  function sendRequest(url) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Api-Key " + sendedApiKey
      },
      body: JSON.stringify(sendedDataAboutText)
    });
  }
);

const isValidDataAboutText = (dataFromRequest, sendedData) => {
  return (
    dataFromRequest.codeOfSourceLanguage === sendedData.sourceLanguageCode &&
    dataFromRequest.codeOfTargetLanguage === sendedData.targetLanguageCode &&
    areDeepEqual(dataFromRequest.textFragments, sendedData.texts)
  );
};

export default checkSendingValidRequest;
