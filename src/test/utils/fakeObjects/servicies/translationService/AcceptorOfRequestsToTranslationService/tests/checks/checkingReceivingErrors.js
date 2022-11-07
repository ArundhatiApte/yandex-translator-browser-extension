"use strict";

import { equal as expectEqual } from "assert/strict";

import fetch from "node-fetch";

import createCurringFnFactory from "../../../../../../createCurringFnFactory.js";


const createCheckingReceivingErrorFn = createCurringFnFactory(
  async function checkgReceivingError(setSendingErrorListener, sendRequest, url, acceptor) {
    const httpCode = "401";
    const errorStatus = 16;
    const errorMessage = "Unknown api key";

    setSendingErrorListener(acceptor, httpCode, errorStatus, errorMessage);
    const response = await sendRequest(url);
    await checkResponse(response, errorStatus, errorMessage);
  }
);

const checkResponse = async (response, errorStatus, errorMessage) => {
  const headers = response.headers;
  expectEqual(parseInt(headers.get("grpc-status")), errorStatus);
  expectEqual(headers.get("grpc-message"), errorMessage);

  const body = await response.json();
  expectEqual(body.code, errorStatus);
  expectEqual(body.message, errorMessage);
};

// Gsl = GettingSupportedLanguages
export const checkReceivingErrorForGsl = createCheckingReceivingErrorFn(
  (acceptor, httpCode, errorStatus, errorMessage) => (
    acceptor.setRequestForGettingSupportedLanguagesListener((_, __, senderOfResponse) => (
      senderOfResponse.sendError(httpCode, errorStatus, errorMessage)
    ))
  ),
  (url) => (
    fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Api-Key abcd"
      }
    })
  )
);

// Ttf = TranslatingTextFragments
export const checkReceivingErrorForTtf = createCheckingReceivingErrorFn(
  (acceptor, httpCode, errorStatus, errorMessage) => (
    acceptor.setRequestForTranslatingTextFragmentsListener((_, __, ____, senderOfResponse) => (
      senderOfResponse.sendError(httpCode, errorStatus, errorMessage)
    ))
  ),
  (url) => (
    fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Api-Key abcd"
      },
      body: "{}"
    })
  )
);
