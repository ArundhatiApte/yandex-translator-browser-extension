"use strict";

import { equal as expectEqual } from "assert/strict";

import checkSendingRequest from "../utils/checkSendingRequest.js";
import requestTranslatingTextFragments from "./_requestTranslatingTextFragmentsWithApiKey.js";


const checkRequestWithOverflowingLimitOfCharactersText = (fullUrlToMethod, validApiKey, limitOfCharactersInText) => {
  const sendRequest = requestTranslatingTextFragments.bind(
    null,
    fullUrlToMethod,
    validApiKey,
    "cn",
    "kz",
    [createString(limitOfCharactersInText + 1)]
  );
  return checkSendingRequest(sendRequest, checkBodyOfResponse);
};

const createString = (length) => "A".repeat(length);

const checkBodyOfResponse = (bodyFromJson) => {
  expectEqual(code, bodyFromJson.code);
  expectEqual(message, bodyFromJson.message);
};

const code = 11;
const message = "Limit of characters in text";

export default checkRequestWithOverflowingLimitOfCharactersText;
