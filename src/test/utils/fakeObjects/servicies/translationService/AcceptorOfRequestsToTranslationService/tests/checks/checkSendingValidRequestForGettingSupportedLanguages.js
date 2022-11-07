"use strict";

import fetch from "node-fetch";

import { createArrayBufferWithUtf8FromString } from "../../../../../../encodingDecodingStringInUtf8.js";
import createCheckingSendingValidRequestFn from "./utils/createCheckingSendingValidRequestFn.js";


const sendedApiKey = "abcd";
const language = (isoCode, nameInThatLanguage) => ({ code: isoCode, name: nameInThatLanguage });

const sendedSupportedLanguages = [
  language("mr", "Mioasal"),
  language("ol", "Oleknia")
];

const checkSendingValidRequest = createCheckingSendingValidRequestFn(
  function setSendingResponseListener(acceptor) {
    return acceptor.setRequestForGettingSupportedLanguagesListener(function(request, apiKey, senderOfResponse) {
      if (apiKey === sendedApiKey) {
        senderOfResponse.sendSupportedLanguages(
          createArrayBufferWithUtf8FromString(JSON.stringify(sendedSupportedLanguages))
        );
      }
      else {
        senderOfResponse.terminateConnection();
      }
    });
  },
  sendedSupportedLanguages,
  function sendRequest(url) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Api-Key " + sendedApiKey
      }
    });
  }
);

export default checkSendingValidRequest;
