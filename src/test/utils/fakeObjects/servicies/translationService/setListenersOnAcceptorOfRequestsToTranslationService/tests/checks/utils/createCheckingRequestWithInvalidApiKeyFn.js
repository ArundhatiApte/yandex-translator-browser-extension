"use strict";

import { equal as expectEqual, ok as expectTrue } from "assert/strict";

import fetch from "node-fetch";

import createCurringFnFactory from "../../../../../../../createCurringFnFactory.js";
import checkSendingRequest from "./checkSendingRequest.js";


const createCheckingRequestWithInvalidApiKeyFn = createCurringFnFactory(
  function checkgRequestWithInvalidApiKey(sendRequest, fullUrlToMethod, invalidApiKey) {
    return checkSendingRequest(sendRequest.bind(null, fullUrlToMethod, invalidApiKey), checkBodyOfResponse);
  }
);

const requestWithApiKey = (fullUrlToMethod, apiKey) => {
  return fetch(fullUrlToMethod, {
    method: "POST",
    headers: { "Authorization": "Api-Key " + apiKey }
  });
};

const checkBodyOfResponse = (body) => {
  expectTrue(body.message.startsWith(prefix));
  expectEqual(codeOfUnauthorization, body.code);
};

const prefix = "Unknown api key '";
const codeOfUnauthorization = 16;

export default createCheckingRequestWithInvalidApiKeyFn;
